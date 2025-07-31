const API_URL = "https://api.jeepedia.in/api";

if (!API_URL) {
    throw new Error("API_URL is not set");
}

export default API_URL;
