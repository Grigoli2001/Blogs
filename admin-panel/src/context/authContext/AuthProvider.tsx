import {
  createContext,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  ReactNode,
  useReducer,
} from "react";
import api from "../../hooks/axios";
import { AuthActionTypes, AuthContextType } from "../../types/auth.types";
import {
  login as loginApi,
  logout as logoutApi,
  getMe as getMeApi,
  refreshToken,
} from "../../api/auth";
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { authReducer, initialState } from "./AuthReducer";

export const AuthContext = createContext<AuthContextType | null>(null);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const tokenRef = useRef(state.token);

  const fetchUser = useCallback(async () => {
    try {
      const fetchedUser = await getMeApi();
      dispatch({
        type: AuthActionTypes.SET_USER,
        payload: { user: fetchedUser },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (state.isAuthenticated) {
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: true },
        });
        try {
          await fetchUser();
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          dispatch({
            type: AuthActionTypes.SET_LOADING,
            payload: { isLoading: false },
          });
        }
      } else {
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: false },
        });
      }
    };

    initializeAuth();
  }, [state.isAuthenticated, fetchUser]);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      dispatch({
        type: AuthActionTypes.SET_LOADING,
        payload: { isLoading: true },
      });
      try {
        const response = await loginApi(email, password);
        const { accessToken } = response;

        if (rememberMe) {
          localStorage.setItem("accessToken", accessToken);
        } else {
          sessionStorage.setItem("accessToken", accessToken);
        }

        dispatch({
          type: AuthActionTypes.LOGIN,
          payload: { token: accessToken },
        });
        await fetchUser();
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: { isLoading: false },
        });
      }
    },
    [fetchUser]
  );

  const logout = useCallback(async () => {
    dispatch({
      type: AuthActionTypes.SET_LOADING,
      payload: { isLoading: true },
    });
    try {
      await logoutApi();
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      dispatch({ type: AuthActionTypes.LOGOUT });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({
        type: AuthActionTypes.SET_LOADING,
        payload: { isLoading: false },
      });
    }
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        if (!config._retry && tokenRef.current) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }
        return config;
      }
    );

    const refreshInterceptor = api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const errorMessage = (error.response?.data as { message?: string })
          ?.message;
        if (
          error.response?.status === 401 &&
          !originalRequest?._retry &&
          errorMessage === "Invalid token"
        ) {
          originalRequest._retry = true;
          try {
            const { accessToken } = await refreshToken();
            console.log("Access token refreshed:", accessToken);
            if (!accessToken) {
              throw new Error("Access token not found");
            }
            if (localStorage.getItem("accessToken")) {
              localStorage.setItem("accessToken", accessToken);
            } else {
              sessionStorage.setItem("accessToken", accessToken);
            }
            dispatch({
              type: AuthActionTypes.LOGIN,
              payload: { token: accessToken },
            });
            tokenRef.current = accessToken;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            logout();
          }
        } else if (
          error.response?.status === 401 &&
          errorMessage === "No session user provided"
        ) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(authInterceptor);
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [logout]);

  useEffect(() => {
    tokenRef.current = state.token;
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
