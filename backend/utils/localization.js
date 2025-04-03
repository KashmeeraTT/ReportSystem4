const topics = {
    intro: {
      en: "District Agro-met Advisory Co-production",
      si: "දිස්ත්‍රික් කෘෂි-කාලගුණික උපදේශන සමසම්පාදනය",
      ta: "மாவட்ட வேளாண் வானிலை ஆலோசனையின் ஒருங்கிணைப்பு",
    },
    seasonalSummary: {
      en: "Seasonal and Monthly Rainfall Forecast Summary for",
      si: "සෘතුමය සහ මාසික වර්ෂාපතන පුරෝකථන සාරාංශය",
      ta: "பருவகால மற்றும் மாதாந்திர மழைப்பொழிவு முன்னறிவிப்பு சுருக்கம்",
    },
    rainfallForecast: {
      en: "Rainfall Forecast for",
      si: "වර්ෂාපතන අනාවැකිය",
      ta: "மழை முன்னறிவிப்பு",
    },
    weeklySummary: {
      en: "Weekly Rainfall Forecast Summary for",
      si: "සතිපතා වර්ෂාපතන පුරෝකථන සාරාංශය",
      ta: "வாராந்திர மழைப்பொழிவு முன்னறிவிப்பு சுருக்கம்",
    },
    receivedRain: {
      en: "Received Rainfall for",
      si: "ලැබුණු වර්ෂාපතනය",
      ta: "பெறப்பட்ட மழையின் அளவு",
    },
    climatology: {
      en: "Climatological Rainfall Summary for",
      si: "දේශගුණික වර්ෂාපතන සාරාංශය",
      ta: "காலநிலை மழைப்பொழிவு சுருக்கம்",
    },
    majorReservoir: {
      en: "Major Reservoir Water Availability as of",
      si: "ප්‍රධාන ජලාශ ජල ප්‍රමාණය",
      ta: "பெரிய நீர்த்தேக்கங்களில் நீர் இருப்பு",
    },
    mediumReservoir: {
      en: "Medium Reservoir Water Availability as of",
      si: "මධ්‍යම ජලාශ ජල ප්‍රමාණය",
      ta: "நடுத்தர நீர்த்தேக்கங்களில் நீர் இருப்பு",
    },
    minorTank: {
      en: "Minor Tank Water Availability as of",
      si: "කුඩා වැව් ජල ප්‍රමාණය",
      ta: "சிறிய தொட்டி நீர் இருப்பு",
    },
    parameters: {
      en: "Agromet Parameter Selection for Advisory Co-production",
      si: "සම නිෂ්පාදනය සඳහා කෘෂි කාලගුණ පරාමිති තේරීම",
      ta: "இணை ஆலோசனைக்கான வேளாண் வானிலை அளவுரு தேர்வு",
    },
  };
  
  const altTitles = {
    provincialIrrigation: {
      en: "Provincial Irrigation",
      si: "පළාත් වාරිමාර්ග",
      ta: "மாநில நீர்ப்பாசனத் திட்டம்",
    },
    percentOfNormal: {
      en: "Percent of Normal Precipitation",
      si: "සාමාන්‍ය වර්ෂාපතනයේ ප්‍රතිශතය",
      ta: "இயல்பான மழையின் சதவீதம்",
    },
    seasonalSummary: {
        en: "Seasonal Rainfall Forecast Summary for",
        si: "සෘතුමය වර්ෂාපතන පුරෝකථන සාරාංශය",
        ta: "பருவகால மழைப்பொழிவு முன்னறிவிப்பு சுருக்கம்"
    },
  };
  
  const months = {
    January: { en: "January", si: "ජනවාරි", ta: "ஜனவரி" },
    February: { en: "February", si: "පෙබරවාරි", ta: "பிப்ரவரி" },
    March: { en: "March", si: "මාර්තු", ta: "மார்ச்" },
    April: { en: "April", si: "අප්‍රේල්", ta: "ஏப்ரல்" },
    May: { en: "May", si: "මැයි", ta: "மே" },
    June: { en: "June", si: "ජූනි", ta: "ஜூன்" },
    July: { en: "July", si: "ජූලි", ta: "ஜூலை" },
    August: { en: "August", si: "අගෝස්තු", ta: "ஆகஸ்ட்" },
    September: { en: "September", si: "සැප්තැම්බර්", ta: "செப்டம்பர்" },
    October: { en: "October", si: "ඔක්තෝබර්", ta: "அக்டோபர்" },
    November: { en: "November", si: "නොවැම්බර්", ta: "நவம்பர்" },
    December: { en: "December", si: "දෙසැම්බර්", ta: "டிசம்பர்" },
  };
  
  const districts = {
    Ampara: { en: "Ampara", si: "අම්පාර", ta: "அம்பாறை" },
    Anuradhapura: { en: "Anuradhapura", si: "අනුරාධපුර", ta: "அனுராதபுரம்" },
    Badulla: { en: "Badulla", si: "බදුල්ල", ta: "பதுளை" },
    Batticaloa: { en: "Batticaloa", si: "බටිකලෝව", ta: "மட்டக்களப்பு" },
    Colombo: { en: "Colombo", si: "කොළඹ", ta: "கொழும்பு" },
    Galle: { en: "Galle", si: "ගාල්ල", ta: "காலி" },
    Gampaha: { en: "Gampaha", si: "ගමපහ", ta: "கம்பஹா" },
    Hambantota: { en: "Hambantota", si: "හම්බන්තොට", ta: "அம்பாந்தோட்டை" },
    Jaffna: { en: "Jaffna", si: "යාපනය", ta: "யாழ்ப்பாணம்" },
    Kalutara: { en: "Kalutara", si: "කළුතර", ta: "களுத்துறை" },
    Kandy: { en: "Kandy", si: "මහනුවර", ta: "கண்டி" },
    Kegalle: { en: "Kegalle", si: "කෑගල්ල", ta: "கேகாலை" },
    Kilinochchi: { en: "Kilinochchi", si: "කිලිනොච්චිය", ta: "கிலிநொச்சி" },
    Kurunegala: { en: "Kurunegala", si: "කුරුණෑගල", ta: "குறுநாகல்" },
    Mannar: { en: "Mannar", si: "මන්නාරම", ta: "மன்னார்" },
    Matale: { en: "Matale", si: "මාතලේ", ta: "மாத்தளை" },
    Matara: { en: "Matara", si: "මාතර", ta: "மாத்தறை" },
    Moneragala: { en: "Moneragala", si: "මොනරාගල", ta: "மொனராகலை" },
    Mullaitivu: { en: "Mullaitivu", si: "මුලතිව්", ta: "முல்லைத்தீவு" },
    NuwaraEliya: { en: "Nuwara Eliya", si: "නුවර එලිය", ta: "நுவரெலியா" },
    Polonnaruwa: { en: "Polonnaruwa", si: "පොළොන්නරුව", ta: "பொலன்னறுவை" },
    Puttalam: { en: "Puttalam", si: "පුත්තලම", ta: "புத்தளம்" },
    Ratnapura: { en: "Ratnapura", si: "රත්නපුර", ta: "இரத்தினபுரி" },
    Trincomalee: { en: "Trincomalee", si: "ත්‍රිකුණාමලය", ta: "திருகோணமலை" },
    Vavuniya: { en: "Vavuniya", si: "වවුනියාව", ta: "வவுனியா" },
  };
  
  const getLocalizedMonth = (month, lang = "en") => {
    return months?.[month]?.[lang] || month;
  };
  
  const getLocalizedDistrict = (district, lang = "en") => {
    return districts?.[district]?.[lang] || district;
  };
  
  module.exports = {
    topics,
    altTitles,
    months,
    districts,
    getLocalizedMonth,
    getLocalizedDistrict,
  };
  
  