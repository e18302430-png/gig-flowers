import React, { useState, useEffect } from "react";
import { 
  Video, 
  Eye, 
  Sliders, 
  Cpu, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Camera,
  RefreshCw,
  Orbit,
  Maximize2,
  X,
  Upload,
  Layers,
  MapPin,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Send,
  Zap
} from "lucide-react";

interface CinematicSimulatorProps {
  venueTitle: string;
  themeName: string;
  isMusicPlaying: boolean;
  onToggleMusic: (state: boolean) => void;
  flowerColors: string[];
  setToastMessage?: (msg: string | null) => void;
}

type FlightRoute = "entrance-sweep" | "runway-path" | "bridal-hover" | "free-pilot";

// Premium high-res venue collection
const VIP_PRESET_GALLERY = [
  {
    id: "yamama",
    name: "قاعة اليمامة الكبرى (الرياض)",
    exterior: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=800",
    interior: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=800",
    specs: "طراز أندلسي فخم مكسو بالذهب • سعة ١٠٠٠ شخص"
  },
  {
    id: "andalus",
    name: "قصر الأندلس للعروسين (جدة)",
    exterior: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800",
    interior: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800",
    specs: "بهو ساحلي نيوكلاسيك متسع • سعة ٨٠٠ شخص"
  },
  {
    id: "gulf",
    name: "صالة لؤلؤة الخليج (الدمام)",
    exterior: "https://images.unsplash.com/photo-1521401830884-6c03c1c87efa?auto=format&fit=crop&q=80&w=800",
    interior: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=800",
    specs: "أسقف مذهبة من النحاس المعاير • سعة ٦٠٠ شخص"
  },
  {
    id: "neom",
    name: "الخيمة المليارية الذكية (نيوم)",
    exterior: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    interior: "https://images.unsplash.com/photo-1507504038482-762104624b97?auto=format&fit=crop&q=80&w=800",
    specs: "صرح طيفي ذو تغطية هولوجرامية • سعة ١٥٠٠ شخص"
  }
];

