import React, { useState } from "react";
import { VenueDesign, KoshaStyle, TableStyle, FlowerDensity } from "../types";
import { 
  Sparkles, 
  Eye, 
  Zap, 
  Layers, 
  RefreshCw, 
  Upload, 
  Trash2, 
  Sliders, 
  HelpCircle, 
  Music, 
  Volume2, 
  VolumeX, 
  Settings, 
  Activity, 
  Award,
  Users
} from "lucide-react";

interface HallVisualizerProps {
  design: VenueDesign;
  onUpdateLayout: (updater: (prev: VenueDesign["floorLayout"]) => VenueDesign["floorLayout"]) => void;
  onUpdateLighting: (updater: (prev: VenueDesign["suggestedLighting"]) => VenueDesign["suggestedLighting"]) => void;
  hasOwnerEntered?: boolean;
  setHasOwnerEntered?: (entered: boolean) => void;
  ownerName?: string;
  setOwnerName?: (name: string) => void;
  ownerHallName?: string;
  setOwnerHallName?: (hall: string) => void;
  smartGlassCeiling?: boolean;
  setSmartGlassCeiling?: (active: boolean) => void;
  holographicGround?: boolean;
  setHolographicGround?: (active: boolean) => void;
  scentSprinkler?: boolean;
  setScentSprinkler?: (active: boolean) => void;
  kineticChandeliers?: boolean;
  setKineticChandeliers?: (active: boolean) => void;
  customRealPhoto?: string | null;
  setCustomRealPhoto?: (photo: string | null) => void;
}

// Custom Unsplash photos optimized for Saudi Premium segregated ballrooms
const WOMEN_PRESETS = [
  {
    name: "قاعة رويال نجد الكبرى - قسم النساء",
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    desc: "فخامة كلاسيكية بقبة مذهبة وممر زفة رخامي شاهق للأعراس النسائية الفخمة بالرياض"
  },
  {
    name: "قاعة النخبة الرخامية بجدة - قسم النساء",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    desc: "قصر المناسبات الحجازي الحديث بجدران حريرية كريمية وأقواس مهيأة للأزهار الملكية"
  },
  {
    name: "صالة لؤلؤة البحر الحمراء - قسم النساء",
    url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=1200",
    desc: "توزيع زجاجي مستقبلي في قاعات الكورنيش غني بدرجات اللافندر ومؤثرات ضباب النيتروجين"
  }
];

const MEN_PRESETS = [
  {
    name: "مجلس الوجهاء العريق بالرياض - قسم الرجال",
    url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1200",
    desc: "مجلس ملكي مجهز بكنب الوبر الفاخر ونقوش جصية نجدية وطاولات مجهزة بأعواد البخور والدلال"
  },
  {
    name: "ديوانية الكرم الأصيل بجدة - قسم الرجال",
    url: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=1200",
    desc: "أجواء فخمة تجمع الكرم السعودي الأصيل مع توزيع الورود البيضاء الملكية والقهوة النجدية"
  },
  {
    name: "صالة التشريفات الملكية الكبرى بالدمام - قسم الرجال",
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    desc: "موقع استقبال كبار الشخصيات مع لمسات السعف المذهب وبطراز شرقي حديث عالي الوقار"
  }
];

// Custom high-res aerial templates for AR overlays
const AR_FLOOR_PRESETS = [
  {
    name: "مخطط سكتش هندسي رمادي (Blueprint Grid)",
    url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=1200",
    desc: "مخطط فني رمادي دقيق لتأطير وبث توزيع منصات وصناديق الورد"
  },
  {
    name: "مخطط رخام الصالة المتجانس (Luxe Tiled Ground)",
    url: "https://images.unsplash.com/photo-1581447101795-7714d8ec60fc?auto=format&fit=crop&q=80&w=1200",
    desc: "أرضية ممتدة صقيلة لملاءمة خطوط الانعكاس الضوئي تحت الزينة الملكية"
  },
  {
    name: "خريطة المخطط الافتراضي اللامع (Golden Slate Layout)",
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    desc: "رؤية أفقية عميقة للبهو والمنصة الرئيسية والمدرجات الجانبية للتناسق"
  }
];

// Lazily initialized global audio context to prevent autoplay browser restrictions
let audioCtx: AudioContext | null = null;

