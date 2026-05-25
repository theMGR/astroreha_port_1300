/* ==========================================================================
   AstroReha Application Logic (Dynamic SVGs & Interactive Synastry)
   ========================================================================== */

let currentChartData = null;
let activeChartStyle = "south";
let activeLanguage = "en";

// --------------------------------------------------------------------------
// Constants & Astrological Mapping Systems
// --------------------------------------------------------------------------
const RASHI_MAP = {
    Ar: 0, Ta: 1, Ge: 2, Cn: 3, Le: 4, Vi: 5,
    Li: 6, Sc: 7, Sg: 8, Cp: 9, Aq: 10, Pi: 11
};

const RASHI_ARRAY = [
    "Ar", "Ta", "Ge", "Cn", "Le", "Vi",
    "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
];

const RASHI_LOWER_NAMES = {
    Ar: "aries", Ta: "taurus", Ge: "gemini", Cn: "cancer", Le: "leo", Vi: "virgo",
    Li: "libra", Sc: "scorpio", Sg: "sagittarius", Cp: "capricorn", Aq: "aquarius", Pi: "pisces"
};

const RASHI_DISPLAY_NAMES = {
    Ar: "Aries (Mesha)", Ta: "Taurus (Vrishabha)", Ge: "Gemini (Mithuna)",
    Cn: "Cancer (Karka)", Le: "Leo (Simha)", Vi: "Virgo (Kanya)",
    Li: "Libra (Tula)", Sc: "Scorpio (Vrischika)", Sg: "Sagittarius (Dhanu)",
    Cp: "Capricorn (Makara)", Aq: "Aquarius (Kumbha)", Pi: "Pisces (Meena)"
};

const PLANET_DISPLAY_NAMES = {
    La: "Lagna (Ascendant)",
    Su: "Sun (Surya)",
    Mo: "Moon (Chandra)",
    Ma: "Mars (Mangal)",
    Me: "Mercury (Budha)",
    Ju: "Jupiter (Guru)",
    Ve: "Venus (Shukra)",
    Sa: "Saturn (Shani)",
    Ra: "Rahu (North Node)",
    Ke: "Ketu (South Node)"
};

// --------------------------------------------------------------------------
// Translation / Localization Dictionaries (English & Tamil)
// --------------------------------------------------------------------------
const TAMIL_RASHIS = {
    Ar: "மேஷம்", Ta: "ரிஷபம்", Ge: "மிதுனம்", Cn: "கடகம்",
    Le: "சிம்மம்", Vi: "கன்னி", Li: "துலாம்", Sc: "விருச்சிகம்",
    Sg: "தனுசு", Cp: "மகரம்", Aq: "கும்பம்", Pi: "மீனம்"
};

const TAMIL_PLANETS = {
    La: "ல", Su: "சூ", Mo: "ச", Ma: "செ", Me: "பு",
    Ju: "கு", Ve: "சு", Sa: "சனி", Ra: "ரா", Ke: "கே"
};

const PLANET_TAMIL_FULL = {
    La: "லக்னம் (Ascendant)",
    Su: "சூரியன் (Sun)",
    Mo: "சந்திரன் (Moon)",
    Ma: "செவ்வாய் (Mars)",
    Me: "புதன் (Mercury)",
    Ju: "குரு (Jupiter)",
    Ve: "சுக்கிரன் (Venus)",
    Sa: "சனி (Saturn)",
    Ra: "இராகு (Rahu)",
    Ke: "கேது (Ketu)"
};

const RASHI_TAMIL_FULL = {
    Ar: "மேஷம் (Aries)", Ta: "ரிஷபம் (Taurus)", Ge: "மிதுனம் (Gemini)",
    Cn: "கடகம் (Cancer)", Le: "சிம்மம் (Leo)", Vi: "கன்னி (Virgo)",
    Li: "துலாம் (Libra)", Sc: "விருச்சிகம் (Scorpio)", Sg: "தனுசு (Sagittarius)",
    Cp: "மகரம் (Capricorn)", Aq: "கும்பம் (Aquarius)", Pi: "மீனம் (Pisces)"
};

