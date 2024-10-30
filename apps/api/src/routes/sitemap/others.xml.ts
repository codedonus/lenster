import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { buildUrlsetXml } from "src/helpers/sitemap/buildSitemap";

export const get = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];

  try {
    const sitemaps = [
      "https://hey.xyz",
      "https://hey.xyz/explore",
      "https://hey.xyz/thanks",
      "https://hey.xyz/terms",
      "https://hey.xyz/privacy",
      "https://hey.xyz/guidelines",
      "https://hey.xyz/copyright"
    ];

    const entries = sitemaps.map((sitemap) => ({ loc: sitemap }));
    const xml = buildUrlsetXml(entries);

    logger.info(`[Lens] Fetched other sitemaps from user-agent: ${userAgent}`);

    return res.status(200).setHeader("Content-Type", "text/xml").send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
