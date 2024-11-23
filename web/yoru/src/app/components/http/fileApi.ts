const BaseUrl = "http://localhost:8888"; // Add "http://" or "https://"

export const $httpFormData = async (data: FormData, url: string) => {
    let headers: Record<string, string> = {};

    const token = localStorage.getItem("token");
    if (token) {
        headers['Authorization'] = `${token}`;
    }
    let fullUrl = `${BaseUrl}${url}`;
    try {
        const response = await fetch(fullUrl, {
            method: "POST",
            headers: headers,
            body: data,
        });
        return response.json();
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
};
