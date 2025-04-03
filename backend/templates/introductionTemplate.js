const { getLocalizedMonth, getLocalizedDistrict } = require("../utils/localization");

module.exports = function generateIntroduction(district, day, month, year, language = "en") {
  const localizedMonth = getLocalizedMonth(month, language);
  const localizedDistrict = getLocalizedDistrict(district, language);

  const introText = {
    en: {
      title: "District Agro-met Advisory Co-production",
      district: `${localizedDistrict} District`,
      date: `${day} ${localizedMonth} ${year}`,
      part: "Part A",
      para1: `The Natural Resources Management Centre, Department of Agriculture (NRMC, DoA) has released the Agro-met advisory for ${localizedMonth} ${year}, which incorporates weather forecasts provided by the Department of Meteorology (DoM) and the irrigation water availability information from the Irrigation Department (ID), Mahaweli Water Management Secretariat (MASL-WMS) and the Department of Agrarian Development (DAD). Field-level data and information for this document were collected from the Department of Agriculture (DoA), Mahaweli Authority of Sri Lanka (MASL), ID, DAD and plantation research institutes.`,
      para2: `The Department of Meteorology (DoM) has issued the seasonal weather forecast for the upcoming three-month period, outlining anticipated weather conditions.`,
    },
    si: {
      title: "දිස්ත්‍රික් කෘෂි-කාලගුණික උපදේශන සමසම්පාදනය",
      district: `${localizedDistrict} දිස්ත්‍රික්කය`,
      date: `${day} ${localizedMonth} ${year}`,
      part: "අංශය A",
      para1: `කෘෂිකර්ම දෙපාර්තමේන්තුවේ (NRMC, DoA) ස්වභාවික සම්පත් කළමනාකරණ මධ්‍යස්ථානය විසින් ${localizedMonth} ${year} සඳහා කෘෂි-කාලගුණික උපදේශනය නිකුත් කර ඇති අතර, එය කාලගුණ විද්‍යා දෙපාර්තමේන්තුව (DoM) විසින් සපයන ලද කාලගුණ අනාවැකි සහ වාරිමාර්ග දෙපාර්තමේන්තුව (ID), මහවැලි ජල කළමනාකරණ ලේකම් කාර්යාලය (MASL-WMS) සහ ගොවිජන සංවර්ධන දෙපාර්තමේන්තුව (DAD) වෙතින් වාරිමාර්ග ජල ලබා ගැනීමේ තොරතුරු ඇතුළත් වේ. මෙම ලේඛනය සඳහා ක්ෂේත්‍ර මට්ටමේ දත්ත සහ තොරතුරු කෘෂිකර්ම දෙපාර්තමේන්තුව (DoA), ශ්‍රී ලංකා මහවැලි අධිකාරිය (MASL), ID, DAD සහ වැවිලි පර්යේෂණ ආයතන වලින් රැස් කරන ලදී.`,
      para2: `කාලගුණ විද්‍යා දෙපාර්තමේන්තුව (DoM) ඉදිරි මාස තුනක කාලය සඳහා සෘතුමය කාලගුණ අනාවැකිය නිකුත් කර ඇති අතර, අපේක්ෂිත කාලගුණික තත්ත්වයන් ගෙනහැර දක්වයි.`,
    },
    ta: {
      title: "மாவட்ட வேளாண் வானிலை ஆலோசனையின் ஒருங்கிணைப்பு",
      district: `${localizedDistrict} மாவட்டம்`,
      date: `${day} ${localizedMonth} ${year}`,
      part: "பகுதி A",
      para1: `வேளாண்மைத் துறையின் (NRMC, DoA) இயற்கை வள மேலாண்மை மையம் ${localizedMonth} ${year}க்கான வேளாண் வானிலை ஆலோசனையை வெளியிட்டுள்ளது, வளிமண்டலவியல் திணைக்களம் (DoM) வழங்கிய வானிலை முன்னறிவிப்புகள் மற்றும் நீர்ப்பாசனத் திணைக்களம் (ID), மகாவலி நீர் முகாமைத்துவ செயலகம் (MASL-WMS) மற்றும் விவசாய அபிவிருத்தி திணைக்களம் (DAD) ஆகியவற்றின் நீர்ப்பாசனத் தகவல்களும் இதில் அடங்கும். இந்த ஆவணத்திற்கான கள மட்ட தரவுகளும் தகவல்களும் விவசாயத் திணைக்களம் (DoA), இலங்கை மகாவலி அதிகார சபை (MASL), ID, DAD மற்றும் தோட்ட ஆராய்ச்சி நிறுவனங்களிலிருந்து சேகரிக்கப்பட்டது.`,
      para2: `வளிமண்டலவியல் திணைக்களம் (DoM) அடுத்த மூன்று மாதங்களுக்கு பருவகால வானிலை முன்னறிவிப்பை வெளியிட்டது, எதிர்பார்க்கப்படும் வானிலை நிலைமைகளை கோடிட்டுக் காட்டுகிறது.`,
    }
  };

  const t = introText[language] || introText["en"];

  return `
    <div class="section" style="page-break-after: always;">
      <h1 style="text-align: center;">${t.title}</h1>
      <h2 style="text-align: center;">${t.district}</h2>
      <h3 style="text-align: center;">${t.date}</h3>
      <h4 style="text-align: center;">${t.part}</h4>
      <p style="text-align: justify;">${t.para1}</p>
      <p style="text-align: justify;">${t.para2}</p>
    </div>
    <!-- PAGE BREAK -->
  `;
};