export default function CinematicSimulator({ 
  venueTitle, 
  themeName, 
  isMusicPlaying, 
  onToggleMusic,
  flowerColors = ["#fb723c", "#8b5cf6"],
  setToastMessage
}: CinematicSimulatorProps) {
  
  // Immersive interactive simulator state variables
  const [activeRoute, setActiveRoute] = useState<FlightRoute>("runway-path");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  
  // Custom image input state (owners can type in URLs directly for outside/inside)
  const [customExtUrl, setCustomExtUrl] = useState<string>("");
  const [customIntUrl, setCustomIntUrl] = useState<string>("");
  
  // Uploaded temporary blobs
  const [uploadedExtBlob, setUploadedExtBlob] = useState<string>("");
  const [uploadedIntBlob, setUploadedIntBlob] = useState<string>("");

  // Drone real-time flight metrics
  const [altitude, setAltitude] = useState<number>(14.5);
  const [droneSpeed, setDroneSpeed] = useState<number>(3.5);
  const [signalStrength, setSignalStrength] = useState<number>(98);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [yawAngle, setYawAngle] = useState<number>(180);
  const [cameraZoom, setCameraZoom] = useState<number>(2.4);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);

  // Drone 2D simulated map coordinates (x, y) relative to SVG radar screen
  const [droneCoords, setDroneCoords] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [showEpicIntroTrailer, setShowEpicIntroTrailer] = useState<boolean>(false);
  const [isImmersiveTheater, setIsImmersiveTheater] = useState<boolean>(false);
  const [currentSystemLog, setCurrentSystemLog] = useState<string>("جاري تهيئة طائرة الاستكشاف الاستباقي...");

  // Sound visualization wave heights
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 28 }, () => Math.random() * 80 + 20)
  );

  const triggerToast = (msg: string | null) => {
    if (setToastMessage) setToastMessage(msg);
  };

  // Sound visualization effect loop
  useEffect(() => {
    if (!isMusicPlaying) return;
    const interval = setInterval(() => {
      setWaveHeights(Array.from({ length: 28 }, () => Math.random() * 85 + 15));
    }, 120);
    return () => clearInterval(interval);
  }, [isMusicPlaying]);

  // Synchronize preset changes to update current photo presets
  useEffect(() => {
    const matchingIdx = VIP_PRESET_GALLERY.findIndex(v => v.name.includes(venueTitle.split(" - ")[0]));
    if (matchingIdx !== -1) {
      setSelectedPresetIndex(matchingIdx);
    }
  }, [venueTitle]);

  // Handle route flight automation changes
  useEffect(() => {
    if (activeRoute === "entrance-sweep") {
      setAltitude(18.2);
      setDroneSpeed(4.2);
      setCameraZoom(1.0);
      setYawAngle(45);
      setDroneCoords({ x: 50, y: 150 });
      setCurrentSystemLog("🛰️ حلقة مسح مدخل الصالة الخارجي: تطابق معماري ١٠٠٪ مع الممر الرئيسي");
    } else if (activeRoute === "runway-path") {
      setAltitude(8.5);
      setDroneSpeed(2.1);
      setCameraZoom(1.8);
      setYawAngle(180);
      setDroneCoords({ x: 100, y: 80 });
      setCurrentSystemLog("🏵️ ممشى زفة العروس: جاري مطابقة توزيع سجاد اللافندر وهندسة الطاولات الدائرية");
    } else if (activeRoute === "bridal-hover") {
      setAltitude(4.8);
      setDroneSpeed(0.8);
      setCameraZoom(3.2);
      setYawAngle(270);
      setDroneCoords({ x: 100, y: 30 });
      setCurrentSystemLog("👑 قبة كوشة العروس الملكية: فحص تشعيل الإضاءة والستائر الوردية الفائقة");
    }
  }, [activeRoute]);

  // Local clock generator for Saudi Riyadh time format
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString("ar-SA", { hour12: false }) + " — " + now.toLocaleDateString("ar-SA"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom image upload simulator
  const handleUploadedFile = (type: "ext" | "int", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const urlBlob = URL.createObjectURL(file);
      if (type === "ext") {
        setUploadedExtBlob(urlBlob);
        setCustomExtUrl("");
        triggerToast("📸 تم رفع صورة واجهة قاعتك الخارجية لعدسة الدرون!");
      } else {
        setUploadedIntBlob(urlBlob);
        setCustomIntUrl("");
        triggerToast("🏠 تم رفع صورة الديكور الداخلي لبرمجة التنسيقات!");
      }
      setTimeout(() => triggerToast(null), 3500);
    }
  };

  // Joystick navigation click helpers (Free flight system)
  const navigateJoystick = (direction: "up" | "down" | "left" | "right") => {
    setActiveRoute("free-pilot");
    if (direction === "up") {
      setAltitude(prev => Number(Math.min(35, prev + 1.5).toFixed(1)));
      setDroneCoords(prev => ({ ...prev, y: Math.max(10, prev.y - 12) }));
      setCurrentSystemLog("🚀 صعود حر للحوامة: تحليق في سقف القاعة لمراجعة ثريات الإضاءة الزجاجية");
    } else if (direction === "down") {
      setAltitude(prev => Number(Math.max(2, prev - 1.5).toFixed(1)));
      setDroneCoords(prev => ({ ...prev, y: Math.min(190, prev.y + 12) }));
      setCurrentSystemLog("🛬 هبوط تكتيكي للحوامة: مراجعة باقات الورود المرتصفة بجانب الطاولات النخبوية");
    } else if (direction === "left") {
      setYawAngle(prev => (prev - 15 + 360) % 360);
      setDroneCoords(prev => ({ ...prev, x: Math.max(10, prev.x - 12) }));
      setCurrentSystemLog("🔄 استدارة الكاميرا يساراً: قراءة زوايا الضيافة الفندقية وصناديق الصوت الكبيرة");
    } else if (direction === "right") {
      setYawAngle(prev => (prev + 15) % 360);
      setDroneCoords(prev => ({ ...prev, x: Math.min(190, prev.x + 12) }));
      setCurrentSystemLog("🔄 استدارة الكاميرا يميناً: مسح جدار سدو تراثي وتتابع الإضاءة الجدارية النيونية");
    }
  };

  // Active Images
  const currentPreset = VIP_PRESET_GALLERY[selectedPresetIndex] || VIP_PRESET_GALLERY[0];
  const finalExteriorImg = uploadedExtBlob || customExtUrl || currentPreset.exterior;
  const finalInteriorImg = uploadedIntBlob || customIntUrl || currentPreset.interior;

  return (
    <div className={`rounded-3xl border-2 border-amber-500/30 bg-slate-950 p-6 md:p-8 overflow-hidden relative shadow-2xl transition-all duration-700 ${isImmersiveTheater ? "ring-4 ring-amber-500/60 transform scale-[1.01]" : ""}`} dir="rtl">
      
      {/* Dynamic Laser Line across the background for ultra high-tech layout vibe */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 h-96 w-96 rounded-full bg-violet-600/[0.04] blur-[150px] pointer-events-none" />

      {/* BLOCK 1: MAJESTIC PRESENTATIVE HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 border-b border-white/10 pb-6 mb-6">
        <div className="space-y-2">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border-2 border-amber-500/30 px-3 py-1 text-xs font-black text-amber-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span>بث محاكاة طائرات الدرون الفوري للصالات • 3D Drone Real-Time Co-Simulation</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight flex flex-wrap items-center gap-x-2">
            <span>منظومة الكشف الجوي وخدمات التوريد لقاعة:</span>
            <span className="text-amber-400 font-serif decoration-amber-500/30 underline underline-offset-4 decoration-wavy">
              {venueTitle}
            </span>
          </h2>

          <p className="text-xs text-white/70 max-w-4xl leading-relaxed">
            نظام متطور يجمع بين خيال التنسيق الافتراضي وبين الواقع الحقيقي لقاعتك الفاخرة. استمتع بمشاهدة لقطات متزامنة للتحليق داخل وخارج القاعة للتأكد من تناسق توزيع باقات الزهور الهولندية الطبيعية المنسقة مع معايير الكابينة وسجاد اللافندر الملكي.
          </p>
        </div>

        {/* Audio control, intro trailers, immersive toggles */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0 pt-2 xl:pt-0">
          <button 
            onClick={() => onToggleMusic(!isMusicPlaying)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all border-2 ${
              isMusicPlaying 
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10 animate-pulse" 
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {isMusicPlaying ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4" />}
            <span>{isMusicPlaying ? "كتم الموسيقى الملكية" : "استماع للمؤثرات الصوتية 🎵"}</span>
          </button>

          <button 
            onClick={() => setIsImmersiveTheater(prev => !prev)}
            className={`p-2.5 rounded-xl border-2 transition-all ${
              isImmersiveTheater 
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md" 
                : "bg-white/5 border-white/10 text-white/60 hover:text-white"
            }`}
            title="تفعيل نمط السينما الغامرة"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* BLOCK 2: DUAL-SCREEN EXPERIMENTAL DRONE MONITOR & FLIGHT SIM PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SECTION: DUAL LIVE CAMERAS & UPLOAD ENGINE (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* THE LIVE SCREENS WRAPPER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* SCREEN 1: EXTERIOR FLIGHT CAM (خارج القاعة) */}
            <div className="relative rounded-2xl border-2 border-white/10 overflow-hidden bg-slate-900 aspect-[4/3] shadow-2xl group">
              
              {/* Image element with continuous slow zoom mimicking live flying */}
              <img 
                src={finalExteriorImg} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 ease-linear scale-100"
                style={{
                  transform: isScanningActive ? `scale(${1.1 + (droneSpeed / 30)}) translate(${Math.sin(yawAngle / 50) * 8}px, ${Math.cos(yawAngle / 50) * 8}px)` : "scale(1.1)",
                  transition: 'transform 2.8s ease-out'
                }}
                alt="Exterior Drone Screen"
              />

              {/* Dynamic HUD scan overlay vector */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 m-3.5 rounded-xl" />

              {/* Simulated scan line traverse */}
              <div className="absolute left-0 right-0 h-[2px] bg-amber-400/50 shadow-[0_0_12px_#f59e0b] top-1/3 animate-bounce pointer-events-none" style={{ animationDuration: '6s' }} />

              {/* Top corners stats */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/96 border border-amber-500/40 px-2 rounded-md text-[9px] font-mono text-amber-400 shadow-xl py-1">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>EXT-DRONE #01</span>
              </div>

              <div className="absolute top-4 left-4 bg-slate-950/90 text-white/70 text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 select-none">
                YAW: {yawAngle}° • BATT: {batteryLevel}%
              </div>

              {/* Bottom camera specs box */}
              <div className="absolute bottom-4 inset-x-4">
                <div className="bg-slate-950/90 border border-amber-500/25 p-2.5 rounded-xl backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-amber-400">الارتشاف المعماري الخارجي والقبتان</span>
                    <span className="text-[8px] font-mono text-emerald-400">ACTIVE GPS</span>
                  </div>
                  <p className="text-[9px] text-white/55 leading-tight">
                    زاوية تحليق حوامة GIGI فوق البهو وممرات مصف الطائرات والسيارات الملكية لتقدير تدفق زهور الممر الخارجي.
                  </p>
                </div>
              </div>

              {/* Upload & custom input hover trigger */}
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-white block">صورة واجهة قاعتك الخاصة</span>
                  <span className="text-[10px] text-white/50 block">ارفع صورة قاعتك من الخارج لتصبح ضمن المحاكاة الآن!</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg hover:scale-105 duration-200 transition-all flex items-center gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    <span>رفع ملف صورة 📸</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleUploadedFile("ext", e)} 
                    />
                  </label>
                </div>
              </div>

            </div>

            {/* SCREEN 2: INTERIOR FLIGHT CAM (داخل القاعة) */}
            <div className="relative rounded-2xl border-2 border-white/10 overflow-hidden bg-slate-900 aspect-[4/3] shadow-2xl group">
              
              {/* Image element with continuous slow zoom & rotation mimic */}
              <img 
                src={finalInteriorImg} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-10000 ease-linear scale-100"
                style={{
                  transform: isScanningActive ? `scale(${1.08 + (altitude / 200)}) translate(${Math.cos(yawAngle / 60) * 10}px, ${Math.sin(yawAngle / 60) * 10}px)` : "scale(1.1)",
                  transition: 'transform 2.8s ease-out'
                }}
                alt="Interior Drone Screen"
              />

              {/* Dynamic HUD scan overlay vector */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />
              <div className="absolute inset-0 pointer-events-none border-2 border-violet-500/25 m-3.5 rounded-xl" />

              {/* Simulated scan line traverse */}
              <div className="absolute left-[30%] top-0 bottom-0 w-[1.5px] bg-violet-400/50 shadow-[0_0_12px_#8b5cf6] animate-pulse pointer-events-none" />

              {/* Top corners stats */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-950/90 border border-violet-500/40 px-2 py-1 rounded-md text-[9px] font-mono text-violet-400 shadow-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-ping" />
                <span>INT-DRONE #02</span>
              </div>

              <div className="absolute top-4 left-4 bg-slate-950/90 text-white/70 text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 select-none">
                ALT: {altitude}M • ZOOM: {cameraZoom}X
              </div>

              {/* Bottom camera specs box */}
              <div className="absolute bottom-4 inset-x-4">
                <div className="bg-slate-950/90 border border-violet-500/25 p-2.5 rounded-xl backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-violet-400">الكوشة الأمامية وتتابع الزهور والممشى</span>
                    <span className="text-[8px] font-mono text-emerald-400">120 FPS STREAM</span>
                  </div>
                  <p className="text-[9px] text-white/55 leading-tight">
                    معايرة هندسية لباقات الورد المتناثرة والكوشة المذهبة وممرات الزفة لضمان ملاءمتها مع حركة العروسين وخرائط الإضاءة.
                  </p>
                </div>
              </div>

              {/* Upload & custom input hover trigger */}
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-white block">صورة الكوشة والديكور الداخلي</span>
                  <span className="text-[10px] text-white/50 block">ارفع صورة قاعتك الداخلية لدمج زوايا الورد والمنصة!</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-violet-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg hover:scale-105 duration-200 transition-all flex items-center gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    <span>رفع ملف صورة 🏠</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleUploadedFile("int", e)} 
                    />
                  </label>
                </div>
              </div>

            </div>

          </div>

          {/* ACTIVE MANUAL SELECTION FIELDS (روابط الصور المباشرة) */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white block">🔗 إدخال روابط إنترنت مباشرة لـ (قاعتك المخصصة)</span>
              <span className="text-[9px] bg-white/5 border border-white/15 px-2 py-0.5 rounded text-white/40">روابط ويب فورية</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1 text-right">
                <p className="text-[10px] text-white/60">رابط صورة الواجهة الخارجية لقاعتك:</p>
                <input 
                  type="text"
                  placeholder="https://example.com/gate.jpg ou copier-coller"
                  value={customExtUrl}
                  onChange={(e) => {
                    setCustomExtUrl(e.target.value);
                    if (e.target.value) setUploadedExtBlob("");
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-2.5 text-[10px] text-white text-left font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1 text-right">
                <p className="text-[10px] text-white/60">رابط صورة الصالة والديكور الداخلي:</p>
                <input 
                  type="text"
                  placeholder="https://example.com/interior.jpg"
                  value={customIntUrl}
                  onChange={(e) => {
                    setCustomIntUrl(e.target.value);
                    if (e.target.value) setUploadedIntBlob("");
                  }}
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-2.5 text-[10px] text-white text-left font-mono focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
            
            {/* Reset custom images action */}
            {(customExtUrl || customIntUrl || uploadedExtBlob || uploadedIntBlob) && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setCustomExtUrl("");
                    setCustomIntUrl("");
                    setUploadedExtBlob("");
                    setUploadedIntBlob("");
                    triggerToast("🔄 تم إلغاء تفعيل صور القاعة المخصصة والعودة للقاعات الملكية الافتراضية");
                    setTimeout(() => triggerToast(null), 3000);
                  }}
                  className="text-[9px] font-bold text-rose-400 hover:underline"
                >
                  استعادة صور صالات النخبة الافتراضية للبلدية
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC TELEMETRY PROGRESS & REAL-TIME MILESTONE LOG */}
          <div className="rounded-2xl border border-amber-500/20 bg-slate-950 p-4 space-y-4 shadow-xl relative overflow-hidden">
            <span className="absolute top-0 left-0 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono px-2 py-0.5 rounded-br-md">
              CO-SYNC METRICS
            </span>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-lg">
                  🚁
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">البث الافتراضي المدمج المتكامل لشبكات الدرون</h4>
                  <p className="text-[10px] text-white/50 mt-1 leading-none">مقارنة مبرمجة هندسياً لزهور السقف بخرائط الطيران المدني السعودي</p>
                </div>
              </div>

              {/* Progress bar to show drone scanning and matching with real design */}
              <div className="w-full md:w-52 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                  <span>محاكاة تطابق المظهر والكميات:</span>
                  <span className="font-bold">{isScanningActive ? "٨٨.٢٪ وجاري المسح..." : "متوقف مؤقتاً"}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full ${isScanningActive ? "w-[88%] animate-pulse" : "w-[60%]"}`} />
                </div>
              </div>
            </div>

            {/* Simulated Live System Log text box inside flight controller */}
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-[11px] text-white/80 leading-relaxed font-sans text-right flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span>{currentSystemLog}</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SECTION: REAL-TIME FLIGHT JOYSTICK, PRESETS & GIGI SERVICES (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* ROYAL PRESETS DOCK */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-4 space-y-3">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 pb-1 border-b border-white/5">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>اختيار قاعة من النخبة الفاخرة للبلاد:</span>
            </h4>
            
            <div className="space-y-2">
              {VIP_PRESET_GALLERY.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    triggerToast(`📍 تم تموضع الكاميرا والدرون فوق: ${v.name}`);
                    setTimeout(() => triggerToast(null), 3000);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-right text-xs transition-all flex flex-col justify-between ${
                    selectedPresetIndex === idx 
                      ? "border-amber-400 bg-amber-500/[0.05] text-amber-400 font-bold" 
                      : "border-white/5 bg-slate-950/40 text-white/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{v.name}</span>
                    <span className="text-[9px] opacity-70 font-mono">#{idx+1}</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-normal mt-1">{v.specs}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC VIRTUAL FLIGHT STEERING (المقود والملاحة التفاعلية) */}
          <div className="rounded-2xl border-2 border-amber-500/20 bg-slate-950 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase flex items-center gap-1">
                <Compass className="h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>برج التحكم والملاحة بالدرون للعرش</span>
              </span>
              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 uppercase font-mono">
                INTERACTIVE
              </span>
            </div>

            <p className="text-[11px] text-white/50 leading-tight">
              أنت الطيار الفعلي الآن! تفضل بتوجيه طائرة الاستكشاف اللاسلكية فوق ممرات الطاولات وكوشة العروس لكشف ملامح وهندسة الأسقف:
            </p>

            {/* INTERACTIVE JOYSTICK CONTROLS GRID */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="relative h-32 w-32 rounded-full border-2 border-white/10 bg-slate-900 flex items-center justify-center p-1 shadow-inner">
                
                {/* Active vector lines to look like screen joystick finder */}
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/10 pointer-events-none animate-spin" style={{ animationDuration: '20s' }} />

                {/* Joystick buttons */}
                <button 
                  onClick={() => navigateJoystick("up")}
                  className="absolute top-1.5 bg-slate-950/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 hover:border-amber-400 p-2 rounded-xl transition-all shadow"
                  title="صعود وتصوير السقف والمصابيح"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => navigateJoystick("down")}
                  className="absolute bottom-1.5 bg-slate-950/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 hover:border-amber-400 p-2 rounded-xl transition-all shadow"
                  title="هبوط وتصوير الزهور والسجاد"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => navigateJoystick("left")}
                  className="absolute right-1.5 bg-slate-950/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 hover:border-amber-400 p-2 rounded-xl transition-all shadow"
                  title="استدارة الكاميرا يساراً"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => navigateJoystick("right")}
                  className="absolute left-1.5 bg-slate-950/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/10 hover:border-amber-400 p-2 rounded-xl transition-all shadow"
                  title="استدارة الكاميرا يميناً"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Center Core Drone Marker */}
                <div className="h-10 w-10 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-bold text-xs shadow-lg animate-pulse">
                  🚁
                </div>
              </div>
            </div>

            {/* PRESET FLIGHT ROUTE AUTOMATIONS */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-white/40 block">الرحلات الجوية المجدولة في القاعة:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "entrance-sweep", name: "البهو الخارجي" },
                  { id: "runway-path", name: "ممشى الزفة" },
                  { id: "bridal-hover", name: "قبة الكوشة" }
                ].map((route) => (
                  <button
                    key={route.id}
                    onClick={() => {
                      setActiveRoute(route.id as FlightRoute);
                      triggerToast(`🛰️ تم إيقاظ وربط النظام بمسار: ${route.name}`);
                      setTimeout(() => triggerToast(null), 3000);
                    }}
                    className={`px-1.5 py-2 rounded-lg border text-[10px] font-black transition-all ${
                      activeRoute === route.id
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-white/5 border-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {route.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BLOCK 3: BEAUTIFUL GIGI SPACIAL LOGISTICS SERVICES SUMMARY FOR EXQUISITE FIRST IMPRESSIONS */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 p-5 space-y-4">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>ما نقدمه لأصحاب القاعات وعائلات النخبة 👑</span>
            </h4>

            <p className="text-[11px] text-white/50 leading-relaxed">
              لسنا مجرد معرض زهور عادي، نحن مؤسسة هندسية متكاملة لجمال ومسح صالات الأفراح ودمج الطيف البرمجي:
            </p>

            <div className="space-y-3.5 pt-1">
              {[
                {
                  emoji: "🛰️",
                  title: "تصوير ومسح جوي بالدرون (4K Laser Drone Scanning)",
                  desc: "مطابقة تمدد الورد المعلق ومكافحة توهج الكشافات البصرية بشكل يحير العقل"
                },
                {
                  emoji: "🥀",
                  title: "استيراد طازج ومباشر من مزارع هولندا (Super-Luxe Import)",
                  desc: "ورود لافندر وأوركيد هولندي طبيعي مميز تظل يانعة برائحة دافئة طيلة الساعات"
                },
                {
                  emoji: "⚙️",
                  title: "مطابقة تامة للمقاييس والجمارك (KSA Compliance Grid)",
                  desc: "ترتيب الحوامل تلسكوبياً وسجاد ممرات الزفة وفق لوائح البلدية السعودية والجمارك"
                }
              ].map((serv, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="text-base shrink-0">{serv.emoji}</span>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[11px] font-black text-white block leading-tight">{serv.title}</span>
                    <span className="text-[10px] text-white/40 block leading-relaxed">{serv.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* EPIC CINEMATIC FULL SCREEN TRAILER DIALOG / OVERLAY OVERLAY */}
      {showEpicIntroTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fade-in" dir="rtl">
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px] animate-pulse" />
            <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px] animate-pulse" />
          </div>

          <div className="relative w-full max-w-4xl bg-slate-900/50 border border-amber-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl overflow-hidden z-10 max-h-[95vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-spin" style={{ animationDuration: '6s' }}>
                  <Orbit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">العرض السينمائي المذهل لـ GIGI FLOWERS</h3>
                  <p className="text-[10px] text-amber-400/80">فيلم محاكاة الأبعاد وتوريد النخبة للقاعات الفخمة في السعودية</p>
                </div>
              </div>

              <button 
                onClick={() => setShowEpicIntroTrailer(false)}
                className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CINEMATIC VIDEO SCREEN SIMULATOR */}
            <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-amber-500/20 overflow-hidden flex flex-col justify-between p-6">
              
              {/* Sweeping camera movement container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
                
                {/* 3D Wireframe Drone Fly-through sweep animation mockup */}
                <div className="absolute inset-0 opacity-15 overflow-hidden">
                  <svg className="w-full h-full text-amber-500 animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.1" />
                    <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.1" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.1" />
                  </svg>
                </div>

                <div className="space-y-4 max-w-lg z-10 animate-fade-in_up">
                  <div className="text-xs bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded inline-block">
                    PROJECTION ACTIVATED (L-4940)
                  </div>
                  
                  {/* Majestic bold message */}
                  <h4 className="text-xl md:text-3xl font-black text-white leading-tight">
                    أهلاً بك في مستقبل الأفراح وتصميم الصالات الفاخرة ⚜️
                  </h4>

                  <p className="text-xs text-white/70">
                    يجري الطيران الافتراضي فوق صالات النخبة بالدقة المتناهية. شاهد باقات اللافندر الطبيعي والتنسيقات الهولوجرامية تتناسق بدقة مليمترية وفقاً لشكل الوجار، والدرج وممشى الزفة الكلاسيكي المضيء.
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/5">
                      ✓ تماسك تام مع الكود المعماري
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold border border-amber-500/20 px-2 py-0.5 rounded bg-amber-500/5">
                      ✓ زينة زهور هولندية طازجة
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE COUNTER TIMER ON INTRO STYLING */}
              <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-white/50 w-full bg-slate-950/80 border border-white/5 px-3 py-2 rounded-xl backdrop-blur-sm">
                <div>AUDIO ACCENT: ACTIVE (SWEETS REVERB)</div>
                <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>PREVIEW STREAM 4K</span>
                </div>
              </div>

            </div>

            {/* Quick-play Sound selector and Action footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="text-xs text-white/50 text-right">
                <span className="text-white block font-bold">أثير الصوت الملكي المحيطي:</span>
                انقر على خيارات الموسيقى لمزامنة عرضك الحسي وصوت كؤوس الضيافة.
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onToggleMusic(!isMusicPlaying);
                    triggerToast(isMusicPlaying ? "🔇 تم كتم المقطوعة الكلاسيكية" : "🎵 تم تفعيل المقطوعة الموسيقية الملكية للتخطيط الإبداعي");
                    setTimeout(() => triggerToast(null), 3000);
                  }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isMusicPlaying ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isMusicPlaying ? "كتم الصوت" : "تشغيل الموسيقى الملكية"}</span>
                </button>

                <button 
                  onClick={() => setShowEpicIntroTrailer(false)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.03]"
                >
                  العودة لمنصة الهندسة التفاعلية ثلاثية الأبعاد
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
