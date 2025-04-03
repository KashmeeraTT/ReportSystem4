import React, { useState } from "react";
import "./Form.css";
import "../../styles/global.css";

const englishMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const englishDistricts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const Form = ({
  onGenerateReport,
  isEditable,
  setReportPages,
  setIsEditable,
  updatedReportPages,
  language
}) => {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    day: "",
    district: ""
  });

  const translations = {
    en: {
      year: "Year",
      month: "Month",
      day: "Day",
      district: "District",
      selectMonth: "Select a month",
      selectDay: "Select a day",
      selectDistrict: "Select a district",
      generate: "Generate Report",
      reEnter: "Re-enter Details",
      download: "Download Report",
      months: englishMonths,
      districts: englishDistricts,
      monthsDisplay: englishMonths,
      districtsDisplay: englishDistricts
    },
    si: {
      year: "වර්ෂය",
      month: "මාසය",
      day: "දිනය",
      district: "දිස්ත්‍රික්කය",
      selectMonth: "මාසයක් තෝරන්න",
      selectDay: "දිනයක් තෝරන්න",
      selectDistrict: "දිස්ත්‍රික්කයක් තෝරන්න",
      generate: "වාර්තාව ජනනය කරන්න",
      reEnter: "විස්තර නැවත ඇතුළත් කරන්න",
      download: "වාර්තාව බාගන්න",
      months: englishMonths,
      districts: englishDistricts,
      monthsDisplay: [
        "ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි",
        "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්"
      ],
      districtsDisplay: [
        "අම්පාර", "අනුරාධපුර", "බදුල්ල", "බටිකලෝව", "කොළඹ",
        "ගාල්ල", "ගමපහ", "හම්බන්තොට", "යාපනය", "කළුතර",
        "මහනුවර", "කෑගල්ල", "කිලිනොච්චිය", "කුරුණෑගල", "මන්නාරම",
        "මාතලේ", "මාතර", "මොනරාගල", "මුලතිව්", "නුවර එලිය",
        "පොළොන්නරුව", "පුත්තලම", "රත්නපුර", "ත්‍රිකුණාමලය", "වවුනියාව"
      ]
    },
    ta: {
      year: "ஆண்டு",
      month: "மாதம்",
      day: "திகதி",
      district: "மாவட்டம்",
      selectMonth: "ஒரு மாதத்தைத் தேர்ந்தெடுக்கவும்",
      selectDay: "திகதியைத் தேர்ந்தெடுக்கவும்",
      selectDistrict: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
      generate: "அறிக்கையை உருவாக்குக",
      reEnter: "விவரங்களை மீண்டும் உள்ளிடவும்",
      download: "அறிக்கையை பதிவிறக்கவும்",
      months: englishMonths,
      districts: englishDistricts,
      monthsDisplay: [
        "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
        "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
      ],
      districtsDisplay: [
        "அம்பாறை", "அனுராதபுரம்", "பதுளை", "மட்டக்களப்பு", "கொழும்பு",
        "காலி", "கம்பஹா", "அம்பாந்தோட்டை", "யாழ்ப்பாணம்", "களுத்துறை",
        "கண்டி", "கேகாலை", "கிலிநொச்சி", "குறுநாகல்", "மன்னார்",
        "மாத்தளை", "மாத்தறை", "மொனராகலை", "முல்லைத்தீவு", "நுவரெலியா",
        "பொலன்னறுவை", "புத்தளம்", "இரத்தினபுரி", "திருகோணமலை", "வவுனியா"
      ]
    }
  };

  const t = translations[language] || translations["en"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerateReport({ ...formData, language });
  };

  const handleReEnter = () => {
    setReportPages([]);
    setIsEditable(true);
    setFormData({ year: "", month: "", day: "", district: "" });
  };

  const handleDownload = () => {
    if (updatedReportPages.length > 0) {
      try {
        const filename = `${formData.district}_Report_${formData.day}_${formData.month}_${formData.year}.html`;
        const blob = new Blob([updatedReportPages.join("\n")], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading:", err);
        alert("Failed to download the report. Please try again.");
      }
    } else {
      alert("No report available to download.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {["year", "month", "day", "district"].map((field) => (
        <div className="form-group" key={field}>
          <label htmlFor={field} className="label">{t[field]}:</label>
          {field === "year" ? (
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
          ) : (
            <select
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="input"
              required
              disabled={!isEditable}
            >
              <option value="">{t[`select${field[0].toUpperCase() + field.slice(1)}`]}</option>
              {(field === "month" ? t.monthsDisplay : field === "district" ? t.districtsDisplay : [...Array(31).keys()].map(i => i + 1)).map((value, index) => (
                <option key={index} value={t.months?.[index] || t.districts?.[index] || value}>{value}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button type="submit" className="button" disabled={!isEditable}>{t.generate}</button>

      {!isEditable && (
        <div className="button-group">
          <button className="button re-enter-button" onClick={handleReEnter}>{t.reEnter}</button>
          <button className="button download-button" onClick={handleDownload}>{t.download}</button>
        </div>
      )}
    </form>
  );
};

export default Form;
