import api from "../hooks/axios";
import { wait } from "../utils/utils";
import { adminRequests } from "../constants/requests";
import { GetAdminsResponse, Admin } from "../types/admin.types";

export const getAdmins = async (): Promise<GetAdminsResponse> => {
  await wait(500);
  const response = await api.get(adminRequests.getAdmins.url);

  return response.data;
};

export const toggleAdminStatus = async (
  adminId: string,
  status: string | null
): Promise<Admin> => {
  const response = await api.put(
    adminRequests.toggleAdminStatus.url + adminId,
    {
      status,
    }
  );

  return response.data;
};
