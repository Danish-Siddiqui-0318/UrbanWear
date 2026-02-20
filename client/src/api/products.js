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

export async function fetchProducts({ page = 1, limit = 8 } = {}) {
    return request(`/products/products?page=${page}&limit=${limit}`, {
        method: "GET",
    });
}

