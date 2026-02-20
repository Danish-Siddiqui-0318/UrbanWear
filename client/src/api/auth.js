const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options && options.headers),
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data && data.message ? data.message : "Request failed";
        throw new Error(message);
    }

    return data;
}

export async function login(payload) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function register(payload) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
