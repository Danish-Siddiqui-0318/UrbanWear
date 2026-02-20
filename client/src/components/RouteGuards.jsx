import { Navigate } from "react-router-dom";
import { getAuthInfo } from "../utils/auth";

export function ProtectedRoute({ children }) {
    const { isAuthenticated } = getAuthInfo();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export function PublicRoute({ children }) {
    const { isAuthenticated, isAdmin } = getAuthInfo();

    if (isAuthenticated) {
        if (isAdmin) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
}

export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin } = getAuthInfo();

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

