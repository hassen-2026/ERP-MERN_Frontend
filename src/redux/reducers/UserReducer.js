import { login as loginRequest } from "../../services/authService";

export const SET_TOKEN = "SET_TOKEN";
export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_AUTH_ERROR = "CLEAR_AUTH_ERROR";
export const LOGOUT = "LOGOUT";

export const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const resolveUserWithRole = (data) => {
  const resolvedUser = data?.user || null;
  const role = resolvedUser?.role || data?.role || resolvedUser?.type || "user";

  return {
    ...(resolvedUser || {}),
    role,
  };
};

export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const setUser = (user) => ({ type: SET_USER, payload: user });
export const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
export const setAuthError = (message) => ({ type: SET_ERROR, payload: message });
export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });
export const logout = () => ({ type: LOGOUT });

export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    dispatch(clearAuthError());

    try {
      const data = await loginRequest(email, password);

      if (!data?.token) {
        const invalidResponse = "Reponse du serveur invalide.";
        dispatch(setAuthError(invalidResponse));
        dispatch(setLoading(false));
        return { success: false, error: invalidResponse };
      }

      const user = resolveUserWithRole(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", user.role || "user");

      dispatch(setToken(data.token));
      dispatch(setUser(user));
      dispatch(setLoading(false));

      return { success: true, user };
    } catch (error) {
      const message =
        error?.response?.data?.message || "Identifiants invalides ou erreur serveur.";

      dispatch(setAuthError(message));
      dispatch(setLoading(false));
      return { success: false, error: message };
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch(logout());
  };
};

function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_AUTH_ERROR:
      return { ...state, error: null };
    case LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

export default UserReducer;
