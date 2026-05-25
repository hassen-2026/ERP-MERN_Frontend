import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logoutUser } from "../redux/reducers/UserReducer";

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return <Navigate to="/login" replace />;
}

export default Logout;