const TRANSLATIONS = {
    en: {
        // Tabs
        tab_charts: '<i class="fa-solid fa-chart-pie"></i> Chart Explorer',
        tab_compatibility: '<i class="fa-solid fa-heart-pulse"></i> Compatibility Hub',
        tab_api: '<i class="fa-solid fa-code"></i> API Explorer',
        
        // D1/D9 form
        title_cast_chart: 'Cast Birth Chart (Kundali)',
        label_name: '<i class="fa-regular fa-user"></i> Full Name',
        label_dob: '<i class="fa-regular fa-calendar"></i> Date of Birth',
        label_tob: '<i class="fa-regular fa-clock"></i> Time of Birth',
        label_lat: '<i class="fa-solid fa-location-crosshairs"></i> Latitude',
        label_lng: '<i class="fa-solid fa-map-pin"></i> Longitude',
        label_timezone: '<i class="fa-solid fa-globe"></i> Timezone Offset (Hours)',
        btn_cast: 'Cast D1 & D9 Charts',
        
        // D1/D9 results
        visualizer_title: 'Cosmic Map Visualizer',
        north_btn: 'North Indian (Diamond)',
        south_btn: 'Tamil Nadu / South Indian (Grid)',
        placeholder_chart_title: 'Awaiting Astronomical Alignments',
        placeholder_chart_desc: 'Enter birth details on the left and cast the charts to fetch planetary positions, Lagna calculations, and Navamsa details dynamically.',
        chart_d1_title: 'Birth Chart (D1)',
        chart_d9_title: 'Navamsa Chart (D9)',
        table_title: 'Planetary Positions & Nakshatra Details',
        th_planet: 'Planet',
        th_rashi: 'Rashi (Zodiac)',
        th_nakshatra: 'Nakshatra',
        th_longitude: 'Longitude',
        th_motion: 'Motion',
        
        // Compatibility
        title_p1: 'First Person',
        title_p2: 'Second Person',
        label_threshold: 'Match Threshold Score',
        btn_match: 'Analyze Synastry Compatibility',
        placeholder_compat_title: 'Ready for Compatibility Synastry',
        placeholder_compat_desc: 'Submit details for both individuals to calculate their mutual compatibility score, examine Rising, Sun, Moon, and Venus relationships, check Manglik conditions, and view the precise ruleset analysis.',
        points_label: 'Total Points',
        criteria_title: 'Astrological Criteria Breakdown',
        criteria_desc: 'A total score is calculated across 18 rules mapping planetary relationships, houses, and nakshatras. A threshold of 12 points or above is typically required for standard compatibility.',
    },
    ta: {
        // Tabs
        tab_charts: '<i class="fa-solid fa-chart-pie"></i> ஜாதகக் கட்டம்',
        tab_compatibility: '<i class="fa-solid fa-heart-pulse"></i> திருமண பொருத்தம்',
        tab_api: '<i class="fa-solid fa-code"></i> API விபரங்கள்',
        
        // D1/D9 form
        title_cast_chart: 'ஜாதகம் கணித்தல் (குண்டலி)',
        label_name: '<i class="fa-regular fa-user"></i> முழு பெயர்',
        label_dob: '<i class="fa-regular fa-calendar"></i> பிறந்த தேதி',
        label_tob: '<i class="fa-regular fa-clock"></i> பிறந்த நேரம்',
        label_lat: '<i class="fa-solid fa-location-crosshairs"></i> அட்சரேகை (Latitude)',
        label_lng: '<i class="fa-solid fa-map-pin"></i> தீர்க்கரேகை (Longitude)',
        label_timezone: '<i class="fa-solid fa-globe"></i> கால மண்டலம் (Timezone)',
        btn_cast: 'D1 மற்றும் D9 கட்டம் கணிக்க',
        
        // D1/D9 results
        visualizer_title: 'விண்மீன் கட்ட வரைபடம்',
        north_btn: 'வட இந்திய முறை (வைரம்)',
        south_btn: 'தமிழ்நாடு / தென்னந்திய முறை (கட்டம்)',
        placeholder_chart_title: 'வானியல் கிரக நிலைகளுக்காக காத்திருக்கிறது',
        placeholder_chart_desc: 'இடதுபுறத்தில் பிறந்த விவரங்களை உள்ளிட்டு, கிரக நிலைகள், லக்ன கணக்கீடுகள் மற்றும் நவாம்ச விவரங்களை மாறும் வகையில் பெற ஜாதகத்தை கணிக்கவும்.',
        chart_d1_title: 'இராசி கட்டம் (D1)',
        chart_d9_title: 'நவாம்ச கட்டம் (D9)',
        table_title: 'கிரக நிலைகள் & நட்சத்திர விவரங்கள்',
        th_planet: 'கிரகம்',
        th_rashi: 'இராசி (மண்டலம்)',
        th_nakshatra: 'நட்சத்திரம்',
        th_longitude: 'பாகை (Longitude)',
        th_motion: 'இயக்கம்',
        
        // Compatibility
        title_p1: 'முதல் நபர் (பெண்)',
        title_p2: 'இரண்டாம் நபர் (ஆண்)',
        label_threshold: 'தேவையான குறைந்தபட்ச மதிப்பெண்',
        btn_match: 'பொருத்தம் கணக்கிடுக',
        placeholder_compat_title: 'திருமண பொருத்தம் பார்க்க தயாராக உள்ளது',
        placeholder_compat_desc: 'இரு நபர்களின் விவரங்களை உள்ளிட்டு, அவர்களின் இராசி, நட்சத்திரம், லக்னம், செவ்வாய் தோஷம் (மங்களிக்) மற்றும் இதர 18 பொருத்தங்களின் விபரங்களை ஆராயுங்கள்.',
        points_label: 'மொத்த புள்ளிகள்',
        criteria_title: 'பொருத்தங்கள் விபரங்கள்',
        criteria_desc: 'கிரக நிலைகள், வீடுகள் மற்றும் நட்சத்திரங்கள் அடிப்படையில் 18 பொருத்தங்கள் கணக்கிடப்படுகிறது. பொதுவாக 12 அல்லது அதற்கு மேற்பட்ட புள்ளிகள் சிறந்த பொருத்தமாக கருதப்படுகிறது.',
    }
};

// SVG Coordinates for North Indian Diamond Chart (Center of compartments)
const HOUSE_COORDINATES = {
    1:  { num: {x: 150, y: 35},  planets: {x: 150, y: 80}  }, // House 1 (top central diamond)
    4:  { num: {x: 35,  y: 150}, planets: {x: 80,  y: 150} }, // House 4 (left central diamond)
    7:  { num: {x: 150, y: 265}, planets: {x: 150, y: 220} }, // House 7 (bottom central diamond)
    10: { num: {x: 265, y: 150}, planets: {x: 220, y: 150} }, // House 10 (right central diamond)

    2:  { num: {x: 105, y: 25},  planets: {x: 65,  y: 40}  }, // House 2 (top-left top)
    3:  { num: {x: 25,  y: 105}, planets: {x: 40,  y: 65}  }, // House 3 (left-top top)
    5:  { num: {x: 25,  y: 195}, planets: {x: 40,  y: 235} }, // House 5 (left-bottom bottom)
    6:  { num: {x: 105, y: 275}, planets: {x: 65,  y: 260} }, // House 6 (bottom-left bottom)
    8:  { num: {x: 195, y: 275}, planets: {x: 235, y: 260} }, // House 8 (bottom-right bottom)
    9:  { num: {x: 275, y: 195}, planets: {x: 260, y: 235} }, // House 9 (right-bottom bottom)
    11: { num: {x: 275, y: 105}, planets: {x: 260, y: 65}  }, // House 11 (right-top top)
    12: { num: {x: 195, y: 25},  planets: {x: 235, y: 40}  }  // House 12 (top-right top)
};

