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
    const role = localStorage.getItem("role");

    if (!token) {
        return {
            token: null,
            role: null,
            isAdmin: false,
            isAuthenticated: false,
        };
    }

    const payload = parseJwt(token);
    if (payload && typeof payload.exp === "number") {
        const nowInSeconds = Date.now() / 1000;
        if (payload.exp < nowInSeconds) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("name");

            return {
                token: null,
                role: null,
                isAdmin: false,
                isAuthenticated: false,
            };
        }
    }

    const isAdmin = role === "admin";

    return {
        token,
        role,
        isAdmin,
        isAuthenticated: true,
    };
}

