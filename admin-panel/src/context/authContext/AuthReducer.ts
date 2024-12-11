import { AuthState, AuthActionTypes, AuthAction } from "../../types/auth.types";

export const initialState: AuthState = {
  user: null,
  isAuthenticated:
    !!localStorage.getItem("accessToken") ||
    !!sessionStorage.getItem("accessToken"),
  token:
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken"),
  isSuperAdmin: false,
  isLoading: true,
};

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        isLoading: false,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isSuperAdmin: false,
        isLoading: false,
      };
    case AuthActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isSuperAdmin: action.payload.user.superAdmin,
        isLoading: false,
      };
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case AuthActionTypes.SET_SUPERADMIN:
      return {
        ...state,
        isSuperAdmin: action.payload.isSuperAdmin,
      };

    default:
      return state;
  }
};
