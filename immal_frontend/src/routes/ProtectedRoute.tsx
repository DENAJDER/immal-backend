import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  return auth.account ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