// Human-friendly matching rule metadata
const RULE_METADATA = {
    "Seventh House of D9": {
        title: "D9 Navamsa 7th House Pillar",
        titleTa: "D9 நவாம்ச 7-ஆம் வீடு பொருத்தம்",
        desc: "Requires 7th House D9 lord to sit in a good house in partner's D1 chart. A hard requirement for spiritual compatibility.",
        descTa: "திருமணத்திற்கு மிக முக்கிய காரணியான நவாம்ச ஏழாம் அதிபதி, துணைவியின் இராசி கட்டத்தில் சுப பலம் பெற்றுள்ளாரா என்பதை ஆராய்கிறது."
    },
    "7th House Matching?": {
        title: "7th House Sign Matching",
        titleTa: "7-ஆம் அதிபதிகள் நட்பு பொருத்தம்",
        desc: "Compares 7th house planetary rulers in both birth charts to verify overall marital compatibility.",
        descTa: "இருவரின் ஜாதகத்திலும் ஏழாம் வீட்டு அதிபதிகளின் சுப இணைவுகள் மற்றும் பொருத்தங்களை ஒப்பிடுகிறது."
    },
    "Are Lords of Rising Sign Friends?": {
        title: "Ascendant Lords Friendship",
        titleTa: "லக்னாதிபதிகள் நட்பு பொருத்தம்",
        desc: "Checks if the ruling planets of both Rising Signs (Lagnas) are natural friends, signifying mutual appreciation.",
        descTa: "இருவரின் லக்னாதிபதிகளும் (உயிர்க்காரகர்கள்) இயற்கை நட்புடன் உள்ளார்களா என்பதை கணித்து வாழ்நாள் நல்லிணக்கத்தை உறுதி செய்கிறது."
    },
    "Rising to Rising Connection": {
        title: "Ascendant Sign Resonance",
        titleTa: "லக்ன ராசி அதிர்வு பொருத்தம்",
        desc: "Evaluates the angular house relationship between the rising signs of both individuals.",
        descTa: "இருவரின் லக்னங்களுக்கு இடையேயான கோண மற்றும் பாவ இணைப்புகளை ஆராய்கிறது."
    },
    "Moon to Moon Connection": {
        title: "Moon to Moon Connection",
        titleTa: "இராசி பொருத்தம் (மனநிலை)",
        desc: "Measures emotional alignment, mental resonance, and day-to-day psychological compatibility.",
        descTa: "இரு மனங்களின் பொருத்தம், உணர்ச்சிபூர்வ இணக்கம் மற்றும் அன்றாட வாழ்க்கை புரிதலை அளவிடுகிறது."
    },
    "Moon's Ruling Lord Friends": {
        title: "Moon Lord Friendship",
        titleTa: "இராசியதிபதிகள் நட்பு பொருத்தம்",
        desc: "Compares the planetary rulers of both Moon signs to check for long-term emotional synergy.",
        descTa: "இருவரின் இராசி அதிபதிகளும் நட்பான கிரகங்களா என்பதை சரிபார்த்து வாழ்நாள் மன நிம்மதியை உறுதி செய்கிறது."
    },
    "Moon conjunct or opposite Sun?": {
        title: "Solar-Lunar Synthesis",
        titleTa: "சூரிய-சந்திர சுப சேர்க்கை பொருத்தம்",
        desc: "Identifies whether one's Moon matches the other's Sun, linking subconscious feeling with conscious ego.",
        descTa: "ஒருவரின் சந்திரனுடன் மற்றவரின் சூரியன் சுப சேர்க்கை அல்லது சம சப்தம பார்வையுடன் இணைந்துள்ளாரா என்பதை ஆராய்கிறது."
    },
    "Sun to Sun Connection": {
        title: "Sun to Sun Resonance",
        titleTa: "சூரியன் ஆத்ம பொருத்தம்",
        desc: "Measures core identity, soul purpose resonance, and ego compatibility.",
        descTa: "இருவரின் ஆத்ம காரகனான சூரியன்களின் கோண நிலைகள் மற்றும் லட்சிய பொருத்தங்களை சரிபார்க்கிறது."
    },
    "Sun's Illumination thing": {
        title: "Solar Illumination House",
        titleTa: "சூரியன் சுப வீட்டின் பார்வை",
        desc: "Evaluates which house the partner's Sun illuminates, checking for positive influence.",
        descTa: "துணையின் சூரியன் மற்றொருவர் ஜாதகத்தில் எந்த வீட்டை பிரகாசிக்கச் செய்கிறார் என்பதை ஆராய்கிறது."
    },
    "Sun conjunct seventh House?": {
        title: "Solar Conjunction to 7th House",
        titleTa: "சூரியன் ஏழாம் வீடு சேர்க்கை",
        desc: "Checks if either partner's Sun directly sits in the other's house of long-term partnership.",
        descTa: "இருவரின் சூரியன்களில் ஏதேனும் ஒன்று துணையின் களத்திர ஸ்தானமான ஏழாம் வீட்டில் அமர்ந்துள்ளதா எனப் பார்க்கிறது."
    },
    "Venus to Venus connection": {
        title: "Venus Romance Harmony",
        titleTa: "சுக்கிரன் காதல் & இன்ப பொருத்தம்",
        desc: "Measures romantic chemistry, affection styles, and aesthetic values resonance.",
        descTa: "களத்திரக்காரகன் சுக்கிரன்களுக்கு இடையேயான அன்பு, ஈர்ப்பு மற்றும் தாம்பத்திய இணக்கத்தை ஆராய்கிறது."
    },
    "Are venus ruling lord friends?": {
        title: "Venus Lord Friendship",
        titleTa: "சுக்கிரன் அதிபதிகள் நட்பு பொருத்தம்",
        desc: "Checks if the ruling lords of the partners' Venus signs are mutually cooperative.",
        descTa: "இருவரின் சுக்கிரன் வீட்டின் அதிபதி கிரகங்களுக்கு இடையேயான கூட்டுறவை சரிபார்க்கிறது."
    },
    "Manglik Connection": {
        title: "Manglik (Kuja Dosha) Balance",
        titleTa: "செவ்வாய் தோஷம் சமநிலை பொருத்தம்",
        desc: "Evaluates if Kuja Dosha (Mars affliction) is balanced between both charts to prevent friction.",
        descTa: "இரு ஜாதகத்திலும் செவ்வாய் தோஷத்தின் சமநிலையை சரிபார்த்து மணவாழ்வின் ஆயுள் மற்றும் அமைதியை உறுதி செய்கிறது."
    },
    "Mars Ruling Lord Friends?": {
        title: "Mars Lord Friendship",
        titleTa: "செவ்வாய் அதிபதிகள் நட்பு",
        desc: "Checks compatibility between the rulers of both Mars signs for energy alignment.",
        descTa: "இருவரின் செவ்வாய் அமர்ந்த வீட்டின் அதிபதிகளுக்கிடையேயான ஆற்றல் பொருத்தங்களை சரிபார்க்கிறது."
    },
    "Mars to Mars Connection": {
        title: "Mars Energy Connection",
        titleTa: "செவ்வாய் வீரிய ஆற்றல் பொருத்தம்",
        desc: "Measures driving force, physical passion, and how conflict is handled.",
        descTa: "இருவரின் வீரிய ஸ்தான கிரகமான செவ்வாய்களின் இணக்கத்தின் மூலம் உடலாரோக்கியம் மற்றும் உணர்வுகளை சரிபார்க்கிறது."
    },
    "Rahu to Rahu....": {
        title: "Karmic Nodes Connection",
        titleTa: "இராகு-கேது பூர்வகர்ம தொடர்பு",
        desc: "Checks Rahu/Ketu planetary crossings to see if a deep karmic or destiny bond exists.",
        descTa: "இருவரின் நிழல் கிரகங்களான இராகு-கேது நிலைகள் மூலம் பூர்வ புண்ணிய கர்ம தொடர்புகளை ஆராய்கிறது."
    },
    "Saturn to Saturn stuff": {
        title: "Saturn Longevity Connection",
        titleTa: "சனி ஆயுள் & பொறுமை பொருத்தம்",
        desc: "Analyzes Saturn's support for commitment, patience, and building a structured life together.",
        descTa: "ஆயுள் காரகன் சனியின் நிலைகள் மூலம் வாழ்வின் பொறுமை, விட்டுக்கொடுத்தல் மற்றும் ஸ்திரத்தன்மையை ஆராய்கிறது."
    },
    "Nakshatra stuff": {
        title: "Yoni Koota (Animal Affinity)",
        titleTa: "யோனி பொருத்தம் (விலங்கு இணக்கம்)",
        desc: "Calculates compatibility score based on the matching animal archetypes of both Nakshatras.",
        descTa: "இருவரின் நட்சத்திரத்திற்குரிய மிருக குறியீடுகளின் மூலம் உடல் சேர்க்கை மற்றும் இயற்கை இணக்கத்தை கணக்கிடுகிறது."
    }
};

