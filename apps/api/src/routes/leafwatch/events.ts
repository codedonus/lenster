import { ALL_EVENTS } from "@hey/data/tracking";
import { rPushRedis } from "@hey/db/redisClient";
import getIp from "@hey/helpers/getIp";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import findEventKeyDeep from "src/helpers/leafwatch/findEventKeyDeep";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { invalidBody, noBody } from "src/helpers/responses";
import { UAParser } from "ua-parser-js";
import { any, array, object, string } from "zod";

interface ExtensionRequest {
  events: {
    fingerprint?: string;
    name: string;
    properties?: string;
    referrer?: string;
    url: string;
  }[];
}

const validationSchema = object({
  events: array(
    object({
      fingerprint: string().nullable().optional(),
      name: string().min(1),
      properties: any(),
      referrer: string().nullable().optional(),
      url: string()
    })
  )
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { events } = body as ExtensionRequest;

    for (const event of events) {
      if (!findEventKeyDeep(ALL_EVENTS, event.name)?.length) {
        return res
          .status(400)
          .json({ error: "Invalid event found!", success: false });
      }
    }

    const userAgent = req.headers["user-agent"];
    const ip = getIp(req);
    const cfIpCity = req.headers["cf-ipcity"];
    const cfIpCountry = req.headers["cf-ipcountry"];
    const identityToken = req.headers["x-identity-token"] as string;

    try {
      const parser = new UAParser(userAgent || "");
      const ua = parser.getResult();

      const payload = parseJwt(identityToken);

      const values = events.map((event) => ({
        actor: payload.id || null,
        browser: ua.browser.name || null,
        city: cfIpCity || null,
        country: cfIpCountry || null,
        created: new Date().toISOString().slice(0, 19).replace("T", " "),
        fingerprint: event.fingerprint || null,
        ip: ip || null,
        name: event.name,
        properties: event.properties || null,
        referrer: event.referrer || null,
        url: event.url || null
      }));

      const queue = await rPushRedis("events", JSON.stringify(values));
      logger.info(`Ingested ${values.length} events to Leafwatch`);

      return res.status(200).json({ queue, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
