import React, { useState } from "react";
import "./Form.css";
import "../../styles/global.css";

const Form = ({ onGenerateReport, isEditable, setReportPages, setIsEditable, reportPages }) => {
    const [formData, setFormData] = useState({
        year: "",
        month: "",
        day: "",
        district: "",
    });

    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
        "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerateReport(formData);
    };

    // Handle report re-entry (reset form)
    const handleReEnter = () => {
        setReportPages([]); // Clear the report state
        setIsEditable(true); // Make form editable
        setFormData({
            year: "",
            month: "",
            day: "",
            district: "",
        }); // Reset form data
    };

    // Handle report download
    const handleDownload = () => {
        if (reportPages.length > 0) {
            const filename = `${formData.district}_Report_${formData.day}_${formData.month}_${formData.year}.html`;
            const blob = new Blob([reportPages.join("\n")], { type: "text/html" }); // Combine all pages into a single HTML file
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert("No report available to download.");
        }
    };

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="year" className="label">Year:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="input"
                        required
                        min="1900"
                        max="2100"
                        disabled={!isEditable}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="month" className="label">Month:</label>
                    <select
                        id="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        className="input"
                        required
                        disabled={!isEditable}
                    >
                        <option value="">Select a month</option>
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December",
                        ].map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="day" className="label">Day:</label>
                    <select
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        className="input"
                        required
                        disabled={!isEditable}
                    >
                        <option value="">Select a day</option>
                        {[...Array(31).keys()].map((day) => (
                            <option key={day + 1} value={day + 1}>{day + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="district" className="label">District:</label>
                    <select
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="input"
                        required
                        disabled={!isEditable}
                    >
                        <option value="">Select a district</option>
                        {districts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="button"
                    disabled={!isEditable}
                >
                    Generate Report
                </button>
                {!isEditable && (
                    <div className="button-group">
                        <button
                            className="button re-enter-button"
                            onClick={handleReEnter}
                        >
                            Re-enter Details
                        </button>
                        <button
                            className="button download-button"
                            onClick={handleDownload}
                        >
                            Download Report
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Form;