// --------------------------------------------------------------------------
// Navigation & Tab Management
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    setupSliders();
    setupChartForm();
    setupCompatibilityForm();
    setupChartStyleSelector();
    setupLanguageSelector();
});

function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Toggle active tab buttons
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle active content divs
            tabContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add("active");
                }
            });
        });
    });
}

function setupSliders() {
    const thresholdSlider = document.getElementById("threshold-slider");
    const thresholdVal = document.getElementById("threshold-val");

    if (thresholdSlider && thresholdVal) {
        thresholdSlider.addEventListener("input", (e) => {
            const score = parseInt(e.target.value);
            const percentage = Math.round((score / 30) * 100);
            thresholdVal.innerText = `${score} / 30 (${percentage}%)`;
        });
    }
}

function setupChartStyleSelector() {
    const btnNorth = document.getElementById("style-btn-north");
    const btnSouth = document.getElementById("style-btn-south");

    if (btnNorth && btnSouth) {
        btnNorth.addEventListener("click", () => {
            activeChartStyle = "north";
            btnNorth.classList.add("active");
            btnSouth.classList.remove("active");
            drawActiveCharts();
        });

        btnSouth.addEventListener("click", () => {
            activeChartStyle = "south";
            btnSouth.classList.add("active");
            btnNorth.classList.remove("active");
            drawActiveCharts();
        });
    }
}

function setupLanguageSelector() {
    const select = document.getElementById("lang-select");
    if (select) {
        select.addEventListener("change", (e) => {
            activeLanguage = e.target.value;
            updateLanguage(activeLanguage);
            drawActiveCharts();
            if (currentChartData) {
                populatePlanetaryTable(currentChartData.birthChart);
            }
        });
    }
}

function updateLanguage(lang) {
    const dict = TRANSLATIONS[lang];
    if (!dict) return;
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });
}

function drawActiveCharts() {
    if (!currentChartData) return;

    // Dynamically update the unified chart banner with the entered name
    const userName = document.getElementById("user-name")?.value.trim() || "User";
    const usernameHeader = document.getElementById("chart-username-text");
    if (usernameHeader) {
        usernameHeader.innerHTML = `${activeLanguage === "ta" ? "ஜாதகக்காரர்" : "Horoscope of"}: <span style="color: var(--accent); font-weight: bold;">${userName}</span>`;
    }

    // Restore original clean headings for both charts to avoid double redundancy
    const d1TitleText = document.getElementById("d1-chart-title-text");
    const d9TitleText = document.getElementById("d9-chart-title-text");
    if (d1TitleText) {
        d1TitleText.innerHTML = activeLanguage === "ta" ? "இராசி கட்டம் (D1)" : "Birth Chart (D1)";
    }
    if (d9TitleText) {
        d9TitleText.innerHTML = activeLanguage === "ta" ? "நவாம்ச கட்டம் (D9)" : "Navamsa Chart (D9)";
    }

    if (activeChartStyle === "north") {
        renderNorthIndianSVG(currentChartData.birthChart, "d1-svg-container", false);
        renderNorthIndianSVG(currentChartData.navamsaChart, "d9-svg-container", true);
    } else {
        renderSouthIndianSVG(currentChartData.birthChart, "d1-svg-container", false);
        renderSouthIndianSVG(currentChartData.navamsaChart, "d9-svg-container", true);
    }
}

