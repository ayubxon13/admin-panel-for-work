import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

export function ProtectedRoutes({
  children,
  user,
}: {
  children: ReactNode;
  user: string | null;
}) {
  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoutes;
