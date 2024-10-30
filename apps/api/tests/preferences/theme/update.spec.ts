import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /preferences/theme/update", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(
        `${TEST_URL}/preferences/theme/update`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body (missing required fields)", async () => {
    try {
      await axios.post(
        `${TEST_URL}/preferences/theme/update`,
        { randomField: "invalid" },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and update the profile theme", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/preferences/theme/update`,
      { fontStyle: "bioRhyme" },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.fontStyle).toBe("bioRhyme");
  });
});
