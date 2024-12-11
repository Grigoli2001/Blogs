export interface AuthContextType {
  user: MeResponse | null;

  isAuthenticated: boolean;
  isSuperAdmin: boolean;

  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;

  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface MeResponse {
  _id: string;
  name: string;
  email: string;
  superAdmin: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface LoginResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthState {
  user: MeResponse | null;
  isAuthenticated: boolean;
  token: string | null;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_USER = "SET_USER",
  SET_LOADING = "SET_LOADING",
  SET_SUPERADMIN = "SET_SUPERADMIN",
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN; payload: { token: string } }
  | { type: AuthActionTypes.LOGOUT }
  | { type: AuthActionTypes.SET_USER; payload: { user: MeResponse } }
  | { type: AuthActionTypes.SET_LOADING; payload: { isLoading: boolean } }
  | {
      type: AuthActionTypes.SET_SUPERADMIN;
      payload: { isSuperAdmin: boolean };
    };
