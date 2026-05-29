import { VenueDesign, PresetVenue } from "./types";

export const PRESET_THEMES: { [key: string]: VenueDesign } = {
  royalLavender: {
    themeName: "أرجوان القصر الملكي",
    themeEnglish: "Royal Lavender & Orchid Symphony",
    recommendedFlowers: [
      { nameArabic: "لافندر حائل البنفسجي", nameEnglish: "Hail Violet Lavender", color: "#8B5CF6", percentage: 40, symbolicMeaning: "السكينة والفخامة والتميز الفريد" },
      { nameArabic: "الأوركيد الأبيض الإمبراطوري", nameEnglish: "Imperial White Orchid", color: "#FFFFFF", percentage: 35, symbolicMeaning: "جمال خالد وسحر معاصر نقي" },
      { nameArabic: "الهايدرنجا الساحرة", nameEnglish: "Velvet Mystic Hydrangea", color: "#A78BFA", percentage: 25, symbolicMeaning: "الوفرة والانسجام في ليلة الزفاف" }
    ],
    floorLayout: {
      catwalkLength: 18,
      hasFlowerArch: true,
      lightingColor: "#8B5CF6",
      koshaBackground: "CrystalHarp",
      tableStyle: "Round",
      flowerDensity: "royal"
    },
    aestheticDescription: "مزيج مترف يخاطب النخبة، مستوحى من تدرجات الشفق في صحراء النفود، يدمج بين اللافندر النقي والأوركيد الفاخر على طول الممشى الزجاجي اللامع.",
    suggestedLighting: {
      intensity: 85,
      ambientHex: "#2E1065",
      spotlightHex: "#C084FC",
      atmosphereName: "الشفق البنفسجي اللامع"
    },
    estimatedBudgetSAR: 185000,
    ksaSuitability: "مثالي للصالات الكبرى بالعاصمة الرياض وغرب جدة لليالي الزفاف ذات الرؤية الرومانسية المبتكرة."
  },
  goldenDesert: {
    themeName: "شروق الصحراء المذهب",
    themeEnglish: "Gilded Desert Sunrise",
    recommendedFlowers: [
      { nameArabic: "الجوري الأصفر الذهبي", nameEnglish: "Saudi Gold Rose", color: "#FBBF24", percentage: 45, symbolicMeaning: "رمز الكرم والترحيب والبهجة الدافئة" },
      { nameArabic: "الوزّاع الشامخ الفضي", nameEnglish: "Silver Eucalyptus Leaves", color: "#94A3B8", percentage: 25, symbolicMeaning: "الأصالة والنبل والنضارة المستمرة" },
      { nameArabic: "الأوركيد الأبيض المذهب", nameEnglish: "Gilded White Orchid", color: "#FEF3C7", percentage: 30, symbolicMeaning: "التناغم بين الرفاهية والنعومة" }
    ],
    floorLayout: {
      catwalkLength: 20,
      hasFlowerArch: true,
      lightingColor: "#FBBF24",
      koshaBackground: "ModernGold",
      tableStyle: "Banqueting",
      flowerDensity: "royal"
    },
    aestheticDescription: "مفهوم يخلط عراقة الثقافة السعودية بلمسات القرن الحادي والعشرين الفاخرة، حيث تتباين التفاصيل الذهبية المذهلة مع ثريات القاعة الشامخة وضباب النيتروجين المنعش.",
    suggestedLighting: {
      intensity: 95,
      ambientHex: "#78350F",
      spotlightHex: "#FCD34D",
      atmosphereName: "سحر الذهب الدافئ"
    },
    estimatedBudgetSAR: 220000,
    ksaSuitability: "يعكس ذوق النخبة وعراقة الأمسيات النجدية في القاعات الكبرى مثل الريتز كارلتون ولا لونا."
  },
  classicRedWhite: {
    themeName: "القصيدة العرائسية الكلاسيكية",
    themeEnglish: "Eternal Jasmine & Crimson Rose",
    recommendedFlowers: [
      { nameArabic: "الورد الجوري الأحمر الفخم", nameEnglish: "Saudi Royal Red Rose", color: "#DC2626", percentage: 50, symbolicMeaning: "الشغف المعماري، الكرم، والفخامة المطلقة" },
      { nameArabic: "ياسمين الحجاز الأبيض", nameEnglish: "Pure Hijaz White Jasmine", color: "#FFFFFF", percentage: 30, symbolicMeaning: "النقاء والسلام الأبدي ورائحة الطفولة العطرة" },
      { nameArabic: "الهايدرنجا الكريمية", nameEnglish: "Cream Hydrangea Aura", color: "#FFFBEB", percentage: 20, symbolicMeaning: "التوازن والجمال الطبيعي المستدام" }
    ],
    floorLayout: {
      catwalkLength: 16,
      hasFlowerArch: true,
      lightingColor: "#FEF3C7",
      koshaBackground: "RoseWall",
      tableStyle: "Round",
      flowerDensity: "dense"
    },
    aestheticDescription: "التصميم الأكثر فخامة ورسوخًا بإشراف مهندسي جيرار للتصميم، حيث ندمج الجوري والياسمين لابتكار سجاد مكسو بالورد على طول الممر الرخامي، وإضاءة دافئة مريحة للعين.",
    suggestedLighting: {
      intensity: 80,
      ambientHex: "#1E1B4B",
      spotlightHex: "#FEF3C7",
      atmosphereName: "شموع الشمبانيا الدافئة"
    },
    estimatedBudgetSAR: 145000,
    ksaSuitability: "الخيار الأبرز لجميع صالات وقصور الأفراح العريقة بالمملكة لضمان هيبة المظهر وجودة الصور التذكارية."
  },
  neomEmerald: {
    themeName: "مستقبل نيوم الزمردي",
    themeEnglish: "Emerald & White Tomorrow",
    recommendedFlowers: [
      { nameArabic: "الأكمية البيضاء الفاخرة", nameEnglish: "Futuristic White Anthurium", color: "#FFFFFF", percentage: 40, symbolicMeaning: "الحداثة والإثارة والريادة الفنية" },
      { nameArabic: "النخيل الزمردي المتدلي", nameEnglish: "Cascading Emerald Ruscus", color: "#059669", percentage: 40, symbolicMeaning: "النمو والازدهار ورؤية المستقبل" },
      { nameArabic: "الجليسين الأخضر الفاتن", nameEnglish: "Celadon Glycine Trails", color: "#D1FAE5", percentage: 20, symbolicMeaning: "النقاء والانسجام البيئي المبتكر" }
    ],
    floorLayout: {
      catwalkLength: 22,
      hasFlowerArch: false,
      lightingColor: "#10B981",
      koshaBackground: "ModernGold",
      tableStyle: "Banqueting",
      flowerDensity: "moderate"
    },
    aestheticDescription: "تصميم جريء ومبتكر للغاية يتخلى عن السيكولوجية الرتيبة ويجمع أشكالاً فريدة من ثريات الياسمين المعلقة والمرايا اللانهائية، مما يعكس طاقة مدن المستقبل السعودي الحية.",
    suggestedLighting: {
      intensity: 75,
      ambientHex: "#064E3B",
      spotlightHex: "#34D399",
      atmosphereName: "هالة نيوم الزمردية"
    },
    estimatedBudgetSAR: 195000,
    ksaSuitability: "مصمم تحديداً لإبهار الزوار في المناسبات عصرية الطابع والملتقيات الرائدة في مدن تكنو-سعودية حديثة."
  }
};

