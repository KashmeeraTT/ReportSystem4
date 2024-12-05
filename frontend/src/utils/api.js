import API_BASE_URL from "../config";

export const generateReport = async (formData) => {
    const response = await fetch("API_BASE_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error("Failed to generate report");
    return response.text();
};
