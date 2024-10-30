import { APP_NAME } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import sendEmailToProfile from "src/helpers/email/sendEmailToProfile";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import sendSlackMessage from "src/helpers/slack";
import { boolean, object, string } from "zod";

export const postUpdateTasks = async (
  profileId: string,
  permissionId: string,
  enabled: boolean
) => {
  await delRedis(`preference:${profileId}`);
  await delRedis(`profile:${profileId}`);

  await sendSlackMessage({
    channel: "#permissions",
    color: enabled ? "#16a34a" : "#dc2626",
    text: `:hey: Permission: ${permissionId} has been ${enabled ? "enabled" : "disabled"} for ${profileId}`
  });

  if (permissionId === PermissionId.StaffPick) {
    if (enabled) {
      sendEmailToProfile({
        id: profileId,
        subject: `Your account on ${APP_NAME} has been Staff Picked!`,
        body: `
          <html>
            <body>
              <p>Hey Hey!</p>
              <br />
              <p>Yay! Your account on ${APP_NAME} has been Staff Picked! 🌸</p>
              <br />
              <p>Thanks,</p>
              <p>${APP_NAME} team</p>
            </body>
          </html>
        `
      });
    }
    delRedis("staff-picks");
  }

  if (permissionId === PermissionId.Verified) {
    if (enabled) {
      sendEmailToProfile({
        id: profileId,
        subject: `Your account on ${APP_NAME} has been verified!`,
        body: `
          <html>
            <body>
              <p>Hey Hey!</p>
              <br />
              <p>Yay! Your account on ${APP_NAME} has been verified! ✅</p>
              <a href="https://hey.xyz/profile/${profileId}">Visit your profile →</a>
              <br />
              <p>Thanks,</p>
              <p>${APP_NAME} team</p>
            </body>
          </html>
        `
      });
    }
    await delRedis("verified");
  }
};

interface ExtensionRequest {
  enabled: boolean;
  id: string;
  profile_id: string;
}

const validationSchema = object({
  enabled: boolean(),
  id: string(),
  profile_id: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { enabled, id, profile_id } = body as ExtensionRequest;

    try {
      if (enabled) {
        await prisma.profilePermission.create({
          data: { permissionId: id, profileId: profile_id }
        });

        await postUpdateTasks(profile_id, id, true);
        logger.info(`Enabled permissions for ${profile_id}`);

        return res.status(200).json({ enabled, success: true });
      }

      await prisma.profilePermission.deleteMany({
        where: { permissionId: id as string, profileId: profile_id as string }
      });

      await postUpdateTasks(profile_id, id, false);
      logger.info(`Disabled permissions for ${profile_id}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
