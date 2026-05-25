import { getUserById, updateUser } from "../../services/userApi";

export const SET_PROFILE = "SET_PROFILE";
export const SET_PROFILE_LOADING = "SET_PROFILE_LOADING";
export const SET_PROFILE_ERROR = "SET_PROFILE_ERROR";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CLEAR_PROFILE_ERROR = "CLEAR_PROFILE_ERROR";
export const RESET_PROFILE = "RESET_PROFILE";

export const initialState = {
  profileData: null,
  loading: false,
  error: null,
};

export const setProfile = (profileData) => ({ type: SET_PROFILE, payload: profileData });
export const setProfileLoading = (loading) => ({ type: SET_PROFILE_LOADING, payload: loading });
export const setProfileError = (error) => ({ type: SET_PROFILE_ERROR, payload: error });
export const clearProfileError = () => ({ type: CLEAR_PROFILE_ERROR });
export const updateProfileAction = (profileData) => ({ type: UPDATE_PROFILE, payload: profileData });
export const resetProfile = () => ({ type: RESET_PROFILE });

export const fetchProfile = (userId) => {
  return async (dispatch) => {
    dispatch(setProfileLoading(true));
    dispatch(clearProfileError());

    try {
      const data = await getUserById(userId);

      if (!data) {
        const errorMsg = "Impossible de charger le profil.";
        dispatch(setProfileError(errorMsg));
        dispatch(setProfileLoading(false));
        return { success: false, error: errorMsg };
      }

      dispatch(setProfile(data));
      dispatch(setProfileLoading(false));
      return { success: true, data };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Erreur lors du chargement du profil.";

      dispatch(setProfileError(errorMsg));
      dispatch(setProfileLoading(false));
      return { success: false, error: errorMsg };
    }
  };
};

export const updateProfileThunk = (userId, profileData) => {
  return async (dispatch) => {
    dispatch(setProfileLoading(true));
    dispatch(clearProfileError());

    try {
      const data = await updateUser(userId, profileData);

      if (!data) {
        const errorMsg = "Impossible de mettre à jour le profil.";
        dispatch(setProfileError(errorMsg));
        dispatch(setProfileLoading(false));
        return { success: false, error: errorMsg };
      }

      dispatch(setProfile(data));
      dispatch(updateProfileAction(data));
      dispatch(setProfileLoading(false));
      return { success: true, data };
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Erreur lors de la mise à jour du profil.";

      dispatch(setProfileError(errorMsg));
      dispatch(setProfileLoading(false));
      return { success: false, error: errorMsg };
    }
  };
};

function ProfileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, profileData: action.payload };
    case SET_PROFILE_LOADING:
      return { ...state, loading: action.payload };
    case SET_PROFILE_ERROR:
      return { ...state, error: action.payload };
    case UPDATE_PROFILE:
      return { ...state, profileData: { ...state.profileData, ...action.payload } };
    case CLEAR_PROFILE_ERROR:
      return { ...state, error: null };
    case RESET_PROFILE:
      return { ...initialState };
    default:
      return state;
  }
}

export default ProfileReducer;