export const PRESET_VENUES: PresetVenue[] = [
  {
    id: "yamamah-riyadh",
    title: "قاعة اليمامة الكبرى - الرياض",
    titleEn: "Al Yamamah Grand Ballroom - Riyadh",
    location: "حي النخيل، الرياض",
    capacity: "٤٠٠ - ٨٠٠ ضيف",
    description: "تعد قاعة اليمامة تحفة معمارية في قلب العاصمة، تتميز بأسقفها الشاهقة وجدرانها المرصعة بالزخارف الأندلسية والممشى الرخامي الممتد لـ٢٥ متراً.",
    imgUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    designer: "نخبة مهندسي الرياض",
    defaultDesign: PRESET_THEMES.royalLavender
  },
  {
    id: "andalus-jeddah",
    title: "قصر الأندلس للعروسين - جدة",
    titleEn: "Al Andalus Royal Palace - Jeddah",
    location: "كورنيش جدة الحمراء",
    capacity: "٣٠٠ - ٦٠٠ ضيف",
    description: "إطلالة بانورامية ساحرة على البحر الأحمر مع واجهات زجاجية وسقف متحرك يسمح بإدخال ضوء القمر السعودي الدافئ ومسرح كوشة عريض كالهلال.",
    imgUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200",
    designer: "جيرار للتصميم - الحجاز",
    defaultDesign: PRESET_THEMES.classicRedWhite
  },
  {
    id: "dammam-pearl",
    title: "صالة لؤلؤة الخليج - الدمام",
    titleEn: "Gulf Pearl Pavilion - Dammam",
    location: "الدمام، الكورنيش الشرقي",
    capacity: "٢٥٠ - ٥٠٠ ضيف",
    description: "قاعة ملكية بتصميم مشرق ومساحة هندسية دائرية تمنح رؤية مثالية ٣٦٠ درجة من جميع الطاولات للمسرح الرئيسي وعروض الليزر والورود والزينة.",
    imgUrl: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1200",
    designer: "استوديو الشرقية الإبداعي",
    defaultDesign: PRESET_THEMES.goldenDesert
  },
  {
    id: "neom-royal-tent",
    title: "الخيمة المليارية الذكية - نيوم",
    titleEn: "The Billion Tent Ballroom - NEOM",
    location: "خليج نيوم الحالم",
    capacity: "٥٠٠ - ١٢٠٠ ضيف",
    description: "صرح من الخيال المعماري يتميز بهندسة مرنة وجدران عرض هولوجرامية متزامنة بالكامل مع الذكاء الاصطناعي، لتغيير السقف إلى سماء كوكبية خلابة.",
    imgUrl: "https://images.unsplash.com/photo-1507504038482-76210f52ccf1?auto=format&fit=crop&q=80&w=1200",
    designer: "نيوم للمستقبل والتخطيط",
    defaultDesign: PRESET_THEMES.neomEmerald
  }
];

