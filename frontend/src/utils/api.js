export const generateReport = async (formData) => {
    const response = await fetch("http://localhost:3000/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error("Failed to generate report");
    return response.text();
};
