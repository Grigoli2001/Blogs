import api from "../hooks/axios";
import { wait } from "../utils/utils";
import { authRequests } from "../constants/requests";
import {
  LoginResponse,
  MeResponse,
  RefreshTokenResponse,
} from "../types/auth.types";
export const createAdmin = async (
  email: string,
  password: string,
  username: string
): Promise<Response> => {
  const response = await api.post(authRequests.signup.url, {
    email,
    password,
    username,
  });
  console.log("response", response);
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  await wait(500);
  const response = await api.post(authRequests.login.url, {
    email,
    password,
  });
  return response.data as LoginResponse;
};

export const logout = async (): Promise<Response> => {
  const response = await api.get(authRequests.logout.url);
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await api.get(authRequests.refreshToken.url);
  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get(authRequests.getMe.url);
  return response.data as MeResponse;
};

export const getAdmins = async (): Promise<Response> => {
  const response = await api.get(authRequests.getAdmins.url);
  return response.data;
};
