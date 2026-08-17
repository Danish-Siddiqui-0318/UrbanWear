function parseJwt(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            return null;
        }
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export function getAuthInfo() {
    const token = localStorage.getItem("token");

    if (!token) {
        return {
            token: null,
            role: null,
            isAdmin: false,
            isAuthenticated: false,
        };
    }

    const payload = parseJwt(token);

    if (!payload) {
        localStorage.removeItem("token");
        return {
            token: null,
            role: null,
            isAdmin: false,
            isAuthenticated: false,
        };
    }

    if (typeof payload.exp === "number") {
        const nowInSeconds = Date.now() / 1000;
        if (payload.exp < nowInSeconds) {
            localStorage.removeItem("token");
            return {
                token: null,
                role: null,
                isAdmin: false,
                isAuthenticated: false,
            };
        }
    }

    const role = payload.role || null;
    const isAdmin = role === "admin";

    return {
        token,
        role,
        isAdmin,
        isAuthenticated: true,
    };
}

