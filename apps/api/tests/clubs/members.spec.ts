import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../helpers/constants";

describe("POST /clubs/members", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/clubs/members`, {});
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body (limit exceeds max value)", async () => {
    try {
      await axios.post(`${TEST_URL}/clubs/members`, {
        id: "test_id",
        limit: 100 // Invalid, exceeds the max limit of 50
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and fetch club members for valid body", async () => {
    const { data, status } = await axios.post(`${TEST_URL}/clubs/members`, {
      id: "65e6dec26d85271723b6357c",
      limit: 10
    });

    expect(status).toBe(200);
    expect(data).toBeDefined();
  });
});