export default function HallVisualizer({ 
  design, 
  onUpdateLayout, 
  onUpdateLighting,
  hasOwnerEntered: propHasOwnerEntered,
  setHasOwnerEntered: propSetHasOwnerEntered,
  ownerName: propOwnerName,
  setOwnerName: propSetOwnerName,
  ownerHallName: propOwnerHallName,
  setOwnerHallName: propSetOwnerHallName,
  smartGlassCeiling: propSmartGlassCeiling,
  setSmartGlassCeiling: propSetSmartGlassCeiling,
  holographicGround: propHolographicGround,
  setHolographicGround: propSetHolographicGround,
  scentSprinkler: propScentSprinkler,
  setScentSprinkler: propSetScentSprinkler,
  kineticChandeliers: propKineticChandeliers,
  setKineticChandeliers: propSetKineticChandeliers,
  customRealPhoto: propCustomRealPhoto,
  setCustomRealPhoto: propSetCustomRealPhoto
}: HallVisualizerProps) {
  const [viewMode, setViewMode] = useState<"virtual" | "real_photo" | "dual_cinema" | "ar_overlay">("dual_cinema");
  const [hallSection, setHallSection] = useState<"women" | "men">("women");
  const [selectedRealPresetIdx, setSelectedRealPresetIdx] = useState<number>(0);
  
  // Local states
  const [localCustomRealPhoto, localSetCustomRealPhoto] = useState<string | null>(null);
  const [localHasOwnerEntered, localSetHasOwnerEntered] = useState<boolean>(false);
  const [localOwnerName, localSetOwnerName] = useState<string>("المهندس فيصل بن عبدالرحمن");
  const [localOwnerHallName, localSetOwnerHallName] = useState<string>("قصر الأمراء الكريستالي");
  const [localSmartGlassCeiling, localSetSmartGlassCeiling] = useState<boolean>(true);
  const [localHolographicGround, localSetHolographicGround] = useState<boolean>(true);
  const [localScentSprinkler, localSetScentSprinkler] = useState<boolean>(true);
  const [localKineticChandeliers, localSetKineticChandeliers] = useState<boolean>(false);

  // Computed state references
  const customRealPhoto = propCustomRealPhoto !== undefined ? propCustomRealPhoto : localCustomRealPhoto;
  const setCustomRealPhoto = propSetCustomRealPhoto || localSetCustomRealPhoto;
  const hasOwnerEntered = propHasOwnerEntered !== undefined ? propHasOwnerEntered : localHasOwnerEntered;
  const setHasOwnerEntered = propSetHasOwnerEntered || localSetHasOwnerEntered;
  const ownerName = propOwnerName !== undefined ? propOwnerName : localOwnerName;
  const setOwnerName = propSetOwnerName || localSetOwnerName;
  const ownerHallName = propOwnerHallName !== undefined ? propOwnerHallName : localOwnerHallName;
  const setOwnerHallName = propSetOwnerHallName || localSetOwnerHallName;
  const smartGlassCeiling = propSmartGlassCeiling !== undefined ? propSmartGlassCeiling : localSmartGlassCeiling;
  const setSmartGlassCeiling = propSetSmartGlassCeiling || localSetSmartGlassCeiling;
  const holographicGround = propHolographicGround !== undefined ? propHolographicGround : localHolographicGround;
  const setHolographicGround = propSetHolographicGround || localSetHolographicGround;
  const scentSprinkler = propScentSprinkler !== undefined ? propScentSprinkler : localScentSprinkler;
  const setScentSprinkler = propSetScentSprinkler || localSetScentSprinkler;
  const kineticChandeliers = propKineticChandeliers !== undefined ? propKineticChandeliers : localKineticChandeliers;
  const setKineticChandeliers = propSetKineticChandeliers || localSetKineticChandeliers;

  // AR Drone Overlay States
  const [customFloorPhoto, setCustomFloorPhoto] = useState<string | null>(null);
  const [arDroneHeight, setArDroneHeight] = useState<number>(14.5);
  const [arDroneAngle, setArDroneAngle] = useState<number>(180);
  const [arDroneCoords, setArDroneCoords] = useState<{ x: number; y: number }>({ x: 400, y: 250 });
  const [arDroneOpacity, setArDroneOpacity] = useState<number>(0.85);
  const [arDroneRouteName, setArDroneRouteName] = useState<string>("حلقة مسح وتحليق حر");
  const [arDroneBattery, setArDroneBattery] = useState<number>(95);
  const [arScanningActive, setArScanningActive] = useState<boolean>(true);
  const [customFloorPresetIdx, setCustomFloorPresetIdx] = useState<number>(0);
  
  const [activeAIPromptStep, setActiveAIPromptStep] = useState<number>(0);
  
  // Interactive features
  const [petalCascade, setPetalCascade] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [nitrogenFog, setNitrogenFog] = useState<boolean>(true);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [cameraAngle, setCameraAngle] = useState<"front" | "elevated" | "side">("front");
  
  // Saudi Special Simulated Workflows
  const [isZaffaSimulating, setIsZaffaSimulating] = useState<boolean>(false);
  const [isIncenseSimulating, setIsIncenseSimulating] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  
  // Design details
  const [todMood, setTodMood] = useState<"dawn" | "dusk" | "midnight">("midnight");
  const [saudiScent, setSaudiScent] = useState<"oud" | "lavender" | "jasmine">("oud");
  const [menBackdropPattern, setMenBackdropPattern] = useState<"sadu" | "minimalist">("sadu");

  const { floorLayout, suggestedLighting, recommendedFlowers } = design;

  // Derive top flower colors
  const flower1Color = recommendedFlowers[0]?.color || "#DC2626";
  const flower2Color = recommendedFlowers[1]?.color || "#FFFFFF";
  const flower3Color = recommendedFlowers[2]?.color || "#B45309";

  const currentPresets = hallSection === "women" ? WOMEN_PRESETS : MEN_PRESETS;

  // Handle direct visual interaction
  const triggerZoneAction = (zone: string) => {
    setActiveZone(zone);
    setTimeout(() => setActiveZone(null), 1800);
  };

  // Web Audio procedurally synthesized welcoming sounds corresponding to the cultural section
  const playSymphonicChime = (type: "women" | "men") => {
    if (isAudioMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      
      const now = audioCtx.currentTime;
      
      if (type === "women") {
        // High-end elegant royal harp strings (A major arpeggio sequence for Zaffa)
        const notes = [440.00, 554.37, 659.25, 880.00]; // A4, C#5, E5, A5
        notes.forEach((f, index) => {
          const osc = audioCtx!.createOscillator();
          const gainNode = audioCtx!.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + index * 0.15);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.08, now + index * 0.15 + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.15 + 1.2);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx!.destination);
          
          osc.start(now + index * 0.15);
          osc.stop(now + index * 0.15 + 1.3);
        });
      } else {
        // Deep prestigious brass gong + coffee cup clinks for Saudi Men's Hospitality
        // Warm rich fundamental base note
        const baseOsc = audioCtx!.createOscillator();
        const baseGain = audioCtx!.createGain();
        baseOsc.type = "triangle";
        baseOsc.frequency.setValueAtTime(146.83, now); // D3 Warm
        baseGain.gain.setValueAtTime(0, now);
        baseGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        baseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        baseOsc.connect(baseGain);
        baseGain.connect(audioCtx!.destination);
        baseOsc.start(now);
        baseOsc.stop(now + 1.9);

        // Coffee cup ring clinks
        const pings = [1600, 1800, 1500];
        pings.forEach((p, idx) => {
          const pingOsc = audioCtx!.createOscillator();
          const pingGain = audioCtx!.createGain();
          
          pingOsc.type = "sine";
          pingOsc.frequency.setValueAtTime(p, now + 0.2 + idx * 0.12);
          
          pingGain.gain.setValueAtTime(0, now);
          pingGain.gain.linearRampToValueAtTime(0.04, now + 0.2 + idx * 0.12);
          pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + idx * 0.12 + 0.2);
          
          pingOsc.connect(pingGain);
          pingGain.connect(audioCtx!.destination);
          
          pingOsc.start(now + 0.2 + idx * 0.12);
          pingOsc.stop(now + 0.2 + idx * 0.12 + 0.3);
        });
      }
    } catch (e) {
      console.warn("Web Audio restrictions prevented instant play: ", e);
    }
  };

  // Trigger Bride's simulated slow Zaffa entrance
  const toggleZaffaSimulation = () => {
    if (!isZaffaSimulating) {
      setIsZaffaSimulating(true);
      playSymphonicChime("women");
      triggerZoneAction("زفة العروس التفاعلية بصوت المؤثرات المدمجة وكتم الأنوار الجانبية");
    } else {
      setIsZaffaSimulating(false);
    }
  };

  // Trigger Royal Incense Burning Mist physics
  const toggleIncenseSimulation = () => {
    if (!isIncenseSimulating) {
      setIsIncenseSimulating(true);
      playSymphonicChime("men");
      triggerZoneAction("المبخرة الملكية السعودية الفاخرة ورائحة العود الكمبودي");
      setTimeout(() => setIsIncenseSimulating(false), 9000);
    } else {
      setIsIncenseSimulating(false);
    }
  };

  // Handle direct image file upload by hall owner
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRealPhoto(event.target.result as string);
          setViewMode("real_photo");
          triggerZoneAction("صورتك الخاصة للقاعة الحقيقية");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle direct uploading of blueprint/floor photo for AR Overlay Mode
  const handleFloorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomFloorPhoto(event.target.result as string);
          setViewMode("ar_overlay");
          triggerZoneAction("مخطط الطابق المبتكر والدمج الـ AR");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl">
      
      {/* AI OWNER WELCOME PORTAL WIZARD OVERLAY */}
      {!hasOwnerEntered && (
        <div id="ai-owner-welcome-portal" className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-slate-950/95 p-6 md:p-8 shadow-2xl backdrop-blur-3xl transition-all duration-700 text-right animate-fade-in mb-8" dir="rtl">
          {/* Animated background glows */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-600/5 blur-[100px] animate-pulse" />
          
          {/* Top Header */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-4.5 mb-6 gap-4">
            <div className="flex items-center gap-3 justify-end">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 p-[1px] shadow-lg shadow-amber-500/25">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950">
                  <span className="text-lg animate-spin" style={{ animationDuration: "8s" }}>🔮</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9.5px] uppercase font-bold tracking-wider text-amber-500 block">بوابة مالك الصالة والذكاء الاصطناعي الأحدث</span>
                <h2 className="text-lg font-black text-white sm:text-xl mt-0.5">مرحباً بك في لوحة تحكّم مالك القاعة التفاعلية للواقع والبعد الثالث 🇸🇦</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-mono font-bold text-white/75">
                Onboarding Step {activeAIPromptStep + 1} of 3
              </span>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: AI Character Speaker wave */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/55 border border-white/10 text-center space-y-4">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" style={{ animationDuration: '3.5s' }} />
                <div className="absolute inset-2 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '10s' }} />
                <div className="relative flex h-18 w-18 items-center justify-center rounded-full bg-slate-950 border border-amber-400/30">
                  <span className="text-3xl animate-bounce" style={{ animationDuration: '2.8s' }}>🤖</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-black text-amber-400">المُنسق الهولوغرافي "جيجي"</h3>
                <p className="text-[10.5px] text-white/50 leading-relaxed max-w-xs">
                  أهلاً بك يا شريك تطورنا! أنا المساعد التوليدي لقاعتك للربط الفيزيائي اللوجستي للورود.
                </p>
              </div>

              {/* Glowing Soundwave bars */}
              <div className="flex items-center justify-center gap-1.5 h-6">
                {[6, 12, 8, 16, 10, 14, 5, 11, 7, 13, 3, 9, 4].map((h, i) => (
                  <span 
                    key={i} 
                    className="w-[2.5px] bg-gradient-to-t from-amber-500 to-amber-300 rounded-full animate-pulse"
                    style={{ 
                      height: `${h * 1.3}px`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: '0.9s'
                    }} 
                  />
                ))}
              </div>

              {/* Dynamic instruction quotes */}
              <div className="text-[10px] text-white/70 italic bg-slate-950/60 p-3 rounded-lg border border-white/5 max-w-xs leading-relaxed">
                {activeAIPromptStep === 0 && "« يُرجى التكرم بتعريف هويتك الكريمة واسم صالتك الفاخرة للبدء في تزامنات العرس الفوقية.»"}
                {activeAIPromptStep === 1 && "« الآن، يرجى رفع صورة حية وحقيقية من داخل صالة قاعتك، أو اختر أحد نماذج قصورنا السعودية لتشغيل المزاوجة.»"}
                {activeAIPromptStep === 2 && "« رائع جداً! تم حفظ الصورة وحزمة التقنيات الافتتاحية. تفضل لتشغيل التوأم الرقمي المزدوج.»"}
              </div>
            </div>

            {/* RIGHT COLUMN: Configuration Inputs */}
            <div className="lg:col-span-7 flex flex-col justify-between p-5 bg-slate-900/20 rounded-xl border border-white/5">
              
              {/* Step 1 Profile */}
              {activeAIPromptStep === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
                    <span>الخطوة 1: تسجيل هوية صاحب القاعة</span>
                    <span className="text-amber-500 text-sm">👤</span>
                  </h3>
                  <p className="text-[11px] text-white/50">
                    أدخل معلومات الهوية لتهيئة التقارير، الرسوم وجداول التوريدات الخاصة بك:
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-300">اسم صاحب القاعة أو المُمثل الرسمي:</label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="فيصل بن عبدالرحمن السديري"
                        className="w-full rounded-lg bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-300">اسم صالة الأفراح / القصر أو الفندق التابع لك:</label>
                      <input
                        type="text"
                        value={ownerHallName}
                        onChange={(e) => setOwnerHallName(e.target.value)}
                        placeholder="قصر الأميرات للمناسبات الفاخرة"
                        className="w-full rounded-lg bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => {
                        if (!ownerName.trim() || !ownerHallName.trim()) {
                          alert("الرجاء إدخال الإسم والصالة.");
                          return;
                        }
                        setActiveAIPromptStep(1);
                        playSymphonicChime("women");
                      }}
                      className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/5 hover:scale-[1.01]"
                    >
                      <span>التالي: تخصيص وتضمين الصور الحية 📸</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 Real photo upload */}
              {activeAIPromptStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
                    <span>الخطوة 2: رفع أو توفير صالة الواقع الحقيقي لقاعتك</span>
                    <span className="text-emerald-400 text-sm">📸</span>
                  </h3>
                  <p className="text-[11px] text-white/50">
                    لكي نقوم برسم عناصر الديكور، باقات الورد، وسجاد الكوبالت مباشرة ومطابقتها على قاعتك المادية، تفضل برفع صورتك الخاصة من الداخل أو تفعيل عينات القصور السعودية الكبرى:
                  </p>

                  <div className="border-2 border-dashed border-amber-500/20 bg-slate-950/70 p-5 rounded-xl text-center space-y-3.5 relative overflow-hidden">
                    <div className="text-2xl animate-pulse">📥</div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">رفع المخطط أو المنظر الواقعي لقاعتك</p>
                      <p className="text-[9.5px] text-white/40">اسحب الملف أو اضغط لاختيار صورة من هاتفك/جهازك</p>
                    </div>

                    {customRealPhoto ? (
                      <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/25 rounded-lg text-[10.5px] text-emerald-400 inline-flex items-center gap-1.5 font-bold animate-pulse">
                        <span className="text-xs">✅</span>
                        <span>تم رفع صورة قاعتك الخاصة بنجاح! جاهزة للمطابقة الذكية.</span>
                      </div>
                    ) : (
                      <label className="inline-block px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[10.5px] cursor-pointer transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handlePhotoUpload(e);
                            playSymphonicChime("women");
                          }}
                          className="hidden"
                        />
                        <span>رفع صورة القاعة الآن 📁</span>
                      </label>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 block">أو تفعيل أحد القصور السعودية المعدة مسبقاً:</label>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {currentPresets.map((pst, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedRealPresetIdx(idx);
                            setCustomRealPhoto(null);
                            playSymphonicChime("women");
                            triggerZoneAction(pst.name);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            selectedRealPresetIdx === idx && !customRealPhoto
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold"
                              : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          🏛️ {pst.name.split(" - ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => setActiveAIPromptStep(0)}
                      className="text-white/40 hover:text-white text-xs font-bold transition-all px-3 py-1"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => {
                        setActiveAIPromptStep(2);
                        playSymphonicChime("men");
                      }}
                      className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all"
                    >
                      <span>التالي: الابتكارات والمشاريع 🔮</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Innovative Features */}
              {activeAIPromptStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5 justify-end">
                    <span>الخطوة 3: تفعيل الاقتراحات والمشاريع التكنولوجية المتطورة</span>
                    <span className="text-purple-400 text-sm">🌌</span>
                  </h3>
                  <p className="text-[11px] text-white/50">
                    اختر الإضافات الهندسية الراقية والحديثة الموصى بها مسبقاً لقاعتك لزيادة تنافسية التسويق:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Switch 1 */}
                    <button
                      onClick={() => { setSmartGlassCeiling(!smartGlassCeiling); playSymphonicChime("women"); }}
                      className={`p-2 rounded-lg border text-right transition-all flex items-start gap-2 ${
                        smartGlassCeiling ? "border-amber-500/30 bg-amber-500/[0.04]" : "border-white/5 bg-slate-950/40 opacity-40"
                      }`}
                    >
                      <span className="text-sm mt-0.5">🌌</span>
                      <div>
                        <div className="text-[10.5px] font-black text-white">سقف زجاجي ذكي</div>
                        <p className="text-[9px] text-white/40 leading-tight">تعديل الإضاءة والطقس فلكياً</p>
                      </div>
                    </button>

                    {/* Switch 2 */}
                    <button
                      onClick={() => { setHolographicGround(!holographicGround); playSymphonicChime("men"); }}
                      className={`p-2 rounded-lg border text-right transition-all flex items-start gap-2 ${
                        holographicGround ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/5 bg-slate-950/40 opacity-40"
                      }`}
                    >
                      <span className="text-sm mt-0.5">✨</span>
                      <div>
                        <div className="text-[10.5px] font-black text-white">أرضية مِرآة هولوغرافية</div>
                        <p className="text-[9px] text-white/40 leading-tight">انعكاسات ضوئية حركية</p>
                      </div>
                    </button>

                    {/* Switch 3 */}
                    <button
                      onClick={() => { setScentSprinkler(!scentSprinkler); playSymphonicChime("men"); }}
                      className={`p-2 rounded-lg border text-right transition-all flex items-start gap-2 ${
                        scentSprinkler ? "border-purple-500/30 bg-purple-500/[0.04]" : "border-white/5 bg-slate-950/40 opacity-40"
                      }`}
                    >
                      <span className="text-sm mt-0.5">💨</span>
                      <div>
                        <div className="text-[10.5px] font-black text-white">رش عطر العود الذكي</div>
                        <p className="text-[9px] text-white/40 leading-tight">بث مستمر تزامناً مع الدخول</p>
                      </div>
                    </button>

                    {/* Switch 4 */}
                    <button
                      onClick={() => { setKineticChandeliers(!kineticChandeliers); playSymphonicChime("women"); }}
                      className={`p-2 rounded-lg border text-right transition-all flex items-start gap-2 ${
                        kineticChandeliers ? "border-rose-500/30 bg-rose-500/[0.04]" : "border-white/5 bg-slate-950/40 opacity-40"
                      }`}
                    >
                      <span className="text-sm mt-0.5">🔮</span>
                      <div>
                        <div className="text-[10.5px] font-black text-white">ثريات كينيتك راقصة</div>
                        <p className="text-[9px] text-white/40 leading-tight">حركة فيزيائية آلية مبهجة</p>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => setActiveAIPromptStep(1)}
                      className="text-white/40 hover:text-white text-xs font-bold transition-all px-3 py-1"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => {
                        setHasOwnerEntered(true);
                        setViewMode("dual_cinema"); // automatically switch to side-by-side mode on entrance!
                        playSymphonicChime("women");
                      }}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
                    >
                      <span>دخول وتفعيل أنظمة التزامن 🖥️🔮</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* CORE PORTAL COMPONENT VIEW (WHEN REGISTERED) */}
      {hasOwnerEntered && (
        <>
          {/* Owner & Cyber AI Sync Status Header banner */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-4 mb-6 rounded-2xl bg-slate-900 border border-amber-500/25 shadow-xl gap-4">
            <div className="flex items-center gap-3 text-right">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse text-lg shadow-md">
                🤵👑
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex flex-wrap items-center gap-2">
                  <span>أهلاً بك المالك الموقر: {ownerName}</span>
                  <span className="text-[9.5px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-extrabold">{ownerHallName}</span>
                </h4>
                <div className="text-[10px] text-white/50 mt-1 flex items-center gap-1.5 justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>لوحة التزامن المزدوج الهجينة (Cyber-Physical Mirroring Link) نشطة 🟢</span>
                </div>
              </div>
            </div>

            {/* Middle telemetry indicator */}
            <div className="hidden xl:flex items-center gap-4 text-center font-mono text-[10px] bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
              <div>
                <span className="text-white/40 block">WEATHER SYNCS</span>
                <strong className={smartGlassCeiling ? "text-amber-400" : "text-white/30"}>{smartGlassCeiling ? "ACTIVE 🌌" : "DISABLED"}</strong>
              </div>
              <span className="text-white/10">|</span>
              <div>
                <span className="text-white/40 block">HOLO FLOOR</span>
                <strong className={holographicGround ? "text-emerald-400" : "text-white/30"}>{holographicGround ? "ACTIVE ✨" : "DISABLED"}</strong>
              </div>
              <span className="text-white/10">|</span>
              <div>
                <span className="text-white/40 block">SCENT EMISSIONS</span>
                <strong className={scentSprinkler ? "text-purple-400" : "text-white/30"}>{scentSprinkler ? "ACTIVE 💨" : "DISABLED"}</strong>
              </div>
            </div>

            {/* Options back button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setHasOwnerEntered(false);
                  setActiveAIPromptStep(0);
                  playSymphonicChime("women");
                }}
                className="px-3.5 py-2 font-black text-[10px] text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl transition-all"
              >
                ⚙️ مراجعة التهيئات وقنوات الـ AI
              </button>
            </div>
          </div>
        </>
      )}

      {/* 1. Saudi Segregation Tab Selector - Dual Hall Custom */}
      <div className="flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-900/90 p-1.5 gap-1.5 mb-6">
        <button
          onClick={() => {
            setHallSection("women");
            setSelectedRealPresetIdx(0);
            setCustomRealPhoto(null);
            setIsZaffaSimulating(false);
            setIsIncenseSimulating(false);
            playSymphonicChime("women");
            triggerZoneAction("تغيير المحاكاة إلى قاعة النساء");
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-3 ${
            hallSection === "women"
              ? "bg-gradient-to-r from-pink-600 to-indigo-650 text-white shadow-lg shadow-pink-500/10 scale-[1.01]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-lg">👩‍👑</span>
          <div className="text-right">
            <div className="font-extrabold text-[12px] sm:text-[13px]">قسم النساء المترف (Ballroom Segregation)</div>
            <div className="text-[10px] text-white/50 font-normal">الممشى الحريري، الكوشة التوليدية، زفة العروس ودق الدفوف</div>
          </div>
        </button>
        <button
          onClick={() => {
            setHallSection("men");
            setSelectedRealPresetIdx(0);
            setCustomRealPhoto(null);
            setIsZaffaSimulating(false);
            setIsIncenseSimulating(false);
            playSymphonicChime("men");
            triggerZoneAction("تغيير المحاكاة إلى ديوانية الرجال");
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-3 ${
            hallSection === "men"
              ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.01]"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-lg">🧔🇸🇦</span>
          <div className="text-right text-inherit">
            <div className={`font-extrabold text-[12px] sm:text-[13px] ${hallSection === "men" ? "text-slate-950" : "text-white"}`}>قسم الرجال الشامخ (Noble Majlis Suite)</div>
            <div className={`text-[10px] font-normal ${hallSection === "men" ? "text-slate-950/70" : "text-white/50"}`}>مجلس الصدارة وكبار الشخصيات، المبخرة والعود الفاخر، دلال القهوة النجدية</div>
          </div>
        </button>
      </div>

      {/* 2. Simulation Mode Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4 p-1 bg-slate-900/60 rounded-xl border border-white/5">
        <button
          onClick={() => { setViewMode("virtual"); triggerZoneAction("العرض ثلاثي الأبعاد المخطط"); }}
          className={`py-2 px-3 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "virtual"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-sm">🔮</span>
          <span>المعاينة ثلاثية الأبعاد (3D View)</span>
        </button>

        <button
          onClick={() => { setViewMode("dual_cinema"); triggerZoneAction("البث الثنائي المزدوج المتزامن"); }}
          className={`py-2 px-3 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "dual_cinema"
              ? "bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 shadow-md shadow-emerald-500/15"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-sm">⚡</span>
          <span>البث الثنائي المتزامن (Twin Live Studio)</span>
        </button>

        <button
          onClick={() => { setViewMode("real_photo"); triggerZoneAction("الدمج والواقع الهجين"); }}
          className={`py-2 px-3 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "real_photo"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-sm">📸</span>
          <span>المطابقة الحية بالواقع (Hybrid AR-Photo)</span>
        </button>

        <button
          onClick={() => { setViewMode("ar_overlay"); triggerZoneAction("مسح الدرون الجوي ومخططات الـ AR"); }}
          className={`py-2 px-3 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewMode === "ar_overlay"
              ? "bg-gradient-to-r from-violet-600 to-amber-500 text-white shadow-md shadow-violet-500/20 scale-[1.01]"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-sm">🚁</span>
          <span>مخطط الدرون الجوي (AR Overlay)</span>
        </button>
      </div>

      {/* CSS Animations directly crafted to render stunning interactive visual properties */}
      <style>{`
        @keyframes chandeliers-hover-anim {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(16px) scaleY(1.05); }
          100% { transform: translateY(0px) scaleY(1); }
        }
        .kinetic-hover-actived {
          animation: chandeliers-hover-anim 7s infinite ease-in-out;
          transform-origin: top center;
        }

        @keyframes holo-glow-oscillation {
          0% {
            filter: drop-shadow(0 0 5px ${flower1Color}90) drop-shadow(0 0 10px ${flower1Color}40) hue-rotate(0deg) brightness(1);
            opacity: 0.85;
          }
          33% {
            filter: drop-shadow(0 0 18px ${flower1Color}ff) drop-shadow(0 0 35px ${flower2Color}bb) drop-shadow(0 0 55px ${suggestedLighting.spotlightHex}aa) hue-rotate(15deg) brightness(1.45);
            transform: scale(1.004) skewX(0.1deg);
            opacity: 1;
          }
          66% {
            filter: drop-shadow(0 0 12px ${flower2Color}cc) drop-shadow(0 0 25px ${suggestedLighting.ambientHex}dd) hue-rotate(-15deg) brightness(1.25);
            opacity: 0.95;
          }
          100% {
            filter: drop-shadow(0 0 5px ${flower1Color}90) drop-shadow(0 0 10px ${flower1Color}40) hue-rotate(0deg) brightness(1);
            opacity: 0.85;
          }
        }

        @keyframes catwalk-glow-flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            filter: drop-shadow(0 0 8px ${suggestedLighting.spotlightHex}c0) drop-shadow(0 0 20px ${flower2Color}50) brightness(1);
            opacity: 0.9;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            filter: drop-shadow(0 0 30px ${suggestedLighting.spotlightHex}ff) drop-shadow(0 0 45px ${flower1Color}aa) drop-shadow(0 0 6px #fffa) brightness(1.75);
            opacity: 1;
            transform: scaleY(1.002);
          }
        }

        @keyframes scanning-sweep {
          0% { transform: translateY(-30%); opacity: 0.08; }
          50% { transform: translateY(330%); opacity: 0.75; }
          100% { transform: translateY(-30%); opacity: 0.08; }
        }

        @keyframes real_float_petal {
          0% {
            transform: translateY(120%) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20%) translateX(45px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes zaffa-hologram-walk {
          0% { transform: translate(400px, 460px) scale(1.6); opacity: 0; }
          10% { opacity: 0.95; filter: drop-shadow(0 0 15px gold) brightness(2.2); }
          50% { filter: drop-shadow(0 0 22px ${flower1Color}) brightness(2); }
          90% { opacity: 0.95; }
          100% { transform: translate(400px, 240px) scale(0.6); opacity: 0; }
        }

        @keyframes smoke-curls-1 {
          0% { transform: translate(250px, 350px) scale(0.5) rotate(0deg); opacity: 0; }
          10% { opacity: 0.55; }
          50% { transform: translate(265px, 260px) scale(1.1) rotate(20deg); opacity: 0.35; }
          100% { transform: translate(240px, 110px) scale(1.8) rotate(-40deg); opacity: 0; }
        }

        @keyframes smoke-curls-2 {
          0% { transform: translate(550px, 350px) scale(0.5) rotate(0deg); opacity: 0; }
          12% { opacity: 0.55; }
          50% { transform: translate(535px, 255px) scale(1.2) rotate(-25deg); opacity: 0.4; }
          100% { transform: translate(560px, 105px) scale(1.9) rotate(35deg); opacity: 0; }
        }

        .holo-grow-kosha {
          animation: holo-glow-oscillation 3.2s infinite ease-in-out;
        }

        .holo-grow-catwalk {
          animation: catwalk-glow-flicker 4s infinite ease-in-out;
        }

        .holo-scanning-line-custom {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, ${suggestedLighting.spotlightHex}, #ffffff, ${suggestedLighting.spotlightHex}, transparent);
          box-shadow: 0 0 15px ${suggestedLighting.spotlightHex};
          animation: scanning-sweep 6s infinite linear;
          pointer-events: none;
          z-index: 10;
        }

        .zaffa-simulation-node {
          animation: zaffa-hologram-walk 10s infinite linear;
        }

        .smoke-node-left {
          animation: smoke-curls-1 7s infinite ease-out;
        }

        .smoke-node-right {
          animation: smoke-curls-2 7.5s infinite ease-out;
        }

        @keyframes holographic-glow-pulse {
          0%, 100% {
            stroke: #f59e0b;
            filter: saturate(1.3) sepia(0.04) brightness(1.05) drop-shadow(0 0 6px rgba(245, 158, 11, 0.45));
          }
          50% {
            stroke: #fbbf24;
            filter: saturate(1.5) sepia(0) brightness(1.35) drop-shadow(0 0 18px rgba(245, 158, 11, 0.95));
          }
        }

        #gentlemens-presidium {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #gentlemens-presidium #presidium-backdrop-pattern {
          transition: fill 1s ease-in-out, stroke 1s ease-in-out, filter 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1);
          animation: holographic-glow-pulse 4s infinite ease-in-out;
        }

        #gentlemens-presidium .backdrop-pattern-sadu {
          opacity: 0.98;
        }

        #gentlemens-presidium .backdrop-pattern-minimalist {
          opacity: 0.35;
        }
      `}</style>

      {/* 3. VIRTUAL 3D SCENE VIEW & DUAL LIVE STUDIO ENGINE */}
      <div className={viewMode === "dual_cinema" ? "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start" : "w-full"}>
        {(viewMode === "virtual" || viewMode === "dual_cinema") && (
          <div className={viewMode === "dual_cinema" ? "rounded-2xl border border-amber-500/15 bg-slate-950/70 p-4 shadow-xl" : "w-full"}>
            {viewMode === "dual_cinema" && (
              <h4 className="text-[10px] font-mono text-amber-400 font-extrabold mb-4 border-b border-white/5 pb-2 text-right flex items-center justify-between">
                <span>📈 البث الأول: المخطط المعماري ثلاثي الأبعاد CAD 3D</span>
                <span className="bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px]">متزامن حياً</span>
              </h4>
            )}
            {/* 3D Controls and View Options */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500">
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-emerald-500/30"></span>
              </span>
              <span className="font-mono text-xs text-amber-400 font-extrabold uppercase">
                GIGI-VIRTUAL 3D V4.5 • {hallSection === "women" ? "قائمة النساء" : "ديوانية الرجال"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Optional audio indicator trigger */}
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-1 px-2.5 rounded-md bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 text-xs flex items-center gap-1 transition-all"
                title="تأثيرات صوتية مصاحبة للواقع"
              >
                {isAudioMuted ? <VolumeX className="h-3 w-3 text-rose-450 animate-pulse" /> : <Volume2 className="h-3 w-3 text-amber-400" />}
                <span className="text-[10px] hidden sm:inline">أصوات الضيافة والزفة</span>
              </button>

              {/* Angle Selectors */}
              <div className="flex rounded-md bg-white/5 p-1 border border-white/10">
                <button
                  onClick={() => { setCameraAngle("front"); triggerZoneAction("بإتجاه الكاميرا الأمامية"); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-200 ${cameraAngle === "front" ? "bg-amber-500 text-slate-950" : "text-white/70 hover:text-white"}`}
                >
                  صدارة مواجهة
                </button>
                <button
                  onClick={() => { setCameraAngle("elevated"); triggerZoneAction("بإتجاه المنظور العلوي المفتوح"); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-200 ${cameraAngle === "elevated" ? "bg-amber-500 text-slate-950" : "text-white/70 hover:text-white"}`}
                >
                  منظور علوي شاهق
                </button>
                <button
                  onClick={() => { setCameraAngle("side"); triggerZoneAction("بإتجاه الكاميرا الجانبية للقاعة"); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-200 ${cameraAngle === "side" ? "bg-amber-500 text-slate-950" : "text-white/70 hover:text-white"}`}
                >
                  زاوية حركية جانبية
                </button>
              </div>

              {/* Wireframe Toggle */}
              <button
                onClick={() => setWireframeMode(!wireframeMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border transition-all duration-200 ${wireframeMode ? "border-amber-500 bg-amber-500/10 text-amber-400" : "border-white/10 text-white/60 hover:text-white bg-white/5"}`}
              >
                <Layers className="h-3 w-3" />
                <span className="hidden sm:inline">{wireframeMode ? "مخطط الهياكل CAD" : "المعاينة الواقعية للظل"}</span>
              </button>

              {/* Fog Toggle */}
              <button
                onClick={() => setNitrogenFog(!nitrogenFog)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border transition-all duration-200 ${nitrogenFog ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" : "border-white/10 text-white/60 hover:text-white bg-white/5"}`}
              >
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">أبخرة النيتروجين</span>
              </button>
            </div>
          </div>

          {/* Canvas Viewport Frame */}
          <div 
            className="relative w-full bg-slate-950/95 rounded-2xl overflow-hidden shadow-inner border border-white/5 transition-all duration-1000"
            style={{ 
              height: "440px",
              boxShadow: isZaffaSimulating ? "0 0 25px rgba(245, 158, 11, 0.15) inset" : "none"
            }}
          >
            {/* Holographic lasers and scanning bars */}
            {!wireframeMode && <div className="holo-scanning-line-custom" />}

            {/* Dynamic Ambient Color Wash based on user choices and TOD settings */}
            <div 
              className="absolute inset-0 transition-all duration-1000 ease-out" 
              style={{ 
                background: wireframeMode 
                  ? "radial-gradient(circle at center, rgb(15, 23, 42) 0%, rgb(2, 6, 23) 100%)" 
                  : todMood === "dawn"
                    ? `radial-gradient(circle at 50% 25%, ${suggestedLighting.ambientHex}30 0%, #030712 100%)`
                    : todMood === "dusk"
                      ? `radial-gradient(circle at 50% 25%, #7c2d1230 0%, #030712 100%)`
                      : `radial-gradient(circle at 50% 20%, ${suggestedLighting.ambientHex}40 0%, rgb(1, 2, 8) 100%)`
              }}
            />

            {/* Grid structure overlay */}
            {wireframeMode && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:25px_25px]" />
            )}

            {/* Animated 3D projection wrapper */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out"
              style={{
                transform: cameraAngle === "elevated" 
                  ? "scale(0.96) translateY(24px) rotateX(16deg)" 
                  : cameraAngle === "side" 
                    ? "scale(0.92) translateX(-25px) rotateY(-12deg) rotateX(6deg)"
                    : "scale(1)"
              }}
            >
              <svg 
                viewBox="0 0 800 500" 
                className="w-full h-full select-none"
                style={{ perspective: "1000px" }}
              >
                <defs>
                  {/* Glowing patterns, lighting beams, glass textures */}
                  <radialGradient id="luxuriousWarmGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={floorLayout.lightingColor} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={floorLayout.lightingColor} stopOpacity="0" />
                  </radialGradient>
                  
                  <radialGradient id="ambientGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={suggestedLighting.ambientHex} stopOpacity="0.65" />
                    <stop offset="100%" stopColor={suggestedLighting.ambientHex} stopOpacity="0" />
                  </radialGradient>
                  
                  <linearGradient id="spotlightBeamPath" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={suggestedLighting.spotlightHex} stopOpacity="0.45" />
                    <stop offset="50%" stopColor={suggestedLighting.spotlightHex} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={suggestedLighting.spotlightHex} stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="catwalkGlassTexture" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0B0F19" stopOpacity="0.98" />
                  </linearGradient>

                  {/* Saudi Heritage Council carpets pattern */}
                  <pattern id="saudiSaduPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill="#7f1d1d" opacity="0.30" />
                    <path d="M 0 20 L 40 20 M 20 0 L 20 40 M 10 10 L 30 30 M 30 10 L 10 30" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
                    <circle cx="20" cy="20" r="4" fill="#fbbf24" opacity="0.6" />
                  </pattern>
                </defs>

                {/* Smart Glass Ceiling Celestial stars if active */}
                {smartGlassCeiling && !wireframeMode && (
                  <g id="glass-ceiling-stars" className="opacity-70 animate-pulse">
                    <circle cx="150" cy="30" r="1.5" fill="#fff" />
                    <circle cx="280" cy="50" r="1.2" fill="#fff" />
                    <circle cx="350" cy="20" r="1.8" fill="#fff" className="animate-ping" style={{ animationDuration: '4s' }} />
                    <circle cx="480" cy="40" r="1" fill="#fff" />
                    <circle cx="580" cy="25" r="1.5" fill="#fff" />
                    <circle cx="680" cy="45" r="1.2" fill="#fff" />
                  </g>
                )}

                {/* Draw general lighting washes */}
                {!wireframeMode && (
                  <circle cx="400" cy="180" r="320" fill="url(#ambientGlowGrad)" />
                )}

                {/* Royal Chandelier Elements */}
                <g id="chandeliers" className={`opacity-90 transition-all duration-300 ${kineticChandeliers ? "kinetic-hover-actived" : ""}`}>
                  <line x1="200" y1="0" x2="200" y2="45" stroke="#64748B" strokeWidth="2.5" />
                  <circle cx="200" cy="50" r="14" fill={suggestedLighting.spotlightHex} filter="drop-shadow(0 0 10px gold)" className="animate-pulse" />
                  
                  <line x1="400" y1="0" x2="400" y2="35" stroke="#64748B" strokeWidth="2.5" />
                  <circle cx="400" cy="40" r="18" fill="#FCD34D" filter="drop-shadow(0 0 14px gold)" />

                  <line x1="600" y1="0" x2="600" y2="45" stroke="#64748B" strokeWidth="2.5" />
                  <circle cx="600" cy="50" r="14" fill={suggestedLighting.spotlightHex} filter="drop-shadow(0 0 10px gold)" className="animate-pulse" />
                </g>

                {/* Perspective lines mapping */}
                <path d="M 50 450 L 250 220 L 550 220 L 750 450" fill="none" stroke={wireframeMode ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.06)"} strokeWidth="1" />

                {/* Segregation Layout variations inside 3D Schematic */}
                {hallSection === "women" ? (
                  /* === WOMEN'S SECTION 3D: FOCUS ON BRIDEWALK, KOSHA, HEAVY ARRANGEMENTS === */
                  <g id="women-3d-scene">
                    {/* WALL FLANKINGS */}
                    {!wireframeMode && (
                      <g id="women-wall-decor" className="opacity-40">
                        <polygon points="0,0 180,180 180,330 0,500" fill="#04020f" />
                        <polygon points="800,0 620,180 620,330 800,500" fill="#04020f" />
                        <line x1="90" y1="90" x2="90" y2="410" stroke={flower1Color} strokeOpacity="0.15" strokeWidth="3" />
                        <line x1="710" y1="90" x2="710" y2="410" stroke={flower1Color} strokeOpacity="0.15" strokeWidth="3" />
                      </g>
                    )}

                    {/* BRIDAL KOSHA - THE ABSOLUTE FOCUS OF LADIES BALLROOM */}
                    <g 
                      id="queens-throne"
                      className="cursor-pointer group holo-grow-kosha"
                      onClick={() => {
                        const nextKoshas: KoshaStyle[] = ["RoseWall", "CrystalHarp", "GardenArch", "ModernGold"];
                        const nextStyle = nextKoshas[(nextKoshas.indexOf(floorLayout.koshaBackground) + 1) % nextKoshas.length];
                        onUpdateLayout(prev => ({ ...prev, koshaBackground: nextStyle }));
                        triggerZoneAction(`مسرح الكوشة النسائي: ${nextStyle}`);
                      }}
                    >
                      {/* Throne platform pedestal */}
                      <polygon points="210,235 590,235 610,190 190,190" fill={wireframeMode ? "none" : "#13091e"} stroke="#fbcfe8" strokeWidth="1.5" />
                      
                      {/* Kosha Designs mapping */}
                      {floorLayout.koshaBackground === "RoseWall" && (
                        <g>
                          <rect x="240" y="75" width="320" height="115" rx="8" fill={wireframeMode ? "none" : "#22082b"} stroke={flower1Color} strokeWidth="2.5" />
                          {!wireframeMode && (
                            <g opacity="0.95">
                              {/* Renders flower bouquet dots representing premium rose walls */}
                              {Array.from({ length: 50 }).map((_, i) => {
                                const row = Math.floor(i / 10);
                                const col = i % 10;
                                const x = 255 + col * 32 + (row % 2 === 0 ? 8 : 0);
                                const y = 85 + row * 21;
                                const flowerChoiceColor = i % 3 === 0 ? flower1Color : i % 3 === 1 ? flower2Color : flower3Color;
                                return (
                                  <circle key={i} cx={x} cy={y} r="5" fill={flowerChoiceColor} className="animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
                                );
                              })}
                            </g>
                          )}
                          {/* Crown floral arch overlay over the throne */}
                          <path d="M 280 190 C 280 60, 520 60, 520 190" fill="none" stroke="#fbcfe8" strokeWidth="3" strokeDasharray="5,3" />
                        </g>
                      )}

                      {floorLayout.koshaBackground === "CrystalHarp" && (
                        <g>
                          <path d="M 220 190 C 220 50, 580 50, 580 190" fill="none" stroke={wireframeMode ? "gold" : "#cbd5e1"} strokeWidth="4" />
                          {Array.from({ length: 16 }).map((_, i) => {
                            const x = 240 + i * 21;
                            const h = 190 - (100 * Math.sin((i / 15) * Math.PI));
                            return (
                              <line key={i} x1={x} y1="190" x2={x} y2={h} stroke={suggestedLighting.spotlightHex} strokeWidth="1.5" strokeDasharray="3,5" opacity="0.75" />
                            );
                          })}
                          <rect x="340" y="150" width="120" height="40" rx="4" fill="#ffffff15" stroke="#ffffffaa" strokeWidth="1" />
                        </g>
                      )}

                      {floorLayout.koshaBackground === "GardenArch" && (
                        <g>
                          <path d="M 230 190 Q 400 20 570 190" fill="none" stroke={flower1Color} strokeWidth="10" />
                          <path d="M 245 190 Q 400 35 555 190" fill="none" stroke={flower2Color} strokeWidth="6" />
                          <rect x="350" y="155" width="100" height="35" rx="10" fill="#312e81" stroke="#fbcfe8" strokeWidth="1.5" />
                        </g>
                      )}

                      {floorLayout.koshaBackground === "ModernGold" && (
                        <g>
                          <polygon points="230,190 280,50 340,190" fill={wireframeMode ? "none" : "#fbbf2410"} stroke="#fbbf24" strokeWidth="3.5" />
                          <polygon points="570,190 520,50 460,190" fill={wireframeMode ? "none" : "#fbbf2410"} stroke="#fbbf24" strokeWidth="3.5" />
                          <polygon points="310,190 400,30 490,190" fill={wireframeMode ? "none" : "#fbbf2418"} stroke="#f59e0b" strokeWidth="4.0" />
                          <rect x="330" y="150" width="140" height="40" rx="8" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2.5" />
                        </g>
                      )}
                    </g>

                    {/* CATWALK RUNWAY - FOR THE WOMAN'S ENTRANCE (الممشى الزجاجي اللامع) */}
                    <g 
                      id="ladies-runway" 
                      className="cursor-pointer group holo-grow-catwalk"
                      title="خصائص ممر العروس"
                      onClick={() => {
                        const len = floorLayout.catwalkLength >= 22 ? 10 : floorLayout.catwalkLength + 2;
                        onUpdateLayout(prev => ({ ...prev, catwalkLength: len }));
                        triggerZoneAction(`ممر العروس الزجاجي: طول ${len}م`);
                      }}
                    >
                      <polygon points="360,235 440,235 520,470 280,470" fill={wireframeMode ? "none" : "url(#catwalkGlassTexture)"} stroke={suggestedLighting.spotlightHex} strokeWidth="4" />
                      {holographicGround && (
                        <polygon points="360,235 440,235 520,470 280,470" fill="none" stroke="rgba(245, 158, 11, 0.45)" strokeWidth="8" strokeDasharray="8,4" className="animate-pulse" style={{ mixBlendMode: 'screen' }} />
                      )}
                      {!wireframeMode && (
                        <>
                          <line x1="360" y1="235" x2="280" y2="470" stroke="#fbcfe8" strokeWidth="3.5" className="animate-pulse" />
                          <line x1="440" y1="235" x2="520" y2="470" stroke="#fbcfe8" strokeWidth="3.5" className="animate-pulse" />
                          {/* Little sparkles on glass floor */}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <circle key={i} cx="340" cy={260 + i * 36} r="2" fill="#fff" className="animate-ping" style={{ animationDelay: `${i * 300}ms` }} />
                          ))}
                        </>
                      )}

                      {/* Pillars with dense fresh flowers flanking the bride's walk */}
                      <g opacity="0.95">
                        {/* Pillars group */}
                        <circle cx="342" cy="240" r="12" fill={flower1Color} />
                        <circle cx="342" cy="240" r="7" fill={flower2Color} />
                        <circle cx="458" cy="240" r="12" fill={flower1Color} />
                        <circle cx="458" cy="240" r="7" fill={flower2Color} />

                        <circle cx="310" cy="320" r="18" fill={flower2Color} />
                        <circle cx="310" cy="320" r="10" fill={flower3Color} />
                        <circle cx="490" cy="320" r="18" fill={flower2Color} />
                        <circle cx="490" cy="320" r="10" fill={flower3Color} />

                        <circle cx="250" cy="410" r="24" fill={flower1Color} />
                        <circle cx="250" cy="410" r="15" fill={flower3Color} />
                        <circle cx="550" cy="410" r="24" fill={flower1Color} />
                        <circle cx="550" cy="410" r="15" fill={flower3Color} />
                      </g>

                      {/* Giant Flower Arch at the start of catwalk */}
                      {floorLayout.hasFlowerArch && (
                        <g className="holo-grow-kosha">
                          <path d="M 170 470 A 240 240 0 0 1 630 470" fill="none" stroke={flower1Color} strokeWidth="10" strokeDasharray="15,10" />
                          <path d="M 185 470 A 225 225 0 0 1 615 470" fill="none" stroke={flower2Color} strokeWidth="6" strokeDasharray="10,15" />
                        </g>
                      )}
                    </g>

                    {/* Simulated Bride Hologram Slow Walking */}
                    {isZaffaSimulating && (
                      <g className="zaffa-simulation-node pointer-events-none">
                        {/* Soft ambient golden light cone focusing the bride */}
                        <ellipse cx="0" cy="0" rx="35" ry="12" fill="url(#luxuriousWarmGlow)" transform="translate(0, 10)" opacity="0.65" />
                        {/* Holographic Bride representation */}
                        <circle cx="0" cy="-22" r="11" fill="#fff" filter="drop-shadow(0 0 10px gold)" />
                        <path d="M -9 15 L 9 15 L 6 -10 L -6 -10 Z" fill="rgba(255,255,255,0.85)" stroke="#fbbf24" strokeWidth="1" />
                        {/* Glowing bridal veil trailing */}
                        <path d="M -5 -18 L 5 -18 L 12 18 L -12 18 Z" fill="rgba(244,114,182,0.3)" opacity="0.8" />
                        <Sparkles className="h-4 w-4 text-amber-300 inline-block" />
                      </g>
                    )}

                    {/* LADIES TABLES */}
                    <g id="ladies-tables">
                      {/* Left Table Group */}
                      <ellipse cx="120" cy="370" rx="42" ry="20" fill={wireframeMode ? "none" : "#190826"} stroke="#ffffff15" strokeWidth="1.5" />
                      <ellipse cx="120" cy="365" rx="14" ry="7" fill={flower1Color} />
                      <circle cx="120" cy="358" r="8" fill={flower2Color} />
                      {/* Rotate chairs */}
                      <circle cx="70" cy="370" r="5" fill="#311c47" />
                      <circle cx="170" cy="370" r="5" fill="#311c47" />
                      <circle cx="120" cy="345" r="5" fill="#311c47" />
                      <circle cx="120" cy="395" r="5" fill="#311c47" />

                      {/* Right Table Group */}
                      <ellipse cx="680" cy="370" rx="42" ry="20" fill={wireframeMode ? "none" : "#190826"} stroke="#ffffff15" strokeWidth="1.5" />
                      <ellipse cx="680" cy="365" rx="14" ry="7" fill={flower1Color} />
                      <circle cx="680" cy="358" r="8" fill={flower2Color} />
                      <circle cx="630" cy="370" r="5" fill="#311c47" />
                      <circle cx="730" cy="370" r="5" fill="#311c47" />
                    </g>
                  </g>
                ) : (
                  /* === MEN'S SECTION 3D: FOCUS ON COOPER CENSER, DIGNITARY SEATS, HOSPITALITY DALLAH === */
                  <g id="men-3d-scene">
                    {/* SADU PATTERNED EMBELLISHED FLOORS FOR ARABIC ROYAL COUNCIL */}
                    {!wireframeMode && (
                      <polygon points="50,450 250,220 550,220 750,450" fill="url(#saudiSaduPattern)" opacity="0.65" />
                    )}

                    {/* SPECIAL VIP GENTLEMAN PRESIDIUM / DIWANIA CHEF DAIS (مجلس الصدارة وكبار الشخصيات) */}
                    <g 
                      id="gentlemens-presidium"
                      className="cursor-pointer group holo-grow-kosha"
                      onClick={() => {
                        const nextKoshas: KoshaStyle[] = ["ModernGold", "CrystalHarp", "RoseWall"];
                        const nextStyle = nextKoshas[(nextKoshas.indexOf(floorLayout.koshaBackground) + 1) % nextKoshas.length];
                        onUpdateLayout(prev => ({ ...prev, koshaBackground: nextStyle }));
                        triggerZoneAction(`منطقة صدارة الرجال: ${nextStyle}`);
                      }}
                    >
                      {/* Deep backing cover to ensure high-contrast and cultural elegance */}
                      <rect x="230" y="80" width="340" height="110" fill={wireframeMode ? "none" : "#130b0e"} rx="4" />
                      
                      {/* Sadu/Minimalist Backdrop Pattern undergoing transition via CSS Filters */}
                      <rect 
                        id="presidium-backdrop-pattern"
                        className={menBackdropPattern === "sadu" ? "backdrop-pattern-sadu" : "backdrop-pattern-minimalist"}
                        x="230" y="80" width="340" height="110" 
                        fill={wireframeMode ? "none" : "url(#saudiSaduPattern)"} 
                        stroke="#f59e0b" 
                        strokeWidth="2" 
                        rx="4"
                      />
                      {/* Draw royal crest emblem */}
                      <circle cx="400" cy="115" r="22" fill="#2d0f14" stroke="#fbbf24" strokeWidth="1.5" />
                      <text x="400" y="119" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="black">KSA</text>
                      
                      {/* Prestigious low wooden/brass coffee benches */}
                      <rect x="270" y="150" width="260" height="40" rx="2" fill="#451a03" stroke="#d97706" strokeWidth="2" />
                      {/* Little decorative pillows */}
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <rect key={idx} x={285 + idx * 40} y="155" width="22" height="15" rx="1.5" fill="#991b1b" stroke="#fbbf24" strokeWidth="1" />
                      ))}
                    </g>

                    {/* DIGNITARY ENTRANCE CORRIDOR & VIP GREETER ARENA (ممر استقبال الشيوخ) */}
                    <g 
                      id="men-greeter-corridor"
                      className="cursor-pointer group"
                      onClick={() => {
                        const len = floorLayout.catwalkLength >= 22 ? 10 : floorLayout.catwalkLength + 2;
                        onUpdateLayout(prev => ({ ...prev, catwalkLength: len }));
                        triggerZoneAction(`ممر كبار الضيوف: الطول ${len}م`);
                      }}
                    >
                      {/* Greeting carpet trajectory */}
                      <polygon points="370,235 430,235 500,470 300,470" fill={wireframeMode ? "none" : "#7f1d1d"} stroke="#fbbf24" strokeWidth="3" />
                      
                      {/* Golden Welcoming Pillars Flanking with Palm Fronds/White Roses */}
                      <g opacity="0.95">
                        <line x1="370" y1="235" x2="300" y2="470" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />
                        <line x1="430" y1="235" x2="500" y2="470" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,4" />

                        {/* Traditional flower arrangements (Palm leaves + yellow/white roses) */}
                        <circle cx="345" cy="240" r="10" fill="#FBBF24" />
                        <line x1="345" y1="240" x2="335" y2="230" stroke="#059669" strokeWidth="2.5" />
                        <circle cx="455" cy="240" r="10" fill="#FBBF24" />
                        <line x1="455" y1="240" x2="465" y2="230" stroke="#059669" strokeWidth="2.5" />

                        <circle cx="316" cy="320" r="14" fill="#FFFFFF" />
                        <circle cx="316" cy="320" r="8" fill="#FBBF24" />
                        <line x1="316" y1="320" x2="300" y2="305" stroke="#F59E0B" strokeWidth="4" />
                        
                        <circle cx="484" cy="320" r="14" fill="#FFFFFF" />
                        <circle cx="484" cy="320" r="8" fill="#FBBF24" />
                        <line x1="484" y1="320" x2="500" y2="305" stroke="#F59E0B" strokeWidth="4" />

                        <circle cx="265" cy="410" r="20" fill="#FFFFFF" />
                        <circle cx="265" cy="410" r="11" fill="#FBBF24" />
                        <line x1="265" y1="410" x2="240" y2="390" stroke="#B45309" strokeWidth="5.5" />
                        
                        <circle cx="535" cy="410" r="20" fill="#FFFFFF" />
                        <circle cx="535" cy="410" r="11" fill="#FBBF24" />
                        <line x1="535" y1="410" x2="560" y2="390" stroke="#B45309" strokeWidth="5.5" />
                      </g>
                    </g>

                    {/* TWO INTERACTIVE ROYAL BRASS MIST INCENSE CENSERS (المبخرة الملكية للعود الأزرق) */}
                    <g 
                      id="royal-scent-censer"
                      className="cursor-pointer"
                      onClick={toggleIncenseSimulation}
                    >
                      {/* Left Side Censer */}
                      <path d="M 235 375 L 265 375 L 260 350 L 240 350 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                      <ellipse cx="250" cy="350" rx="10" ry="4" fill="#78350f" stroke="#fbbf24" />
                      <line x1="250" y1="350" x2="250" y2="338" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="250" cy="336" r="3" fill="#ef4444" className="animate-pulse" />

                      {/* Right Side Censer */}
                      <path d="M 535 375 L 565 375 L 560 350 L 540 350 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
                      <ellipse cx="550" cy="350" rx="10" ry="4" fill="#78350f" stroke="#fbbf24" />
                      <line x1="550" y1="350" x2="550" y2="338" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="550" cy="336" r="3" fill="#ef4444" className="animate-pulse" />
                    </g>

                    {/* Active Aromatic Clouds Rising (حلقات العود المتصاعدة) */}
                    {isIncenseSimulating && (
                      <g className="pointer-events-none">
                        {/* Smoke vectors for censer 1 */}
                        <path d="M 250 330 Q 240 280 265 220 Q 290 160 250 100" fill="none" stroke="rgba(200, 200, 220, 0.45)" strokeWidth="3" strokeDasharray="5,5" className="smoke-node-left" />
                        <ellipse cx="250" cy="330" rx="12" ry="5" fill="rgba(255,255,255,0.2)" className="smoke-node-left font-sans text-[8px] color-grey" />
                        
                        {/* Smoke vectors for censer 2 */}
                        <path d="M 550 330 Q 560 280 535 220 Q 510 160 550 100" fill="none" stroke="rgba(200, 200, 220, 0.45)" strokeWidth="3" strokeDasharray="5,5" className="smoke-node-right" />
                      </g>
                    )}

                    {/* NOBLE MEN'S SERVICE GUEST TABLES (طاولات مجهزة بالدلة الكريمة والفناجين) */}
                    <g id="mens-dallah-tables">
                      {/* Left table with coffee pots drawn */}
                      <ellipse cx="120" cy="370" rx="42" ry="20" fill={wireframeMode ? "none" : "#451a03"} stroke="#ffffff15" strokeWidth="1.5" />
                      {!wireframeMode && (
                        <g>
                          {/* Traditional Arab Coffee Pot: Dallah (الدلة النجدية النحاسية) */}
                          <path d="M 115 365 L 125 365 L 123 350 L 117 350 Z" fill="#fbbf24" stroke="#d97706" />
                          <path d="M 117 350 L 123 350 L 120 342 Z" fill="#fbbf24" />
                          <path d="M 115 358 Q 108 354 113 350" fill="none" stroke="#fbbf24" strokeWidth="1.5" /> {/* handle */}
                          {/* Cardamom cups */}
                          <circle cx="130" cy="365" r="3" fill="#FFF" />
                          <circle cx="108" cy="365" r="3" fill="#FFF" />
                        </g>
                      )}

                      {/* Right table with coffee pots drawn */}
                      <ellipse cx="680" cy="370" rx="42" ry="20" fill={wireframeMode ? "none" : "#451a03"} stroke="#ffffff15" strokeWidth="1.5" />
                      {!wireframeMode && (
                        <g>
                          <path d="M 675 365 L 685 365 L 683 350 L 677 350 Z" fill="#fbbf24" stroke="#d97706" />
                          <path d="M 677 350 L 683 350 L 680 342 Z" fill="#fbbf24" />
                          <path d="M 675 358 Q 668 354 673 350" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                          <circle cx="690" cy="365" r="3" fill="#FFF" />
                          <circle cx="668" cy="365" r="3" fill="#FFF" />
                        </g>
                      )}
                    </g>
                  </g>
                )}

                {/* Spotlights cone projections */}
                {!wireframeMode && (
                  <g id="spotlight-layer" opacity={suggestedLighting.intensity / 100}>
                    <polygon points="120,0 240,430 380,450 160,0" fill="url(#spotlightBeamPath)" />
                    <polygon points="680,0 560,430 420,450 640,0" fill="url(#spotlightBeamPath)" />
                    {/* VIP center highlight */}
                    <ellipse cx="400" cy="340" rx="140" ry="38" fill="url(#luxuriousWarmGlow)" opacity="0.32" />
                  </g>
                )}

                {/* Dynamic Fog clouds */}
                {!wireframeMode && nitrogenFog && (
                  <g id="fog-cloud" opacity="0.3">
                    <ellipse cx="140" cy="460" rx="130" ry="30" fill="#fff" className="animate-pulse" style={{ animationDuration: "6s" }} />
                    <ellipse cx="380" cy="470" rx="180" ry="24" fill="#cbd5e1" className="animate-pulse" style={{ animationDuration: "8s" }} />
                    <ellipse cx="660" cy="460" rx="140" ry="30" fill="#fff" className="animate-pulse" style={{ animationDuration: "5s" }} />
                  </g>
                )}
              </svg>
            </div>

            {/* Floating HUD Information parameters */}
            <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-slate-950/95 border border-white/10 font-mono text-[10px] space-y-1.5 text-white/85 select-none backdrop-blur-md max-w-[210px] text-right">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 text-amber-400 justify-end">
                <span className="font-bold">المعطيات والحسابات ثلاثية الأبعاد</span>
                <Eye className="h-3.5 w-3.5" />
              </div>
              <div>قسم الصالة: <strong className="text-white">{hallSection === "women" ? "النساء والزفة" : "الرجال والضيافة"}</strong></div>
              <div>النمط المعماري: <span className="text-blue-400 font-semibold">{floorLayout.koshaBackground}</span></div>
              <div>المسافة الإجمالية: <span className="text-emerald-400 font-semibold">{floorLayout.catwalkLength} متر</span></div>
              <div>كثافة زينة الطاولات: <span className="text-pink-400 font-semibold">
                {floorLayout.flowerDensity === "royal" ? "ملكية 100%" : floorLayout.flowerDensity === "dense" ? "غزيرة 80%" : "معتدلة 50%"}
              </span></div>
              <div>قوة الضوء المسقط: <span className="text-amber-300 font-semibold">{suggestedLighting.intensity}%</span></div>
            </div>

            {/* Flower specifications legend overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3.5 py-2 rounded-full bg-slate-900/95 border border-white/10 text-[10px] text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: flower1Color }} />
                جوري رئيسي
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: flower2Color }} />
                ياسمين وثانوي
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: flower3Color }} />
                سعف / أوكالبتوس
              </span>
            </div>

            {/* Trigger Simulation Controls (Floating Action Overlay) */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              {hallSection === "women" ? (
                <button
                  onClick={toggleZaffaSimulation}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1.5 ${
                    isZaffaSimulating
                      ? "bg-amber-500 border-amber-400 text-slate-950 animate-pulse"
                      : "bg-indigo-600/30 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/40"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isZaffaSimulating ? "🛑 إيقاف الزفة التفاعلية" : "👰 بدء محاكاة زفة العروس"}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleIncenseSimulation}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1.5 ${
                      isIncenseSimulating
                        ? "bg-amber-500 border-amber-400 text-slate-950 animate-pulse"
                        : "bg-red-900/30 border-red-700/50 text-amber-400 hover:bg-red-900/40"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{isIncenseSimulating ? "🛑 إيقاف البخور" : "💨 أطلق بخور العود الأزرق"}</span>
                  </button>

                  <button
                    id="toggle-backdrop-pattern-btn"
                    onClick={() => {
                      const next = menBackdropPattern === "sadu" ? "minimalist" : "sadu";
                      setMenBackdropPattern(next);
                      triggerZoneAction(next === "sadu" ? "نمط السدو التراثي في الصدارة" : "النمط البسيط الحديث في الصدارة");
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1.5 ${
                      menBackdropPattern === "sadu"
                        ? "bg-yellow-600/30 border-yellow-500/50 text-amber-300 hover:bg-yellow-600/40"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/60"
                    }`}
                  >
                    <Sliders className="h-3 w-3 text-amber-400" />
                    <span>{menBackdropPattern === "sadu" ? "🏛️ نمط الصدارة: سدو تراثي" : "✨ نمط الصدارة: بسيط حديث"}</span>
                  </button>
                </>
              )}
            </div>

            {/* Live feedback popup */}
            {activeZone && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-2xl animate-bounce flex items-center gap-2 z-35">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>حساب التوزيع: {activeZone}</span>
              </div>
            )}
          </div>
          </div>
        )}

        {(viewMode === "real_photo" || viewMode === "dual_cinema") && (
          <div className={viewMode === "dual_cinema" ? "rounded-2xl border border-emerald-500/15 bg-slate-950/70 p-4 shadow-xl" : "w-full"}>
            {viewMode === "dual_cinema" && (
              <h4 className="text-[10px] font-mono text-emerald-450 font-extrabold mb-4 border-b border-white/5 pb-2 text-right flex items-center justify-between leading-normal">
                <span>📸 البث الثاني: التفعيل الواقعي وتكامل الصور الهجين AR</span>
                <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded text-[9px] text-emerald-450">عرض فوري متزامن</span>
              </h4>
            )}
            {/* 4. REAL HALL INTERIOR PHOTOREALISTIC HYBRID-AR MODE */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 text-right">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs text-emerald-400 font-extrabold pb-0.5">HYBRID AR-SURFACE ACTIVE v2.0</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPetalCascade(!petalCascade)}
                className={`px-3 py-1 text-xs rounded duration-200 border transition-all ${
                  petalCascade
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                🌸 {petalCascade ? "إيقاف تساقط الأوراق" : "تشغيل تساقط الأوراق"}
              </button>
              <div className="text-[10px] text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                مزج ألوان الإضاءة الافتراضية: <strong className="text-white font-mono">{suggestedLighting.ambientHex.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* AR Viewport Container */}
          <div 
            className="relative w-full bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-white/5"
            style={{ height: "440px" }}
          >
            {/* Photorealistic real preset photo */}
            <img 
              src={customRealPhoto || currentPresets[selectedRealPresetIdx].url} 
              alt="Real Hall Custom View"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            />

            {/* LIGHTING ENVIRONMENT COLOR OVERLAY (Blends virtual light seamlessly into physical backdrop features!) */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-1000 z-[2]"
              style={{
                backgroundColor: suggestedLighting.ambientHex,
                mixBlendMode: "color", 
                opacity: (suggestedLighting.intensity / 100) * 0.48,
              }}
            />
            
            {/* Spotlight cone blend */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-1000 z-[2]"
              style={{
                background: `radial-gradient(circle at 50% 15%, ${suggestedLighting.spotlightHex}ee 0%, transparent 80%)`,
                mixBlendMode: "screen", 
                opacity: (suggestedLighting.intensity / 100) * 0.50,
              }}
            />

            {/* Vertical lasers scanning through hall */}
            <div className="holo-scanning-line-custom" />

            {/* Dynamic cascade simulation particles representing Saudi roses/petals */}
            {petalCascade && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[3]">
                {Array.from({ length: 15 }).map((_, i) => {
                  const size = 6 + (i % 4) * 4;
                  const leftPercentage = 5 + (i * 27) % 90;
                  const duration = 5 + (i % 3) * 3.5;
                  const delay = i * 0.5;
                  return (
                    <div
                      key={i}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${leftPercentage}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: i % 2 === 0 ? flower1Color : flower2Color,
                        opacity: 0.75,
                        animation: `real_float_petal ${duration}s infinite linear`,
                        animationDelay: `${delay}s`,
                        filter: `drop-shadow(0 0 10px ${i % 2 === 0 ? flower1Color : flower2Color})`,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* HIGH-TECH INNOVATION OVERLAYS ACCORDING TO OWNER'S PREFERENCES EXECUTED DIRECTLY ON THE REAL PHOTO IN REALTIME */}
            {/* 🌌 Smart Glass Ceiling Overlay on Real Photo */}
            {smartGlassCeiling && (
              <div className="absolute top-0 left-0 w-full h-[32%] pointer-events-none overflow-hidden z-[4]" id="real-glass-ceiling-stars">
                {/* Dark celestial blend */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-blue-950/20 to-transparent" />
                
                {/* Shiny stars */}
                <div className="absolute inset-0 opacity-60 animate-pulse" style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "28px 28px"
                }} />
                <div className="absolute inset-0 opacity-40 animate-ping" style={{
                  backgroundImage: "radial-gradient(circle, #ffd700 1.5px, transparent 1.5px)",
                  backgroundSize: "45px 45px",
                  backgroundPosition: "12px 18px",
                  animationDuration: "6s"
                }} />
                
                {/* Glowing celestial nebula */}
                <div className="absolute -top-12 left-1/3 w-80 h-24 rounded-full bg-violet-500/25 blur-[40px] animate-pulse" style={{ animationDuration: "5s" }} />
                
                <div className="absolute top-2.5 right-3.5 text-[8.5px] font-extrabold tracking-wider text-amber-300 bg-slate-950/85 px-2 py-0.5 rounded border border-amber-500/25">
                  🌌 سقف زجاجي ذكي: نجوم وثريات فلكية مستقرة
                </div>
              </div>
            )}

            {/* ✨ Holographic Mirror Floor Grid Overlay on Real Photo */}
            {holographicGround && (
              <div className="absolute bottom-0 left-0 w-full h-[38%] pointer-events-none z-[4] overflow-hidden" id="real-holographic-grid" style={{ perspective: "120px" }}>
                {/* Deep mirror grids */}
                <div 
                  className="w-full h-full border-t border-amber-500/30 bg-gradient-to-t from-amber-500/15 via-emerald-500/5 to-transparent animate-pulse" 
                  style={{ 
                    transform: "rotateX(55deg)", 
                    transformOrigin: "bottom center",
                    backgroundSize: "25px 25px",
                    backgroundImage: "linear-gradient(to right, rgba(245, 158, 11, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.15) 1px, transparent 1px)",
                    animationDuration: "3.5s"
                  }} 
                />
                
                {/* Running light glow */}
                <div className="absolute bottom-0 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-sm shadow-2xl animate-pulse" />
                
                <div className="absolute bottom-2 right-3.5 text-[8.5px] font-extrabold text-emerald-300 bg-slate-950/85 px-2 py-0.5 rounded border border-emerald-500/25">
                  ✨ أرضية مرآة هولوغرافية تفاعلية مفعّلة
                </div>
              </div>
            )}

            {/* 💨 Scent Sprinkler System Overlays on Real Photo */}
            {scentSprinkler && (
              <div className="absolute inset-x-0 top-[20%] bottom-[20%] pointer-events-none overflow-hidden z-[4]" id="real-scent-sprinkling">
                {/* Fog plumes on edges */}
                <div className="absolute left-0 top-1/4 w-20 h-44 bg-gradient-to-r from-purple-500/20 to-transparent blur-2xl rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute right-0 top-1/4 w-20 h-44 bg-gradient-to-l from-purple-500/20 to-transparent blur-2xl rounded-full animate-pulse" style={{ animationDuration: '3.5s' }} />
                
                {/* Floating lavender scent droplets */}
                <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-350 rounded-full animate-ping" style={{ animationDuration: "2.5s" }} />
                
                {/* Indicator text block */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8.5px] font-bold text-violet-300 bg-slate-950/85 border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-2xl">
                  <span className="h-1 text-center font-mono animate-bounce">💨</span>
                  <span>نافذ رذاذ العطر: {saudiScent === "oud" ? "العود والمسك" : saudiScent === "lavender" ? "لافندر الهدا المهدئ" : "ياسمين الحجاز النقي"}</span>
                </div>
              </div>
            )}

            {/* 🔮 Kinetic Chandeliers moving overlay on Real Photo */}
            {kineticChandeliers && (
              <div className="absolute top-[8%] left-[20%] right-[20%] h-12 pointer-events-none z-[4] flex justify-between px-10" id="real-kinetic-chandeliers">
                <div className="relative flex h-8 w-12 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: "8s" }} />
                  <div className="relative w-4 h-4 rounded-full bg-amber-400/20 border border-amber-300/80 animate-ping" />
                </div>
                <div className="relative flex h-8 w-12 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: "10s" }} />
                  <div className="relative w-4 h-4 rounded-full bg-amber-400/20 border border-amber-300/80 animate-ping" style={{ animationDelay: '0.8s' }} />
                </div>
              </div>
            )}

            {/* INTERACTIVE HOTSPOTS/PINS OVER THE DETAILED REAL PIC TO MODIFY PARAMETERS */}
            {/* Pin 1: Backdrop & Presidium */}
            <button
              onClick={() => {
                const nextKoshas: KoshaStyle[] = ["RoseWall", "CrystalHarp", "GardenArch", "ModernGold"];
                const nextStyle = nextKoshas[(nextKoshas.indexOf(floorLayout.koshaBackground) + 1) % nextKoshas.length];
                onUpdateLayout(prev => ({ ...prev, koshaBackground: nextStyle }));
                triggerZoneAction(`مسرح الصدارة: ${nextStyle}`);
              }}
              className="absolute top-[26%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group text-right focus:outline-none"
              title="خصائص الكوشة في الصورة"
            >
              <div className="relative flex h-4.5 w-4.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500 border border-slate-950"></span>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 scale-95 group-hover:scale-100 transition-all opacity-95 duration-150 whitespace-nowrap bg-slate-950/95 border border-amber-400/40 text-amber-300 font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                👑 {hallSection === "women" ? `كوشة العروس البصرية: ${floorLayout.koshaBackground}` : `مجلس الصدارة للرجال: ${floorLayout.koshaBackground}`}
              </div>
            </button>

            {/* Pin 2: Runway / Greeting Pathway */}
            <button
              onClick={() => {
                const len = floorLayout.catwalkLength >= 22 ? 10 : floorLayout.catwalkLength + 2;
                onUpdateLayout(prev => ({ ...prev, catwalkLength: len }));
                triggerZoneAction(`ممر المشي: طولي ${len}م`);
              }}
              className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-20 group text-right focus:outline-none"
              title="خصائص المعبر الأوسط"
            >
              <div className="relative flex h-4.5 w-4.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border border-slate-950"></span>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 scale-95 group-hover:scale-100 transition-all opacity-95 duration-150 whitespace-nowrap bg-slate-950/95 border border-emerald-400/40 text-emerald-300 font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                🚶‍♂️ {hallSection === "women" ? `ممشى زفة العرس: ${floorLayout.catwalkLength} متر` : `مسار استقبال الشيوخ: ${floorLayout.catwalkLength} متر`}
              </div>
            </button>

            {/* Pin 3: VIP hospitality Seats */}
            <button
              onClick={() => {
                const styles: TableStyle[] = ["Round", "Banqueting"];
                const nextStyle = styles[(styles.indexOf(floorLayout.tableStyle) + 1) % styles.length];
                onUpdateLayout(prev => ({ ...prev, tableStyle: nextStyle }));
                triggerZoneAction(`طريقة الجلوس: ${nextStyle}`);
              }}
              className="absolute bottom-[24%] left-[23%] z-20 group text-right focus:outline-none"
              title="تنسيق الكنب والضيافة"
            >
              <div className="relative flex h-4.5 w-4.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-80"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-pink-500 border border-slate-950"></span>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 scale-95 group-hover:scale-100 transition-all opacity-95 duration-150 whitespace-nowrap bg-slate-950/95 border border-pink-400/40 text-pink-300 font-extrabold text-[10px] px-2.5 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                🍽️ {hallSection === "women" ? `جلسات الـ VIP: ${floorLayout.tableStyle === "Round" ? "دائرية ملكية" : "طولية كلاسيكية"}` : `جلسات الضيافة: كنب نجد كلاسيك`}
              </div>
            </button>

            {/* Interactive Color Wash HUD Card (top right overlay) */}
            <div className="absolute top-4 right-4 bg-slate-950/90 border border-emerald-500/20 rounded-xl p-3 max-w-[210px] text-right space-y-1.5 z-20 shadow-xl select-none backdrop-blur-md">
              <span className="text-[9px] font-black text-emerald-400 tracking-wider flex items-center gap-1 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                المطابقة الحية ثنائية التوهج
              </span>
              <div className="text-white font-extrabold text-[11px] truncate">
                {customRealPhoto ? "صورة قاعتك الخاصة المرفوعة" : currentPresets[selectedRealPresetIdx].name}
              </div>
              <p className="text-[9px] text-white/50 leading-relaxed font-medium">
                مجسم الذكاء الاصطناعي يقوم بدمج شدة إضاءة الصالة مع فصائل زهور {recommendedFlowers[0]?.nameArabic || "الجوري"} حلياً.
              </p>
            </div>

            {/* Floating visual specifications of the flower choices inside active camera overlay (top left overlay) */}
            <div className="absolute top-4 left-4 bg-slate-950/95 border border-white/10 rounded-xl p-3 text-right z-20 shadow-xl max-w-[220px] backdrop-blur-md space-y-1.5">
              <span className="text-[10px] text-amber-400 font-extrabold block">الأطياف البصرية المدمجة بالصورة:</span>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {recommendedFlowers.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] text-white/80 bg-white/5 p-1 px-1.5 rounded">
                    <span className="font-mono text-amber-300 font-bold">{f.percentage}%</span>
                    <div className="flex items-center gap-1">
                      <span className="truncate">{f.nameArabic}</span>
                      <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: f.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Presets and Custom upload controls Row overlay (bottom row HUD wrapper) */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-20 bg-slate-950/95 border border-white/10 p-3 rounded-xl backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-amber-400 font-black">أمثلة صالات واقعية ومطبقة للقصور السعودية:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {currentPresets.map((pst, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedRealPresetIdx(idx); setCustomRealPhoto(null); triggerZoneAction(pst.name); }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                        selectedRealPresetIdx === idx && !customRealPhoto
                          ? "bg-amber-500 border-amber-400 text-slate-950 font-black"
                          : "bg-white/5 border-white/5 text-white/70 hover:bg-white/15"
                      }`}
                    >
                      🏛️ {pst.name.split(" - ")[0].split("قاعة ")[1] || pst.name.split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload trigger */}
              <div className="flex items-center gap-2">
                {customRealPhoto && (
                  <button
                    onClick={() => { setCustomRealPhoto(null); triggerZoneAction("العودة للصور الافتراضية"); }}
                    className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/35 transition-all"
                  >
                    حذف صورتي
                  </button>
                )}
                <label className="px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-[10px] cursor-pointer transition-all shadow-md flex items-center gap-1 select-none">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Upload className="h-3 w-3" />
                  <span>📥 ارفع صورة قاعتك من الداخل</span>
                </label>
              </div>
            </div>

            {/* Floating Live feedback banner */}
            {activeZone && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-2xl animate-bounce flex items-center gap-2 z-40">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>تم دمج وتظليل {activeZone} بالواقع حياً</span>
              </div>
            )}
          </div>
          </div>
        )}

        {/* 4.5 MODERN AR OVERLAY PLANNING & PROFESSIONALLY SIMULATED FLIGHT DRONE SUITE */}
        {viewMode === "ar_overlay" && (
          <div className="w-full space-y-6 animate-fade-in text-right">
            
            {/* Suite Header HUD */}
            <div className="rounded-2xl border border-violet-500/15 bg-slate-900/40 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                <span className="text-xs text-violet-400 font-extrabold font-mono uppercase tracking-wider">
                  GIGI Drone-Assisted AR Overlay Environment v3.1
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span>شفافية المخطط الهندسي:</span>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.05"
                    value={arDroneOpacity}
                    onChange={(e) => setArDroneOpacity(parseFloat(e.target.value))}
                    className="w-24 accent-violet-500 cursor-pointer h-1 rounded"
                    title="تعديل نسبة شفافية الـ SVG"
                  />
                  <strong className="font-mono text-violet-300 font-extrabold">{Math.round(arDroneOpacity * 100)}%</strong>
                </div>

                <button
                  onClick={() => setArScanningActive(!arScanningActive)}
                  className={`px-3 py-1 rounded text-[10px] font-bold border transition-all ${
                    arScanningActive 
                      ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                      : "bg-white/5 border-white/10 text-white/40"
                  }`}
                >
                  📡 {arScanningActive ? "إيقاف مسح الليزر" : "تشغيل خطوط المسح"}
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* THE RESPONSIVE VIEWPORT CONSOLE (8 Columns) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Immersive Sandbox Screen */}
                <div 
                  className="relative w-full bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-violet-500/20"
                  style={{ height: "490px" }}
                >
                  {/* Background photo (User custom uploaded carpet or professional floor sketch blueprint) */}
                  <img 
                    src={customFloorPhoto || AR_FLOOR_PRESETS[customFloorPresetIdx].url} 
                    alt="AR Ground Blueprint Draft"
                    className="absolute inset-0 w-full h-full object-cover opacity-35 transition-all duration-700"
                  />

                  {/* High Tech architectural calibration blueprint frame overlay */}
                  <div className="absolute inset-0 bg-radial-gradient(ellipse at center, transparent 30%, rgba(11,15,25,0.7) 100%) pointer-events-none" />
                  
                  {arScanningActive && (
                    <>
                      {/* Blueprint Grid Lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none" />
                      {/* Moving laser sweep line */}
                      <div 
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_#8b5cf6] top-1/4 animate-bounce pointer-events-none" 
                        style={{ animationDuration: '4.8s' }} 
                      />
                    </>
                  )}

                  {/* Absolute SVG overlay with the actual floral layout design */}
                  <svg 
                    viewBox="0 0 800 500" 
                    className="absolute inset-0 w-full h-full select-none"
                    style={{ opacity: arDroneOpacity }}
                  >
                    <defs>
                      <radialGradient id="arLuxeWarmGold" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={floorLayout.lightingColor} stopOpacity="0.80" />
                        <stop offset="100%" stopColor={floorLayout.lightingColor} stopOpacity="0" />
                      </radialGradient>
                      <pattern id="arSaduGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <rect width="30" height="30" fill="#7f1d1d" opacity="0.18" />
                        <path d="M 0 15 L 30 15 M 15 0 L 15 30" stroke="#f59e0b" strokeWidth="0.8" opacity="0.25" />
                      </pattern>
                    </defs>

                    {/* Floral catwalk (Mammensha) map outline */}
                    <g id="ar-catwalk">
                      {/* Catwalk backbone */}
                      <rect 
                        x="360" 
                        y="110" 
                        width="80" 
                        height="300" 
                        fill="rgba(139, 92, 246, 0.22)" 
                        stroke="#8b5cf6" 
                        strokeWidth="3.5" 
                        strokeDasharray="4,4" 
                        rx="8"
                      />
                      <line x1="360" y1="110" x2="360" y2="410" stroke="#a78bfa" strokeWidth="1.5" />
                      <line x1="440" y1="110" x2="440" y2="410" stroke="#a78bfa" strokeWidth="1.5" />

                      {/* Flanking Floral pillars - dynamically styled of the actual flower colors */}
                      <circle cx="340" cy="140" r="14" fill={flower1Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="340" cy="140" r="8" fill={flower2Color} />
                      <circle cx="460" cy="140" r="14" fill={flower1Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="460" cy="140" r="8" fill={flower2Color} />

                      <circle cx="330" cy="230" r="16" fill={flower2Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="330" cy="230" r="9" fill={flower3Color} />
                      <circle cx="470" cy="230" r="16" fill={flower2Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="470" cy="230" r="9" fill={flower3Color} />

                      <circle cx="320" cy="320" r="18" fill={flower1Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="320" cy="320" r="10" fill={flower3Color} />
                      <circle cx="480" cy="320" r="18" fill={flower1Color} filter="drop-shadow(0 0 6px rgba(0,0,0,0.5))" />
                      <circle cx="480" cy="320" r="10" fill={flower3Color} />

                      {/* Giant Floral arch at the beginning of catwalk */}
                      {floorLayout.hasFlowerArch && (
                        <path d="M 285 410 A 115 115 0 0 1 515 410" fill="none" stroke={flower1Color} strokeWidth="8" strokeDasharray="10,6" />
                      )}
                    </g>

                    {/* Majestic Kosha platform layout mapping */}
                    <g id="ar-kosha">
                      <rect x="250" y="30" width="300" height="65" fill="rgba(15, 23, 42, 0.95)" stroke="#fbbf24" strokeWidth="2.5" rx="6" />
                      {hallSection === "men" ? (
                        <rect x="255" y="35" width="290" height="15" fill="url(#arSaduGrid)" />
                      ) : (
                        <rect x="255" y="35" width="290" height="15" fill={flower1Color} opacity="0.4" />
                      )}
                      <text x="400" y="65" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {hallSection === "women" ? `كوشة ملكية سابقة: ${floorLayout.koshaBackground}` : `صدارة الرجال: ${floorLayout.koshaBackground}`}
                      </text>

                      {/* Decorative floral dots on the Kosha */}
                      <circle cx="270" cy="62" r="7" fill={flower1Color} />
                      <circle cx="270" cy="62" r="4" fill={flower2Color} />
                      <circle cx="530" cy="62" r="7" fill={flower1Color} />
                      <circle cx="530" cy="62" r="4" fill={flower2Color} />
                    </g>

                    {/* Tables mapping dynamically based on style: Round or Banqueting */}
                    <g id="ar-tables">
                      {floorLayout.tableStyle === "Round" ? (
                        <>
                          {/* Row 1 Left */}
                          <circle cx="150" cy="180" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="150" cy="180" r="10" fill={flower1Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={150 + Math.cos(angle)*38} cy={180 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}

                          {/* Row 1 Right */}
                          <circle cx="650" cy="180" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="650" cy="180" r="10" fill={flower1Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={650 + Math.cos(angle)*38} cy={180 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}

                          {/* Row 2 Left */}
                          <circle cx="160" cy="300" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="160" cy="300" r="10" fill={flower2Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={160 + Math.cos(angle)*38} cy={300 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}

                          {/* Row 2 Right */}
                          <circle cx="640" cy="300" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="640" cy="300" r="10" fill={flower2Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={640 + Math.cos(angle)*38} cy={300 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}

                          {/* Row 3 Left */}
                          <circle cx="180" cy="410" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="180" cy="410" r="10" fill={flower1Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={180 + Math.cos(angle)*38} cy={410 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}

                          {/* Row 3 Right */}
                          <circle cx="620" cy="410" r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" />
                          <circle cx="620" cy="410" r="10" fill={flower1Color} />
                          {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * Math.PI) / 3;
                            return (
                              <circle key={i} cx={620 + Math.cos(angle)*38} cy={410 + Math.sin(angle)*38} r="4.5" fill="#334155" />
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {/* Left Long Table Block */}
                          <rect x="90" y="160" width="100" height="230" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" rx="4" />
                          <line x1="140" y1="170" x2="140" y2="380" stroke={flower1Color} strokeWidth="5.5" strokeDasharray="14,10" />
                          {Array.from({ length: 6 }).map((_, i) => (
                            <React.Fragment key={i}>
                              <circle cx="78" cy={180 + i * 36} r="4.5" fill="#334155" />
                              <circle cx="202" cy={180 + i * 36} r="4.5" fill="#334155" />
                            </React.Fragment>
                          ))}

                          {/* Right Long Table Block */}
                          <rect x="610" y="160" width="100" height="230" fill="rgba(15, 23, 42, 0.85)" stroke="#ffffff20" strokeWidth="1.5" rx="4" />
                          <line x1="660" y1="170" x2="660" y2="380" stroke={flower2Color} strokeWidth="5.5" strokeDasharray="14,10" />
                          {Array.from({ length: 6 }).map((_, i) => (
                            <React.Fragment key={i}>
                              <circle cx="598" cy={180 + i * 36} r="4.5" fill="#334155" />
                              <circle cx="722" cy={180 + i * 36} r="4.5" fill="#334155" />
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </g>

                    {/* Diagnostic HUD tracking crosshair */}
                    <g transform={`translate(${arDroneCoords.x}, ${arDroneCoords.y})`}>
                      <circle cx="0" cy="0" r="140" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="1" strokeDasharray="3,5" />
                      <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(167, 139, 250, 0.5)" strokeWidth="0.8" />
                    </g>

                    {/* PHYSICAL CO-MAPPED PILOT DRONE OVERLAY */}
                    <g transform={`translate(${arDroneCoords.x}, ${arDroneCoords.y}) rotate(${arDroneAngle})`}>
                      {/* Range pointer */}
                      <line x1="0" y1="0" x2="0" y2="-32" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
                      <polygon points="0,-36 -4,-30 4,-30" fill="#fbbf24" />

                      {/* Animated rotating wing rotors */}
                      <circle cx="-16" cy="-16" r="10" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" className="animate-pulse" />
                      <circle cx="16" cy="-16" r="10" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" className="animate-pulse" />
                      <circle cx="-16" cy="16" r="10" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" className="animate-pulse" />
                      <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" className="animate-pulse" />

                      <line x1="-16" y1="-16" x2="16" y2="16" stroke="#94a3b8" strokeWidth="2.5" />
                      <line x1="16" y1="-16" x2="-16" y2="16" stroke="#94a3b8" strokeWidth="2.5" />

                      {/* Core drone frame base */}
                      <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#a78bfa" strokeWidth="2" />
                      <circle cx="0" cy="-3" r="3.5" fill="#34d399" />
                    </g>
                  </svg>

                  {/* Telemetry frame dashboard overlayed on bottom of screen */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/93 border border-white/10 p-3.5 rounded-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-right z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-lg select-none">
                        🚁
                      </div>
                      <div>
                        <div className="text-[9px] text-white/50 leading-none">مهمة استطلاع ومطابقة الـ AR:</div>
                        <div className="text-[11px] font-black text-white mt-1.5">{arDroneRouteName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-center font-mono">
                      <div>
                        <div className="text-[8px] text-white/40">ALTITUDE</div>
                        <div className="text-[11px] font-extrabold text-violet-300">{arDroneHeight}M</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/40">BEARING YAW</div>
                        <div className="text-[11px] font-extrabold text-amber-300">{arDroneAngle}°</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/40">CO-PLAN MATCH</div>
                        <div className="text-[11px] font-extrabold text-emerald-400">٩٤.٨٪</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/40 font-bold">BATTERY</div>
                        <div className="text-[11px] font-extrabold text-teal-400">{arDroneBattery}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] text-rose-400 font-bold select-none">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span>CO-SYNC STREAM 4K</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* MISSION CONTROLLERS & BLUEPRINT UPLOAD SIDEBAR (4 Columns) */}
              <div className="lg:col-span-4 space-y-5 text-right">

                {/* ARCHITECTURAL BLUEPRINT PRESETS */}
                <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/30 space-y-3">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5 justify-end pb-1 border-b border-white/5">
                    <span>مخططات الطوابق الـ AR الجاهزة للمطابقة:</span>
                    <span className="text-sm">📐</span>
                  </h4>
                  <div className="space-y-1.5">
                    {AR_FLOOR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomFloorPresetIdx(idx);
                          setCustomFloorPhoto(null);
                          triggerZoneAction(`مخطط مطابقة: ${p.name.split(" ")[0]}`);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-right text-xs transition-all flex flex-col justify-between ${
                          customFloorPresetIdx === idx && !customFloorPhoto
                            ? "border-violet-500 bg-violet-500/5 text-violet-300 font-bold"
                            : "border-white/5 bg-slate-950/40 text-white/65 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{p.name.split(" ")[0]}</span>
                          <span className="text-[9px] opacity-70 font-mono">B-PLATE #{idx+1}</span>
                        </div>
                        <span className="text-[10px] text-white/40 font-normal mt-1 leading-relaxed">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* DIRECT CUSTOM BLUEPRINT FILE UPLOAD */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-violet-500/20 bg-slate-950 space-y-3.5">
                  <div className="text-right space-y-1">
                    <span className="text-xs font-black text-white block">📥 رفع صورة مسقط الصالة ومخططها الخاص</span>
                    <p className="text-[10px] text-white/50 leading-relaxed font-semibold">
                      تستطيع رفع مخطط معبأ أو صورة حقيقية مأخوذة من الأعلى، وسيقوم النظام بتنزيل كوشة الورد والممشى والمقاعد فوقها للمعاينة مباشرة.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {customFloorPhoto && (
                      <button
                        onClick={() => {
                          setCustomFloorPhoto(null);
                          triggerZoneAction("العودة لمخططات النخبة");
                        }}
                        className="px-2.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold hover:bg-rose-500/20 transition-all flex-1"
                      >
                        حذف المخطط ورفع جديد
                      </button>
                    )}
                    
                    <label className="flex-1 py-2 text-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-90 duration-200 cursor-pointer text-white text-[10px] font-black shadow-lg flex items-center justify-center gap-1 select-none">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFloorPhotoUpload}
                        className="hidden"
                      />
                      <Upload className="h-3.5 w-3.5" />
                      <span>{customFloorPhoto ? "تغيير المخطط المرفوع 📸" : "تحميلصورتك الخاصة للبلدية 📥"}</span>
                    </label>
                  </div>
                </div>

                {/* VIRTUAL DRONE JOYSTICK (PILOT DRONE CO-STEER) */}
                <div className="p-4 rounded-2xl border border-amber-500/15 bg-slate-950/90 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                      ACTIVE PILOT FRAME
                    </span>
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <span>وحدة توجيه وملاحة طيران الدرون</span>
                      <span>🛸</span>
                    </span>
                  </div>

                  <p className="text-[10px] text-white/55 leading-relaxed">
                    استخدم الاتجاهات لتحريك الدرون آلياً وتغيير زاوية مسح الكوشة والطاولات والممشى الفاخر من جميع النواحي:
                  </p>

                  {/* JOYSTICK CONTROLLER */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-28 w-28 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center p-1 shadow-inner">
                      
                      <button
                        onClick={() => {
                          setArDroneCoords(prev => ({ ...prev, y: Math.max(40, prev.y - 18) }));
                          setArDroneHeight(prev => Number(Math.min(30, prev + 0.6).toFixed(1)));
                          setArDroneRouteName("استطلاع طولي لمنطقة الكوشة والمنصة");
                          triggerZoneAction("الطيران للأمام");
                        }}
                        className="absolute top-1 p-1.5 rounded-lg bg-slate-950 border border-white/10 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-[9px] w-6.5 h-6.5 flex items-center justify-center shadow"
                        title="تحليق للأمام وتكبير"
                      >
                        ▲
                      </button>

                      <button
                        onClick={() => {
                          setArDroneCoords(prev => ({ ...prev, y: Math.min(460, prev.y + 18) }));
                          setArDroneHeight(prev => Number(Math.max(2, prev - 0.6).toFixed(1)));
                          setArDroneRouteName("استكشاف خلفي وتأطير الممرات والمدخل الخارجي");
                          triggerZoneAction("الطيران للخلف والنزول");
                        }}
                        className="absolute bottom-1 p-1.5 rounded-lg bg-slate-950 border border-white/10 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-[9px] w-6.5 h-6.5 flex items-center justify-center shadow"
                        title="تحليق للخلف وتقليل الارتفاع"
                      >
                        ▼
                      </button>

                      <button
                        onClick={() => {
                          setArDroneCoords(prev => ({ ...prev, x: Math.max(80, prev.x - 18) }));
                          setArDroneAngle(prev => (prev - 15 + 360) % 360);
                          setArDroneRouteName("طواف جانبي لفحص فصائل الورود وجلسات النساء اليمنى واليسرى");
                          triggerZoneAction("الطيران لليسار");
                        }}
                        className="absolute left-1 p-1.5 rounded-lg bg-slate-950 border border-white/10 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-[9px] w-6.5 h-6.5 flex items-center justify-center shadow"
                        title="استدارة يساراً"
                      >
                        ◀
                      </button>

                      <button
                        onClick={() => {
                          setArDroneCoords(prev => ({ ...prev, x: Math.min(720, prev.x + 18) }));
                          setArDroneAngle(prev => (prev + 15) % 360);
                          setArDroneRouteName("استقصاء طرفي يمين لمكافحة توهج الكشافات البصرية");
                          triggerZoneAction("الطيران لليمين");
                        }}
                        className="absolute right-1 p-1.5 rounded-lg bg-slate-950 border border-white/10 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-[9px] w-6.5 h-6.5 flex items-center justify-center shadow"
                        title="استدارة يميناً"
                      >
                        ▶
                      </button>

                      {/* Diagnostic center core readout */}
                      <div className="h-9 w-9 bg-slate-950/95 border-2 border-amber-400 rounded-full flex flex-col items-center justify-center text-[8px] font-mono font-extrabold text-amber-300">
                        <span>{arDroneHeight}M</span>
                        <span>ALT</span>
                      </div>

                    </div>
                  </div>

                  {/* AUTO FLIGHT PATH PRESETS */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-white/40 block">خطط طيران هولدينج دقيقة آلياً:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setArDroneHeight(19.2);
                          setArDroneAngle(0);
                          setArDroneCoords({ x: 400, y: 62 });
                          setArDroneRouteName("تموضع وتفقّد جوي ممتد لمنصة الكوشة الفارهة");
                          triggerZoneAction("مسار الكوشة الملكية");
                        }}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500 hover:bg-violet-600/10 text-white/70 hover:text-white transition-all text-[9.5px] font-extrabold text-center leading-normal"
                      >
                        👑 تموضع فوق الكوشة
                      </button>

                      <button
                        onClick={() => {
                          setArDroneHeight(7.5);
                          setArDroneAngle(180);
                          setArDroneCoords({ x: 400, y: 260 });
                          setArDroneRouteName("مسار وارتفاع ممر زفة العرس والأزهار الطبيعية");
                          triggerZoneAction("مسار ممر العروس");
                        }}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500 hover:bg-violet-600/10 text-white/70 hover:text-white transition-all text-[9.5px] font-extrabold text-center leading-normal"
                      >
                        🚶‍♂️ مسار زفة العروس
                      </button>
                    </div>
                  </div>

                </div>

              </div>
              
            </div>

          </div>
        )}
      </div>

      {/* 5. GIGI-AR SAUDI MULTI-USER ADVANCED COORDINATION WORKFLOW PORTAL (حلقة العمل المشتركة) */}
      <div className="mt-6 border-t border-white/5 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-right">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Settings className="h-4 w-4 animate-spin" style={{ animationDuration: "12s" }} />
            </span>
            <div>
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">بوابة التنسيق التفاعلي المشترك والمطابقة السعودية</h4>
              <p className="text-[10px] text-white/50">تحكم حركي وتكامل للعميل وصاحب القاعة لضمان تجربة فخمة لا تنسى</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
            نشط بالكامل 🇸🇦
          </span>
        </div>

        {/* Dynamic Workflow parameter tweaks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Time of Day & Shadow intensity simulator */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-right space-y-3">
            <div className="flex items-center justify-end gap-1.5 text-amber-400 font-bold text-[11px]">
              <span>محاكاة توقيت الإضاءة والظلال</span>
              <span className="text-sm">🌅</span>
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed font-medium">
              محاكاة تعامد الضوء على الورد في أوقات متباينة لرؤية انعكاس الظلال الطبيعية على أقمشة الممر وجوانب الكوشة.
            </p>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/50 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => { setTodMood("dawn"); triggerZoneAction("الفجر اللؤلؤي"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${todMood === "dawn" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🌄 الفجر اللؤلؤي
              </button>
              <button
                onClick={() => { setTodMood("dusk"); triggerZoneAction("الشفق المذهب"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${todMood === "dusk" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🌇 شروق مذهب
              </button>
              <button
                onClick={() => { setTodMood("midnight"); triggerZoneAction("الوميض الليلي المظلم"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${todMood === "midnight" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🌌 الليل الشامخ
              </button>
            </div>
          </div>

          {/* Box 2: Traditional Aromatic Scent Overlay Tagging */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-right space-y-3">
            <div className="flex items-center justify-end gap-1.5 text-pink-400 font-bold text-[11px]">
              <span>تكامل الرائحة الافتراضية مع الأبخرة</span>
              <span className="text-sm">💨</span>
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed font-medium">
              عند تشغيل المبخرة للرجال أو النيتروجين للنساء، يمتزج الطيف اللوني للبخار في المجسم حياً لتمثيل الرائحة المختارة.
            </p>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/50 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => { setSaudiScent("oud"); onUpdateLighting(prev => ({ ...prev, ambientHex: "#451a03" })); triggerZoneAction("بخور العود الكمبودي"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${saudiScent === "oud" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🪵 عود كمبودي
              </button>
              <button
                onClick={() => { setSaudiScent("lavender"); onUpdateLighting(prev => ({ ...prev, ambientHex: "#2E1065" })); triggerZoneAction("رائحة لافندر الهدا المهدئ"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${saudiScent === "lavender" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🌸 لافندر الهدا
              </button>
              <button
                onClick={() => { setSaudiScent("jasmine"); onUpdateLighting(prev => ({ ...prev, ambientHex: "#111827" })); triggerZoneAction("معبأ بياسمين الحجاز النقي"); }}
                className={`py-1 rounded text-[9px] font-extrabold transition-all ${saudiScent === "jasmine" ? "bg-amber-500 text-slate-950" : "text-white/60 hover:text-white"}`}
              >
                🌿 ياسمين حجازي
              </button>
            </div>
          </div>

          {/* Box 3: Smart segregated cost & logistics counter */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-right space-y-3">
            <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold text-[11px]">
              <span>مستشار الترتيب المالي المتولد</span>
              <span className="text-sm">🇸🇦</span>
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed font-medium">
              حساب إلكتروني تقديري لتغطية الزينة والورود والضيافة بناءً على الفصل بين صالات الرجال والنساء حياً:
            </p>
            <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[10px]">
              <span className="text-amber-400 font-bold font-mono">
                {(design.estimatedBudgetSAR * (hallSection === "women" ? 1.0 : 0.6)).toLocaleString()} ر.س
              </span>
              <span className="text-white/60 font-semibold">تغطية {hallSection === "women" ? "قسم النساء والزفة" : "قسم الرجال والضيافة"}</span>
            </div>
          </div>

        </div>

        {/* Helpful instructions / footnotes */}
        <div className="p-3.5 rounded-xl bg-slate-900/20 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
          <p className="text-xs text-white/50 flex items-center gap-2 font-medium justify-end">
            <span>💡 <strong>نصيحة المنظم للتجربة الهجينة:</strong> اضغط على <strong>"ارفع صورة قاعتك الحقيقية"</strong> وقم بإشراك العميل في نقاش مباشر لتغيير المعاينة ومطابقة الزوايا والظلال فورًا!</span>
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          </p>
        </div>
      </div>

    </div>
  );
}
