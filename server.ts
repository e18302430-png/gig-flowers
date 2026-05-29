import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. The system will use deterministic luxurious Saudization algorithms as fallback.");
      throw new Error("GEMINI_API_KEY is missing");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback high-quality design generator in Arabic for Saudi halls
const getFallbackDesign = (userPrompt: string) => {
  const promptLower = userPrompt.toLowerCase();
  
  if (promptLower.includes("لافندر") || promptLower.includes("lavender") || promptLower.includes("بنفسج")) {
    return {
      themeName: "حلم اللافندر الملكي",
      themeEnglish: "Royal Lavender Dream",
      recommendedFlowers: [
        { nameArabic: "اللافندر الطبيعي", nameEnglish: "Highland Lavender", color: "#8B5CF6", percentage: 45, symbolicMeaning: "الهدوء والرفاهية والتميز" },
        { nameArabic: "الروز الأبيض الملكي", nameEnglish: "Royal White Rose", color: "#F9FAFB", percentage: 35, symbolicMeaning: "النقاء والسلام والرحابة" },
        { nameArabic: "الأوركيد البنفسجي", nameEnglish: "Mystic Orchid", color: "#C084FC", percentage: 20, symbolicMeaning: "الجمال النادر والأناقة المعاصرة" }
      ],
      floorLayout: {
        catwalkLength: 18,
        hasFlowerArch: true,
        lightingColor: "#8B5CF6",
        koshaBackground: "CrystalHarp",
        tableStyle: "Round",
        flowerDensity: "royal"
      },
      aestheticDescription: "تصميم ملكي غامر يحاكي هدوء وجاذبية حقول اللافندر السعودية الفاخرة، يدمج بين بريق الكريستال الساحر والجدران المخملية مع التوزيع الاحترافي للأوركيد والروز.",
      suggestedLighting: {
        intensity: 85,
        ambientHex: "#6D28D9",
        spotlightHex: "#C084FC",
        atmosphereName: "الشفق البنفسجي (Violet Twilight)"
      },
      estimatedBudgetSAR: 175000,
      ksaSuitability: "مثالي للصالات الكبرى بالرياض وجدة التي تبحث عن طابع فريد وفخم يكسر النمط التقليدي ويذهل الحضور."
    };
  }

  if (promptLower.includes("ذهبي") || promptLower.includes("gold") || promptLower.includes("شروق") || promptLower.includes("صحراء")) {
    return {
      themeName: "شروق الصحراء الذهبي",
      themeEnglish: "Golden Desert Oasis",
      recommendedFlowers: [
        { nameArabic: "الورود الصفراء والبرتقالية الكلاسيكية", nameEnglish: "Desert Gold Roses", color: "#FBBF24", percentage: 40, symbolicMeaning: "الكرم والدفء العربي الفريد" },
        { nameArabic: "الهايدرنجا الكريمية", nameEnglish: "Cream Hydrangea", color: "#FEF3C7", percentage: 40, symbolicMeaning: "الامتنان والوفرة والفخامة المتجددة" },
        { nameArabic: "سعف النخيل الذهبي المجفف", nameEnglish: "Gilded Palm Fronds", color: "#D97706", percentage: 20, symbolicMeaning: "الأصالة والتراث المعماري السعودي الفخم" }
      ],
      floorLayout: {
        catwalkLength: 20,
        hasFlowerArch: true,
        lightingColor: "#FBBF24",
        koshaBackground: "ModernGold",
        tableStyle: "Banqueting",
        flowerDensity: "royal"
      },
      aestheticDescription: "مفهوم يخلط عراقة الثقافة النجدية بلمسات القرن الحادي والعشرين الفاخرة، حيث تتباين سعف النخيل المذهبة مع هالات الهايدرنجا العريضة تحت إضاءة دافئة تحاكي الغروب السعودي.",
      suggestedLighting: {
        intensity: 90,
        ambientHex: "#78350F",
        spotlightHex: "#FBBF24",
        atmosphereName: "الغروب الذهبي (Golden Hour)"
      },
      estimatedBudgetSAR: 210000,
      ksaSuitability: "يتماشى تماماً مع ذوق قاعات الرياض الفخمة والمساحات المفتوحة الفاخرة التي تفخر باللمسة التراثية المستحدثة."
    };
  }

  // Default design: Red & White Royal Roses
  return {
    themeName: "واحة الجوري والياسمين الكلاسيكي",
    themeEnglish: "Jasmine & Royal Rose Oasis",
    recommendedFlowers: [
      { nameArabic: "الورد الجوري السعودي الأحمر", nameEnglish: "Saudi Royal Red Rose", color: "#DC2626", percentage: 50, symbolicMeaning: "الضيافة والعمق العاطفي والفخامة العربية" },
      { nameArabic: "الياسمين الأبيض الفخم", nameEnglish: "Pure White Jasmine", color: "#FFFFFF", percentage: 30, symbolicMeaning: "البراءة والرقة المطلقة والجمال الطبيعي" },
      { nameArabic: "أوراق الأوكالبتوس الفضية", nameEnglish: "Silver Eucalyptus", color: "#94A3B8", percentage: 20, symbolicMeaning: "الخلود والاتصال بالنقاء والنضارة" }
    ],
    floorLayout: {
      catwalkLength: 16,
      hasFlowerArch: true,
      lightingColor: "#FEF3C7",
      koshaBackground: "RoseWall",
      tableStyle: "Round",
      flowerDensity: "dense"
    },
    aestheticDescription: "التصميم الكلاسيكي الفاخر الذي لا تنطفئ بهجته، يجمع بين عبق الجوري الأحمر والياسمين الأبيض العرائسي الرائع، ليعود بالقاعة إلى أوج سحر الأمسيات الشرقية الخالدة.",
    suggestedLighting: {
      intensity: 75,
      ambientHex: "#1E1B4B",
      spotlightHex: "#FEF3C7",
      atmosphereName: "البريق الخافت (Champagne Shimmer)"
    },
    estimatedBudgetSAR: 140000,
    ksaSuitability: "الخيار الأبرز لصاحب أي قاعة سعودية راقية لضمان نجاح أي حفل زفاف بأناقة مضمونة وتوزيع متناسق مثير للاهتمام."
  };
};

