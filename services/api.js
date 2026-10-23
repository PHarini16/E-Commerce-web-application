const API_URL = "http://127.0.0.1:8000";

export async function login(username, password) {
    const response = await fetch(
        `${API_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
            method: "POST"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "Login failed");
    }

    return data;
}

export async function getDashboard() {
    const response = await fetch(
        `${API_URL}/dashboard`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to load dashboard"
        );
    }

    return data;
}

export { API_URL };