export const FLOWER_CATALOG = [
  { id: "royal-rose", nameAr: "ورد جوري ملكي", nameEn: "Royal Rose", defaultColor: "#E11D48", colors: ["#E11D48", "#FFFFFF", "#F472B6", "#FBBF24"] },
  { id: "jasmine", nameAr: "ياسمين بلدي", nameEn: "Hijaz Jasmine", defaultColor: "#F8FAFC", colors: ["#F8FAFC", "#FEF08A"] },
  { id: "orchid", nameAr: "أوركيد نادر", nameEn: "Rare Orchid", defaultColor: "#D8B4FE", colors: ["#D8B4FE", "#C084FC", "#FFFFFF", "#F59E0B"] },
  { id: "hydrangea", nameAr: "هايدرنجا عريضة", nameEn: "Fluffy Hydrangea", defaultColor: "#93C5FD", colors: ["#93C5FD", "#F9A8D4", "#C4B5FD", "#FFFFFF"] },
  { id: "eucalyptus", nameAr: "أوكالبتوس فضي", nameEn: "Silver Eucalyptus", defaultColor: "#64748B", colors: ["#64748B", "#475569", "#2DD4BF"] },
  { id: "fronds", nameAr: "سعف النخيل المذهب", nameEn: "Gilded Palm Fronds", defaultColor: "#F59E0B", colors: ["#F59E0B", "#B45309", "#854D0E"] }
];