// --------------------------------------------------------------------------
// Astrological House Logic
// --------------------------------------------------------------------------
function getHousesOfChart(chart) {
    const ascendantRashi = chart.meta.La.rashi; // e.g. "Ar"
    const getAscendantRashiOriginalIndex = RASHI_MAP[ascendantRashi];
    const houses = {};
    let j = 0;

    for (let i = getAscendantRashiOriginalIndex; i < 12; ++i) {
        houses[j + 1] = RASHI_ARRAY[i];
        ++j;
    }
    
    if (getAscendantRashiOriginalIndex) {
        let k = 0;
        for (let i = getAscendantRashiOriginalIndex - 1; i >= 0; i--) {
            houses[12 - k] = RASHI_ARRAY[i];
            ++k;
        }
    }
    return houses;
}

// --------------------------------------------------------------------------
// SVG Dynamic Graphic Renderers
// --------------------------------------------------------------------------
function renderNorthIndianSVG(chart, containerId, isD9 = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // Clear placeholder

    const strokeColor = isD9 ? "#9c27b0" : "#d4af37";
    const svgClass = isD9 ? "vedic-chart-svg d9-svg" : "vedic-chart-svg d1-svg";
    
    // SVG boilerplate
    let svgHtml = `
    <svg class="${svgClass}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer border -->
        <rect x="5" y="5" width="290" height="290" stroke="${strokeColor}" fill="none" stroke-width="2" />
        
        <!-- Diagonals -->
        <line x1="5" y1="5" x2="295" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="295" y1="5" x2="5" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        
        <!-- Inner Diamond -->
        <line x1="150" y1="5" x2="295" y2="150" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="295" y1="150" x2="150" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="150" y1="295" x2="5" y2="150" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="5" y1="150" x2="150" y2="5" stroke="${strokeColor}" stroke-width="1.5" />
    `;

    // Map houses to rashi
    const houses = getHousesOfChart(chart);

    // Populate each house compartment with rashi numbers and planets
    for (let H = 1; H <= 12; H++) {
        const rashiAbbr = houses[H];
        const rashiNum = RASHI_MAP[rashiAbbr] + 1; // 1-indexed for display
        const rashiLowerName = RASHI_LOWER_NAMES[rashiAbbr];
        
        // Find planets residing in this rashi
        const signs = chart[rashiLowerName]?.signs || [];
        
        // Compile planet abbreviations (and retrograde symbols)
        const planetList = signs.map(s => {
            const pName = (activeLanguage === "ta") ? (TAMIL_PLANETS[s.graha] || s.graha) : s.graha;
            return pName + (s.isRetrograde ? "®" : "");
        });
        
        // Get coordinate offsets
        const coords = HOUSE_COORDINATES[H];
        
        // Rashi Number Text (small, positioned near vertex)
        svgHtml += `
        <text x="${coords.num.x}" y="${coords.num.y}" class="house-num-text" text-anchor="middle" dominant-baseline="central">
            ${rashiNum}
        </text>`;

        // Planet text block
        if (planetList.length > 0) {
            if (planetList.length > 2) {
                const row1 = planetList.slice(0, 2).join(" ");
                const row2 = planetList.slice(2).join(" ");
                
                svgHtml += `
                <text x="${coords.planets.x}" y="${coords.planets.y - 7}" class="planet-group-text" text-anchor="middle" dominant-baseline="central">
                    ${row1}
                </text>
                <text x="${coords.planets.x}" y="${coords.planets.y + 7}" class="planet-group-text" text-anchor="middle" dominant-baseline="central">
                    ${row2}
                </text>`;
            } else {
                const row = planetList.join(" ");
                svgHtml += `
                <text x="${coords.planets.x}" y="${coords.planets.y}" class="planet-group-text" text-anchor="middle" dominant-baseline="central">
                    ${row}
                </text>`;
            }
        }
    }

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
}

const SOUTH_INDIAN_BOXES = {
    Pi: { x: 37.5,  y: 37.5,  row: 0, col: 0 },
    Ar: { x: 112.5, y: 37.5,  row: 0, col: 1 },
    Ta: { x: 187.5, y: 37.5,  row: 0, col: 2 },
    Ge: { x: 262.5, y: 37.5,  row: 0, col: 3 },
    Cn: { x: 262.5, y: 112.5, row: 1, col: 3 },
    Le: { x: 262.5, y: 187.5, row: 2, col: 3 },
    Vi: { x: 262.5, y: 262.5, row: 3, col: 3 },
    Li: { x: 187.5, y: 262.5, row: 3, col: 2 },
    Sc: { x: 112.5, y: 262.5, row: 3, col: 1 },
    Sg: { x: 37.5,  y: 262.5, row: 3, col: 0 },
    Cp: { x: 37.5,  y: 187.5, row: 2, col: 0 },
    Aq: { x: 37.5,  y: 112.5, row: 1, col: 0 }
};

const SOUTH_INDIAN_SIGNS = ["Pi", "Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq"];