// Orchestrate Route - Calls Gemini API on server side
app.post("/api/orchestrate", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "الرجاء تقديم وصف للقاعة لتصميمها بالذكاء الاصطناعي." });
  }

  try {
    const ai = getGeminiClient();
    
    const systemInstruction = `You are the master generative designer for "GIGI FLOWERS" (Saudi Arabia's premier luxurious AI wedding/event venue floral orchestrator).
You receive a text prompt from a prestigious event hall owner in Saudi Arabia describing the mood, floral vision, colors, budget preference, or style they want for their venue.
Generate a structured design solution optimized for a stunning 3D canvas/mesh preview.
Respond ONLY with a valid JSON object matching the following structure:
{
  "themeName": "Theme title in Arabic (very poetic and elegant, e.g. حلم الصحراء الزمردي)",
  "themeEnglish": "English counterpart name",
  "recommendedFlowers": [
    {
      "nameArabic": "Flower name in Arabic",
      "nameEnglish": "Flower name in English",
      "color": "Hex Color code matching this flower",
      "percentage": 10-100 (total must add up to 100),
      "symbolicMeaning": "Brief cultural or aesthetic symbolic meaning for KSA events in Arabic"
    }
  ],
  "floorLayout": {
    "catwalkLength": Number between 10 and 25 (length in meters),
    "hasFlowerArch": Boolean,
    "lightingColor": "Hex of spotlight color",
    "koshaBackground": "One of: 'RoseWall' | 'CrystalHarp' | 'GardenArch' | 'ModernGold'",
    "tableStyle": "One of: 'Round' | 'Banqueting'",
    "flowerDensity": "One of: 'moderate' | 'dense' | 'royal'"
  },
  "aestheticDescription": "Poetic, deep, and convincing visual description in Arabic explaining why this fits the owner's hall, with advice on high-end placement.",
  "suggestedLighting": {
    "intensity": Number between 40 and 100 (percentage),
    "ambientHex": "Hex of the ambient room wash",
    "spotlightHex": "Hex of the spotlights over tables and walk",
    "atmosphereName": "Name of the lighting environment (e.g. النور السرمدي)"
  },
  "estimatedBudgetSAR": Number (realistic local market price between 80,000 and 350,000 SAR for ultra-premium setups)",
  "ksaSuitability": "Specific Saudi custom context suitability description in Arabic (e.g. يناسب تماماً ليالي الزفاف النجدية الكبرى أو المناسبات الاستثنائية بجدة)"
}

Do not include any Markdown code blocks, triple-backticks (\`\`\`), or extra words. Output only pure valid JSON. Must be in Arabic (mainly) with beautiful cultural appeal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Gemini API Error, falling back gracefully:", error.message || error);
    // Graceful customized response for the KSA market
    const fallback = getFallbackDesign(prompt);
    return res.json(fallback);
  }
});

// Serve static elements and wire up Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GIGI FLOWERS Dev Server ready at http://localhost:${PORT}`);
  });
}

startServer();
