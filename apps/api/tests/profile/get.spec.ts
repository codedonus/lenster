import { TEST_LENS_ID, TEST_SUSPENDED_LENS_ID } from "@hey/data/constants";
import { delRedis } from "@hey/db/redisClient";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /profile/get", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/profile/get`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with status and theme", async () => {
    await delRedis(`profile:${TEST_LENS_ID}`);
    const { data, status } = await axios.get(`${TEST_URL}/profile/get`, {
      params: { id: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result.status.emoji).toBe("😀");
    expect(data.result.status.message).toBe("Status message");
    expect(data.result.isSuspended).toBe(false);
  });

  test("should return 200 and suspended status for a suspended profile", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/profile/get`, {
      params: { id: TEST_SUSPENDED_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result.isSuspended).toBe(true);
  });
});