function renderSouthIndianSVG(chart, containerId, isD9 = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const strokeColor = isD9 ? "#9c27b0" : "#d4af37";
    const svgClass = isD9 ? "vedic-chart-svg south-svg d9-svg" : "vedic-chart-svg south-svg d1-svg";
    
    let svgHtml = `
    <svg class="${svgClass}" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Outer Border -->
        <rect x="5" y="5" width="290" height="290" stroke="${strokeColor}" fill="none" stroke-width="2" />
        
        <!-- Grid Lines -->
        <!-- Horizontal -->
        <line x1="5" y1="75" x2="295" y2="75" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="5" y1="150" x2="75" y2="150" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="225" y1="150" x2="295" y2="150" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="5" y1="225" x2="295" y2="225" stroke="${strokeColor}" stroke-width="1.5" />
        
        <!-- Vertical -->
        <line x1="75" y1="5" x2="75" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="150" y1="5" x2="150" y2="75" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="150" y1="225" x2="150" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        <line x1="225" y1="5" x2="225" y2="295" stroke="${strokeColor}" stroke-width="1.5" />
        
        <!-- Center Text Label -->
        <text x="150" y="142" fill="${strokeColor}" font-family="Cinzel" font-size="14" font-weight="bold" text-anchor="middle" dominant-baseline="central">
            ${isD9 ? "D9" : "D1"} ${activeLanguage === "ta" ? "கட்டம்" : "CHART"}
        </text>
        <text x="150" y="165" fill="var(--text-muted)" font-family="Inter" font-size="8" font-weight="600" text-anchor="middle" dominant-baseline="central" style="letter-spacing: 1px;">
            ${isD9 ? (activeLanguage === "ta" ? "நவாம்சம்" : "NAVAMSA") : (activeLanguage === "ta" ? "இராசி" : "RASHI")}
        </text>
    `;

    const lagnaRashi = chart.meta.La.rashi; // e.g. "Ar"
    const lagnaIndex = RASHI_MAP[lagnaRashi];

    SOUTH_INDIAN_SIGNS.forEach(sign => {
        const coords = SOUTH_INDIAN_BOXES[sign];
        const houseNum = ((RASHI_MAP[sign] - lagnaIndex + 12) % 12) + 1;
        const rashiLowerName = RASHI_LOWER_NAMES[sign];
        const signsList = chart[rashiLowerName]?.signs || [];
        const isLagna = (sign === lagnaRashi);

        // Draw diagonal strike for Lagna
        if (isLagna) {
            const left = coords.col * 75 + 5;
            const top = coords.row * 75 + 5;
            const right = left + 70;
            const bottom = top + 70;
            svgHtml += `
            <line x1="${left}" y1="${bottom}" x2="${right}" y2="${top}" stroke="${strokeColor}" stroke-dasharray="3,3" />
            `;
        }

        // Print sign abbreviation / Tamil name (top-left of box)
        const displaySign = (activeLanguage === "ta") ? TAMIL_RASHIS[sign] : sign;
        svgHtml += `
        <text x="${coords.x - 28}" y="${coords.y - 24}" class="house-num-text" style="font-size: 8px; font-weight: bold; fill: var(--text-muted);" text-anchor="start" dominant-baseline="central">
            ${displaySign}
        </text>
        `;

        // Print house number from Lagna (top-right of box)
        svgHtml += `
        <text x="${coords.x + 28}" y="${coords.y - 24}" class="house-num-text" style="font-size: 8px; fill: rgba(255,255,255,0.25);" text-anchor="end" dominant-baseline="central">
            ${activeLanguage === "ta" ? "" : "H"}${houseNum}${activeLanguage === "ta" ? "-ஆம் வீடு" : ""}
        </text>
        `;

        // Print planets in box (center of box)
        const planetList = signsList.map(s => {
            const pName = (activeLanguage === "ta") ? (TAMIL_PLANETS[s.graha] || s.graha) : s.graha;
            return pName + (s.isRetrograde ? "®" : "");
        });
        
        if (planetList.length > 0) {
            if (planetList.length > 2) {
                const row1 = planetList.slice(0, 2).join(" ");
                const row2 = planetList.slice(2).join(" ");
                svgHtml += `
                <text x="${coords.x}" y="${coords.y - 6}" class="planet-group-text" style="font-size: 9px;" text-anchor="middle" dominant-baseline="central">
                    ${row1}
                </text>
                <text x="${coords.x}" y="${coords.y + 7}" class="planet-group-text" style="font-size: 9px;" text-anchor="middle" dominant-baseline="central">
                    ${row2}
                </text>
                `;
            } else {
                const row = planetList.join(" ");
                svgHtml += `
                <text x="${coords.x}" y="${coords.y}" class="planet-group-text" style="font-size: 10px;" text-anchor="middle" dominant-baseline="central">
                    ${row}
                </text>
                `;
            }
        }
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
}

// --------------------------------------------------------------------------
// Tabular Planetary Data Generator
// --------------------------------------------------------------------------
function populatePlanetaryTable(chart) {
    const tableBody = document.getElementById("planetary-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = ""; // Clear previous

    // Sort planets in a nice logical order
    const orderedPlanets = ["La", "Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];

    orderedPlanets.forEach(pId => {
        const metadata = chart.meta[pId];
        if (!metadata) return;

        const row = document.createElement("tr");

        // Planet Display Name (localized)
        const planetCell = document.createElement("td");
        const pName = (activeLanguage === "ta") ? (PLANET_TAMIL_FULL[pId] || pId) : (PLANET_DISPLAY_NAMES[pId] || pId);
        planetCell.innerHTML = `<strong>${pName}</strong> (${pId})`;
        row.appendChild(planetCell);

        // Rashi (localized)
        const rashiCell = document.createElement("td");
        const rashiName = (activeLanguage === "ta") ? (RASHI_TAMIL_FULL[metadata.rashi] || metadata.rashi) : (RASHI_DISPLAY_NAMES[metadata.rashi] || metadata.rashi);
        rashiCell.innerText = rashiName;
        row.appendChild(rashiCell);

        // Nakshatra
        const nakshatraCell = document.createElement("td");
        const nakName = metadata.nakshatra?.name || "Unknown";
        const nakPada = metadata.nakshatra?.pada || "?";
        nakshatraCell.innerText = `${nakName} (${activeLanguage === "ta" ? "பாதம்" : "Pada"} ${nakPada})`;
        row.appendChild(nakshatraCell);

        // Longitude Formatted to degrees/minutes
        const longCell = document.createElement("td");
        const degrees = Math.floor(metadata.longitude);
        const minutes = Math.round((metadata.longitude % 1) * 60);
        longCell.innerText = `${degrees}° ${minutes}'`;
        row.appendChild(longCell);

        // Motion status
        const motionCell = document.createElement("td");
        if (metadata.isRetrograde) {
            motionCell.innerHTML = `<span class="retrograde-badge">${activeLanguage === "ta" ? "வக்ரம்" : "Retrograde"}</span>`;
        } else {
            motionCell.innerHTML = `<span class="direct-badge">${activeLanguage === "ta" ? "நேரம்" : "Direct"}</span>`;
        }
        row.appendChild(motionCell);

        tableBody.appendChild(row);
    });
}

// --------------------------------------------------------------------------
// Form Action - Cast Charts
// --------------------------------------------------------------------------
function setupChartForm() {
    const form = document.getElementById("chart-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dateString = document.getElementById("birth-date").value;
        const timeString = document.getElementById("birth-time").value;
        const lat = parseFloat(document.getElementById("birth-lat").value);
        const lng = parseFloat(document.getElementById("birth-lng").value);
        const timezone = parseFloat(document.getElementById("birth-timezone").value);

        // UI states
        const placeholder = document.getElementById("chart-placeholder");
        const results = document.getElementById("chart-results");

        placeholder.innerHTML = `
            <i class="fa-solid fa-bahai placeholder-icon spin text-gold"></i>
            <h3>${activeLanguage === "ta" ? "விண்மீன் நிலைகள் கணிக்கப்படுகிறது..." : "Consulting Cosmic Almanacs..."}</h3>
            <p>${activeLanguage === "ta" ? "சுவிஸ் எபெமெரிஸ் மூலம் கிரக நிலைகள் மற்றும் லக்ன பாகைகள் கணக்கிடப்படுகின்றன." : "Fetching astronomical data and computing Lagna structures from Swiss Ephemeris."}</p>
        `;
        placeholder.classList.remove("hidden");
        results.classList.add("hidden");

        try {
            const response = await fetch("/api/getBirthNavamsaChart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dateString, timeString, lat, lng, timezone })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch astronomical charts");
            }

            const data = await response.json();
            currentChartData = data;

            // Render SVGs according to selected style
            drawActiveCharts();

            // Populate coordinates table
            populatePlanetaryTable(data.birthChart);

            // Toggle layout display
            placeholder.classList.add("hidden");
            results.classList.remove("hidden");

        } catch (error) {
            placeholder.innerHTML = `
                <i class="fa-solid fa-circle-exclamation placeholder-icon text-rose"></i>
                <h3>${activeLanguage === "ta" ? "கணிப்பதில் பிழை ஏற்பட்டது" : "Calculation Alignment Error"}</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="btn btn-outline-gold mt-4">${activeLanguage === "ta" ? "மீண்டும் கணிக்க" : "Retry Casting"}</button>
            `;
        }
    });
}

// --------------------------------------------------------------------------
// Form Action - Compatibility Hub
// --------------------------------------------------------------------------
function setupCompatibilityForm() {
    const form = document.getElementById("compatibility-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Partner 1 Inputs
        const p1 = {
            dateString: document.getElementById("p1-date").value,
            timeString: document.getElementById("p1-time").value,
            lat: parseFloat(document.getElementById("p1-lat").value),
            lng: parseFloat(document.getElementById("p1-lng").value),
            timezone: parseFloat(document.getElementById("p1-timezone").value)
        };

        // Partner 2 Inputs
        const p2 = {
            dateString: document.getElementById("p2-date").value,
            timeString: document.getElementById("p2-time").value,
            lat: parseFloat(document.getElementById("p2-lat").value),
            lng: parseFloat(document.getElementById("p2-lng").value),
            timezone: parseFloat(document.getElementById("p2-timezone").value)
        };

        const rawThreshold = parseInt(document.getElementById("threshold-slider").value);
        const threshold = rawThreshold / 30; // normalized score offset

        const placeholder = document.getElementById("compat-placeholder");
        const results = document.getElementById("compat-results");

        placeholder.innerHTML = `
            <i class="fa-solid fa-heart-circle-bolt placeholder-icon beating text-rose"></i>
            <h3>${activeLanguage === "ta" ? "பொருத்தங்கள் கணக்கிடப்படுகிறது..." : "Calculating Soul Affinity Points..."}</h3>
            <p>${activeLanguage === "ta" ? "இரு ஜாதகத்தின் லக்னம், செவ்வாய் தோஷம், யோனி மற்றும் கிரகங்கள் இணக்கம் சோதிக்கப்படுகின்றன." : "Interfering Sun, Moon, Lagna, and Venus coordinates. Evaluating animal matrices (Yoni Koota) and checking Manglik aspects."}</p>
        `;
        placeholder.classList.remove("hidden");
        results.classList.add("hidden");

        try {
            const response = await fetch("/api/compatibility", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ person1: p1, person2: p2, threshold: threshold })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Synastry calculation failed.");
            }

            const data = await response.json();
            
            // Build UI representation
            renderCompatibilityResults(data, rawThreshold);

            placeholder.classList.add("hidden");
            results.classList.remove("hidden");

        } catch (error) {
            placeholder.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation placeholder-icon text-rose"></i>
                <h3>${activeLanguage === "ta" ? "இணைப்பதில் பிழை ஏற்பட்டது" : "Synastry Sync Failed"}</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="btn btn-rose mt-4">${activeLanguage === "ta" ? "மீண்டும் முயற்சிக்க" : "Retry Matching"}</button>
            `;
        }
    });
}

// Render dynamic scorecard and accordion list items
function renderCompatibilityResults(data, rawThreshold) {
    const scoreRing = document.getElementById("score-ring-fill");
    const scoreText = document.getElementById("compat-score-text");
    const verdictBadge = document.getElementById("compat-verdict-badge");
    const verdictText = document.getElementById("compat-verdict-text");
    const rulesList = document.getElementById("compat-rules-list");

    rulesList.innerHTML = ""; // Reset accordion list

    // Extract both partners' entered names
    const p1Name = document.getElementById("p1-name")?.value.trim() || "Person 1";
    const p2Name = document.getElementById("p2-name")?.value.trim() || "Person 2";

    // Dynamically update couple name header banner
    const coupleNameHeader = document.getElementById("couple-name-text");
    if (coupleNameHeader) {
        coupleNameHeader.innerHTML = `<span style="color: var(--accent); font-weight: bold;">${p1Name}</span> &amp; <span style="color: var(--accent); font-weight: bold;">${p2Name}</span>`;
    }

    // Case 1: Hard D9 Block (API literally returns false)
    if (data === false) {
        // Animate dial to 0
        scoreRing.style.strokeDashoffset = 440;
        scoreText.innerText = "0 / 30";

        // Style badge for warning
        verdictBadge.className = "outcome-badge incompatible";
        verdictText.innerText = activeLanguage === "ta" ? `${p1Name} & ${p2Name}: நவாம்சம் தடுக்கப்பட்டது` : `${p1Name} & ${p2Name}: Blocked (D9 Requirement)`;

        // Append dummy explanation card
        const card = document.createElement("div");
        card.className = "rule-widget-card col-span-2";
        card.style.gridColumn = "span 2";
        card.innerHTML = `
            <div class="rule-info">
                <h4 style="color:#ef5350"><i class="fa-solid fa-ban"></i> ${activeLanguage === "ta" ? "நவாம்ச பொருத்தம் தோல்வியடைந்தது" : "Hard Navamsa Barrier Encountered"}</h4>
                <p style="margin-top:0.4rem; line-height:1.5;">
                    ${activeLanguage === "ta" ? "திருமண பொருத்தத்தில் D9 நவாம்ச ஏழாம் வீட்டு பொருத்தம் இன்றியமையாதது. இருவரில் யாருக்கும் இந்த அமைப்பு அமையாததால், இதர கிரக பொருத்தங்கள் இருந்தபோதிலும் ஜாதகம் பொருத்தமற்றதாக (0/30) கருதப்படுகிறது." : "The D9 Navamsa seventh-house alignment is a critical requirement in this astrology library. Neither individual's chart matched this necessary structural milestone, meaning the union is evaluated as incompatibile (0/30 overall score) regardless of secondary positions."}
                </p>
            </div>
            <div class="rule-status neutral"><i class="fa-solid fa-times"></i></div>
        `;
        rulesList.appendChild(card);
        return;
    }

    // Case 2: Standard score evaluation
    const score = data.total_score;
    
    // Animate radial progress ring
    const strokeOffset = 440 - (440 * score / 30);
    scoreRing.style.strokeDashoffset = strokeOffset;
    scoreText.innerText = `${score} / 30`;

    // Decision checking
    const isCompatible = score >= rawThreshold;
    if (isCompatible) {
        verdictBadge.className = "outcome-badge compatible";
        if (score >= 22) {
            verdictText.innerText = activeLanguage === "ta" ? `${p1Name} & ${p2Name}: மிகவும் உன்னதமான பொருத்தம்` : `${p1Name} & ${p2Name}: Highly Auspicious Match`;
        } else {
            verdictText.innerText = activeLanguage === "ta" ? `${p1Name} & ${p2Name}: பொருத்தம் உள்ளது` : `${p1Name} & ${p2Name}: Compatible Union`;
        }
    } else {
        verdictBadge.className = "outcome-badge incompatible";
        verdictText.innerText = activeLanguage === "ta" ? `${p1Name} & ${p2Name}: பொருத்தம் போதாது` : `${p1Name} & ${p2Name}: Challenging Compatibility`;
    }

    // Compute granular rule-by-rule points by examining the cumulative after_score differences
    let prevScore = 0;
    const ruleBreakdown = data.interim.map((item) => {
        const pointsGained = item.after_score - prevScore;
        prevScore = item.after_score;
        return {
            key: item.key,
            points: pointsGained,
            cumulative: item.after_score
        };
    });

    // Populate rule list cards
    ruleBreakdown.forEach(rule => {
        const meta = RULE_METADATA[rule.key] || { title: rule.key, titleTa: rule.key, desc: "Astrological alignment test.", descTa: "வானியல் கிரக நிலை பொருத்தம்." };
        const card = document.createElement("div");
        card.className = "rule-widget-card";

        const passed = rule.points > 0;
        const statusClass = passed ? "passed" : "neutral";
        const icon = passed ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-minus"></i>';
        
        const displayTitle = activeLanguage === "ta" ? meta.titleTa : meta.title;
        const displayDesc = activeLanguage === "ta" ? meta.descTa : meta.desc;

        const ptsText = passed ? `+${rule.points} ${activeLanguage === "ta" ? "புள்ளி" : "Pt"}${rule.points > 1 && activeLanguage !== "ta" ? "s" : ""}` : `0 ${activeLanguage === "ta" ? "புள்ளி" : "Pts"}`;
        const ptsStyle = passed ? "color:#66bb6a; font-weight:700" : "color:var(--text-muted)";

        card.innerHTML = `
            <div class="rule-info">
                <h4>${displayTitle}</h4>
                <p class="desc-text">${displayDesc}</p>
                <p style="margin-top: 0.25rem; font-size: 0.75rem; ${ptsStyle}">${ptsText} ${activeLanguage === "ta" ? "பெறப்பட்டது" : "Earned"}</p>
            </div>
            <div class="rule-status ${statusClass}">
                ${icon}
            </div>
        `;
        rulesList.appendChild(card);
    });
}
