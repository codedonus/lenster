import { HEY_API_URL } from "@hey/data/constants";
import type { Permission } from "@hey/types/hey";
import axios from "axios";

export const GET_ALL_PERMISSIONS_QUERY_KEY = "getAllPermissions";

/**
 * Get all permissions
 * @param headers auth headers
 * @returns all permissions
 */
const getAllPermissions = async (headers: any): Promise<Permission[]> => {
  const response = await axios.get(`${HEY_API_URL}/internal/permissions/all`, {
    headers
  });
  const { data } = response;

  return data?.permissions || [];
};

export default getAllPermissions;
