// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useSelector((store) => store.auth);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user || user.role !== "recruiter") {
//       navigate("/");
//     }
//   }, [user, navigate]); // Added dependencies

//   // Optionally show a loader while user state is being checked
//   if (user === undefined) {
//     return <div>Loading...</div>;
//   }

//   return children; // Directly return children
// };

// export default ProtectedRoute;

import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedRoute() {
  const { user } = useSelector((state) => state.user);

  // Allow access for 'owner' only
  return user && user.role === 'recruiter' ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}