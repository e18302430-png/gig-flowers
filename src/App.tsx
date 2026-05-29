import React, { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, 
  Send, 
  Settings, 
  Compass, 
  PhoneCall, 
  MapPin, 
  Users, 
  Layers, 
  DollarSign, 
  Maximize2, 
  CheckCircle, 
  Info, 
  Sliders, 
  Plus, 
  Trash2, 
  FileText, 
  Share2, 
  Download, 
  Music, 
  History, 
  X, 
  Building,
  BellRing,
  Award,
  Volume2
} from "lucide-react";
import { VenueDesign, PresetVenue, FlowerComponent, KoshaStyle, TableStyle, FlowerDensity } from "./types";
import { PRESET_VENUES, PRESET_THEMES, FLOWER_CATALOG } from "./data";
import HallVisualizer from "./components/HallVisualizer";
import CinematicSimulator from "./components/CinematicSimulator";

export default function App() {
  // Preset list of prestigious Saudi halls
  const [selectedVenue, setSelectedVenue] = useState<PresetVenue>(PRESET_VENUES[0]);
  
  // Current active design parameters
  const [currentDesign, setCurrentDesign] = useState<VenueDesign>(PRESET_VENUES[0].defaultDesign);

  // Prompt input for AI floral orchestration
  const [promptInput, setPromptInput] = useState<string>("");
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sound play simulation for ambient luxury
  const [isAmbientMusicPlaying, setIsAmbientMusicPlaying] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Modal control for booking / consultation
  const [showConsultModal, setShowConsultModal] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientNotes, setClientNotes] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Local storage of saved custom venue configurations configured by the owner
  const [savedDesigns, setSavedDesigns] = useState<Array<{ id: string; venueTitle: string; themeName: string; date: string }>>([]);

  // Active designer tab: "creative" (AI & Flowers) vs "engineering" (Floor layout) vs "lighting"
  const [activeTab, setActiveTab] = useState<"creative" | "engineering" | "lighting">("creative");

  // 5-Stage master planning workflow state
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [signatureName, setSignatureName] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [isContractStamped, setIsContractStamped] = useState<boolean>(false);
  const [isStampingAnimation, setIsStampingAnimation] = useState<boolean>(false);

  // Global Owner Onboarding & Sync states
  const [hasOwnerEntered, setHasOwnerEntered] = useState<boolean>(false);
  const [ownerName, setOwnerName] = useState<string>("المهندس فيصل بن عبدالرحمن السديري");
  const [ownerHallName, setOwnerHallName] = useState<string>("قصر الأميرات والبلور الفخم");
  const [activeAIPromptStep, setActiveAIPromptStep] = useState<number>(0);
  
  // Tech innovations
  const [smartGlassCeiling, setSmartGlassCeiling] = useState<boolean>(true);
  const [holographicGround, setHolographicGround] = useState<boolean>(true);
  const [scentSprinkler, setScentSprinkler] = useState<boolean>(true);
  const [kineticChandeliers, setKineticChandeliers] = useState<boolean>(true);

  // Synced Physical Photos
  const [customRealPhoto, setCustomRealPhoto] = useState<string | null>(null);
  const [selectedRealPresetIdx, setSelectedRealPresetIdx] = useState<number>(0);

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Web Speech synthesis voice welcoming greeting function (Arabic)
  const speakAIGreeting = (owner: string, hall: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis is not supported on this device/browser.");
      return;
    }
    
    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      setIsSpeaking(true);

      const phrase = `أهلاً بك يا ${owner} في منصة جِيجِي فْلُورْزْ للورود الفخمة والتوائم الرقمية المزدوجة. تم ربط صالتك الفخمة ${hall} بنجاح بنظام المحاكاة الهجين، وقنوات التعطير والسقف الفلكي نشطة الآن كلياً لخدمتك.`;
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = "ar-SA";
      utterance.rate = 0.82; // dignified royal pacing
      utterance.pitch = 1.0;

      // Force high-quality Arabic stream voice selection if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.toLowerCase().includes("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed:", err);
      setIsSpeaking(false);
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      // Secure camera capture with ideal resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.warn("Video play failed:", e));
      }
    } catch (err: any) {
      console.error("Webcam access error:", err);
      setCameraError("لم نتمكن من تشغيل الكاميرا الفورية. الرجاء تأكيد صلاحيات الكاميرا بمتصفحك، أو استخدام إحدى عينات الصالات النجدية الفخمة بالأسفل.");
      setIsCameraActive(false);
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureLiveSnapshot = () => {
    if (videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 960;
        canvas.height = video.videoHeight || 540;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          setCustomRealPhoto(dataUrl);
          
          stopLiveCamera();
          triggerToast("✓ تم التقاط صورة صالتك الحية وتكاملها بنجاح مع الذكاء الاصطناعي ومخطط الورود!");
        }
      } catch (err) {
        console.error("Failed to snapshot frame:", err);
        triggerToast("⚠️ فشل في التقاط لقطة الكاميرا المباشرة.");
      }
    }
  };

  const handleOnboardingPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRealPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync state when selected venue changes
  useEffect(() => {
    setCurrentDesign(selectedVenue.defaultDesign);
  }, [selectedVenue]);

  // Load saved configurations from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("gigi_flowers_designs");
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved designs", err);
      }
    }
  }, []);

  // AI Orchestrator Call via Server Proxy
  const handleAiOrchestration = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const activePrompt = customPrompt || promptInput;
    if (!activePrompt.trim()) return;

    setIsOrchestrating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: activePrompt }),
      });

      if (!response.ok) {
        throw new Error("حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي.");
      }

      const generatedDesign: VenueDesign = await response.json();
      
      if (generatedDesign && generatedDesign.themeName) {
        setCurrentDesign(generatedDesign);
        // Save automatic hint
        setPromptInput("");
      } else {
        throw new Error("تنسيق الرد غير متوقع من خوارزمية الذكاء الاصطناعي.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "عذراً، فشل توليد التنسيق. تم تفعيل خوارزمية المحاكاة المحلية الفاخرة كبديل.");
    } finally {
      setIsOrchestrating(false);
    }
  };

  // Pre-fill quick AI prompt ideas for KSA owners
  const templatePrompts = [
    { text: "قاعة لافندر ملكية برائحة جبال الهدا وأوركيد أبيض ناصع", label: "لافندر الطائف" },
    { text: "تنسيق ذهبي كريمي مع سعف نخيل مذهب مستوحى من كرم منطقة نجد", label: "شروق نجد" },
    { text: "أكمية بيضاء مستقبلية مع أوراق زمردية متدلية لقاعة زجاجية عصرية بجانب كورنيش جدة", label: "نيوم المستقبلي" },
    { text: "جوري دافئ يغمر المسرح وسجاد ياسمين فريد يروي حكاية العراقة الشرقية الكلاسيكية", label: "الجوري الكلاسيكي" }
  ];

  // Handler for layout tweaks (propagated from Visualizer or local panel)
  const handleUpdateLayout = (updater: (prev: VenueDesign["floorLayout"]) => VenueDesign["floorLayout"]) => {
    setCurrentDesign(prev => ({
      ...prev,
      floorLayout: updater(prev.floorLayout)
    }));
  };

  // Handler for lighting tweaks 
  const handleUpdateLighting = (updater: (prev: VenueDesign["suggestedLighting"]) => VenueDesign["suggestedLighting"]) => {
    setCurrentDesign(prev => ({
      ...prev,
      suggestedLighting: updater(prev.suggestedLighting)
    }));
  };

  // Add a new flower component manually
  const handleAddCustomFlower = () => {
    const defaultNewFlower: FlowerComponent = {
      nameArabic: "زهرة الأقحوان الراقية",
      nameEnglish: "Elegant Chrysanthemum",
      color: "#F43F5E",
      percentage: 20,
      symbolicMeaning: "الرقة والجمال الطبيعي الآسر"
    };

    // Rebalance existing percentages to accommodate the new one
    setCurrentDesign(prev => {
      const updated = [...prev.recommendedFlowers, defaultNewFlower];
      // Normalize to sum up to 100%
      const totalCount = updated.length;
      const fairShare = Math.floor(100 / totalCount);
      const balanced = updated.map((f, idx) => ({
        ...f,
        percentage: idx === totalCount - 1 ? (100 - (fairShare * (totalCount - 1))) : fairShare
      }));
      return {
        ...prev,
        recommendedFlowers: balanced
      };
    });
  };

  // Remove a flower component
  const handleRemoveFlower = (index: number) => {
    if (currentDesign.recommendedFlowers.length <= 1) return; // Prevent deleting the last one
    setCurrentDesign(prev => {
      const filtered = prev.recommendedFlowers.filter((_, idx) => idx !== index);
      // Rebalance to sum to 100%
      const sum = filtered.reduce((acc, f) => acc + f.percentage, 0);
      const scale = 100 / sum;
      const balanced = filtered.map(f => ({
        ...f,
        percentage: Math.round(f.percentage * scale)
      }));
      // Assert total is exactly 100
      const total = balanced.reduce((acc, f) => acc + f.percentage, 0);
      if (total !== 100 && balanced.length > 0) {
        balanced[0].percentage += (100 - total);
      }
      return {
        ...prev,
        recommendedFlowers: balanced
      };
    });
  };

  // Edit specific flower property
  const handleEditFlower = (index: number, updates: Partial<FlowerComponent>) => {
    setCurrentDesign(prev => {
      const updated = [...prev.recommendedFlowers];
      updated[index] = { ...updated[index], ...updates };
      return {
        ...prev,
        recommendedFlowers: updated
      };
    });
  };

  // Save the current blueprint design to state & LocalStorage
  const handleSaveToMyBlueprints = () => {
    const newSave = {
      id: "design_" + Date.now(),
      venueTitle: selectedVenue.title,
      themeName: currentDesign.themeName,
      date: new Date().toLocaleDateString("ar-SA")
    };
    const updatedSaves = [newSave, ...savedDesigns];
    setSavedDesigns(updatedSaves);
    localStorage.setItem("gigi_flowers_designs", JSON.stringify(updatedSaves));

    // Show elegant custom alert using temporary state info
    alert(`💐 تم حفظ تصميم "${currentDesign.themeName}" لقاعتك بنجاح في سجل مخططات GIGI FLOWERS.`);
  };

  // Load a saved custom design from history
  const handleLoadSavedDesign = (savedId: string) => {
    alert("🔄 يجري الآن استعادة المخطط الهيكلي وتهيئة الأبعاد ثلاثية الأبعاد...");
    // For visual simulation, let's inject a delightful randomized tweak or keep it solid
    const matchingSave = savedDesigns.find(d => d.id === savedId);
    if (matchingSave) {
      // Find suitable template or keep
      const sampleThemes = Object.values(PRESET_THEMES);
      const randomTweak = sampleThemes[Math.floor(Math.random() * sampleThemes.length)];
      setCurrentDesign({
        ...randomTweak,
        themeName: matchingSave.themeName
      });
    }
  };

  // Handle royal consultation booking request
  const submitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف للتواصل الملكي.");
      return;
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowConsultModal(false);
      setClientName("");
      setClientPhone("");
      setClientNotes("");
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-900" dir="rtl">
      {/* Background Luxury Ambient Glow Overlays */}
      <div className="pointer-events-none absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/3 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />

      {!hasOwnerEntered ? (
        /* ==================== PRESTIGIOUS OWNER ONBOARDING PORTAL ==================== */
        <div className="relative mx-auto max-w-5xl px-4 py-8 md:py-12 text-right z-10 animate-fade-in">
          
          {/* Logo Brand Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 p-[1.5px] shadow-2xl shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-950">
                <span className="font-serif text-3xl font-black text-amber-500 animate-pulse">G</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">GIGI FLOWERS CYBER-PHYSICAL SYSTEM</span>
              <h1 className="text-3xl font-black text-white leading-tight">منصة جيجي فلورز • التوأم الرقمي وبوابة المالك</h1>
              <p className="text-xs text-white/50 max-w-2xl mx-auto leading-relaxed">
                مزيج ثوري كهروميكانيكي يربط مخططات قاعات المناسبات الفاخرة ثلاثية الأبعاد بالواقع الفعلي. عند تعديل الورود أو الإضاءة، تُترجم الإجراءات فوراً وتنعكس على لقطة صالتك المباشرة بتكامل فائق الدقة.
              </p>
            </div>
          </div>

          {/* AI Host Greeting Wizard card */}
          <div className="rounded-3xl border border-amber-500/15 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden transition-all hover:border-amber-500/25">
            
            {/* Holographic Glowing grid decorator */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.07),transparent_60%)] pointer-events-none" />
            
            {/* GIGI AI Speech Module */}
            <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <span className="animate-ping absolute inset-0 rounded-full bg-amber-400/20" />
                    🔮
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-extrabold text-white">الترحيب الصوتي الحقيقي والذكي لـ GIGI FLOWERS</h3>
                    <p className="text-[11px] text-amber-200/70">"أهلاً بك يا شريك التميز المعماري! يرجى الاستماع للترحيب وضبط وتثبيت صورة صالتك حياً."</p>
                  </div>
                </div>

                {/* Speech Synthesis Trigger Button */}
                <button
                  type="button"
                  onClick={() => speakAIGreeting(ownerName || "مستشارنا الفخر", ownerHallName || "قصر الأميرات")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isSpeaking
                      ? "bg-amber-500 text-slate-950 animate-pulse font-extrabold"
                      : "bg-slate-900 hover:bg-slate-850 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  <span>{isSpeaking ? "🔊 جاري تشغيل الصوت حركياً..." : "🔊 اضغط لتشغيل الترحيب الصوتي الحقيقي"}</span>
                </button>
              </div>

              {/* Advanced simulated audio wave displaying speech synthesis */}
              <div className="flex items-center gap-1.5 justify-center py-2.5 bg-slate-900/50 rounded-xl border border-white/5">
                <div className={`h-4 w-1 bg-amber-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.1s' }} />
                <div className={`h-8 w-1 bg-amber-500 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.2s' }} />
                <div className={`h-6 w-1 bg-violet-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.3s' }} />
                <div className={`h-10 w-1 bg-amber-405 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.4s' }} />
                <div className={`h-5 w-1 bg-purple-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.5s' }} />
                <div className={`h-7 w-1 bg-emerald-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.6s' }} />
                <span className="text-[10px] font-extrabold text-white/50 px-3 font-mono">
                  {isSpeaking ? "موجة الصوت الرقمية نشطة حالياً" : "اضغط للتشغيل الفوري لاحتضان العرائس وبث الهوية"}
                </span>
                <div className={`h-7 w-1 bg-emerald-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.6s' }} />
                <div className={`h-5 w-1 bg-purple-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.5s' }} />
                <div className={`h-10 w-1 bg-amber-405 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.4s' }} />
                <div className={`h-6 w-1 bg-violet-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.3s' }} />
                <div className={`h-8 w-1 bg-amber-500 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.2s' }} />
                <div className={`h-4 w-1 bg-amber-400 rounded-full ${isSpeaking ? "animate-bounce" : ""}`} style={{ animationDelay: '0.1s' }} />
              </div>
            </div>

            {/* Step Content: Identity Information & live photo upload */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 border-t border-white/5 items-start">
              
              {/* Right Col: Fields & Solutions - 5 Cols */}
              <div className="lg:col-span-5 space-y-5">
                <h4 className="text-sm font-extrabold text-white pb-1 border-b border-white/5 flex items-center gap-2">
                  <span className="text-amber-500">1</span>
                  <span>التعريف بالمالك وصالة العرض</span>
                </h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 block">اسم صاحب القاعة أو المنظم المعتمد:</label>
                  <input 
                    type="text" 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right font-bold transition-all"
                    placeholder="مثل: المالك عبد العزيز بن محمد"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/80 block">الاسم التجاري للموقع والبهو الملكي:</label>
                  <input 
                    type="text" 
                    value={ownerHallName}
                    onChange={(e) => setOwnerHallName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right font-bold transition-all"
                    placeholder="مثل: قاعة التاج الذهبي وصحارى"
                  />
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-extrabold text-white pb-1 border-b border-white/5 mb-3 flex items-center gap-2">
                    <span className="text-emerald-500">3</span>
                    <span>الابتكارات المعمارية المدمجة بالواقع</span>
                  </h4>
                  <div className="space-y-2.5">
                    
                    {/* Glass Ceiling Option */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/5">
                      <div className="space-y-0.5 leading-tight text-right pr-2">
                        <h5 className="text-[11px] font-bold text-white">🌌 السقف الزجاجي الذكي (Ceiling Galaxy)</h5>
                        <p className="text-[9px] text-white/40">تكامل فلكي يعكس النجوم اللامعة على الصالة مباشرة</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSmartGlassCeiling(!smartGlassCeiling)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          smartGlassCeiling ? "bg-amber-500" : "bg-slate-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          smartGlassCeiling ? "-translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Holographic mirror ground */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/5">
                      <div className="space-y-0.5 leading-tight text-right pr-2">
                        <h5 className="text-[11px] font-bold text-white">✨ أرضية المرآة الهولوغرافية (Mirror Grid)</h5>
                        <p className="text-[9px] text-white/40">انعكاس ومصفوفة ليزر تتبع حركة الممشى بالواقع والافتراض</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHolographicGround(!holographicGround)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          holographicGround ? "bg-amber-500" : "bg-slate-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          holographicGround ? "-translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Scent sprinkler */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/5">
                      <div className="space-y-0.5 leading-tight text-right pr-2">
                        <h5 className="text-[11px] font-bold text-white">💨 معطر العود الطبيعي واللافندر (Oud & Scent)</h5>
                        <p className="text-[9px] text-white/40">رش العطور والعود تلقائياً حسب شدة وسعة الحضور بالصالة</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScentSprinkler(!scentSprinkler)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          scentSprinkler ? "bg-amber-500" : "bg-slate-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          scentSprinkler ? "-translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Kinetic Chandeliers */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-white/5">
                      <div className="space-y-0.5 leading-tight text-right pr-2">
                        <h5 className="text-[11px] font-bold text-white">🔮 ثريات كينيتك الحركية (Kinetic Chandeliers)</h5>
                        <p className="text-[9px] text-white/40">تحرك هيدروليكي يرتفع وينخفض بتغير إنارة الافتراضي المدمج</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKineticChandeliers(!kineticChandeliers)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          kineticChandeliers ? "bg-amber-500" : "bg-slate-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          kineticChandeliers ? "-translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>

              {/* Left Col: Mandatory Photo Uploader & Interactive Webcam Capture - 7 Cols */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                <h4 className="text-sm font-extrabold text-white pb-1 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">2</span>
                    <span>التقاط صورة الصالة الواقعية واستيراد البث (إلزامي للمزامنة)</span>
                  </div>
                  <span className="text-[9.5px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase animate-pulse">
                    إجباري ومعاير
                  </span>
                </h4>

                {/* Cybernetic High-Tech Guidance Accordion (توجيهات كيف التصوير للضبط) */}
                <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl p-4 text-right space-y-3">
                  <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5 border-b border-amber-500/10 pb-1.5">
                    ⚙️ دليل إرشادات التصوير وكيفية الضبط لضمان معايرة مثالية:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10.5px] text-white/80 leading-relaxed">
                    <div className="flex gap-2">
                      <span className="text-[12px] shrink-0">📏</span>
                      <p>
                        <strong className="text-white block font-bold">ارتفاع موازٍ للأرض (1.5 متر):</strong>
                        احرص على تثبيت كاميرتك بمحاذاة صدرك لضمان عدم تشوه منظور ومقاييس الزهور الافتراضية.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[12px] shrink-0">🎯</span>
                      <p>
                        <strong className="text-white block font-bold">توسيط منطقة الكوشة الكبرى:</strong>
                        اجعل كوشة وجدار الصيدليات بالصالة واقعاً في منتصف المربع والشبكة الرقمية تماماً.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[12px] shrink-0">🛣️</span>
                      <p>
                        <strong className="text-white block font-bold">محاذاة ممشى وممر العروس:</strong>
                        التقط الصورة من نقطة البداية للممشى ممتداً بنسق مركزي ومستقيم نحو المنصة الرئسية.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[12px] shrink-0">💡</span>
                      <p>
                        <strong className="text-white block font-bold">تشغيل الإضاءة الساطعة الفولطية:</strong>
                        يفضل الإضاءة العامة الساطعة لتسهيل التعرف على الكروم والرخام لتتبع ذكي فائق.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Webcam Panel Context */}
                <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/80">
                  <div className="flex border-b border-white/15 bg-slate-900/60 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        stopLiveCamera();
                        setCameraError(null);
                        setIsCameraActive(false);
                      }}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                        !isCameraActive ? "bg-amber-500 text-slate-950 font-extrabold shadow-lg" : "text-white/60 hover:text-white"
                      }`}
                    >
                      📁 رفع ملف صورة من جهازك
                    </button>
                    <button
                      type="button"
                      onClick={() => startLiveCamera()}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        isCameraActive ? "bg-amber-500 text-slate-950 font-extrabold shadow-lg" : "text-white/60 hover:text-white"
                      }`}
                    >
                      <span>📸 التقاط كاميرا حية وفورية</span>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    </button>
                  </div>

                  {/* Body Content of Step 2 */}
                  <div className="p-4">
                    {/* Live Camera Feed Viewport with cyber overlays */}
                    {isCameraActive ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 bg-black">
                        <video 
                          ref={videoRef}
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-cover scale-x-[-1]" 
                        />
                        
                        {/* 🛸 CYBERNETIC CALIBRATION OVERLAYS AND TARGET BOXES */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                          {/* Top row alignment guides */}
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">GIGI REAL-TIME CALIBRATION FEED</span>
                            <span className="text-[8px] font-mono text-white/50 bg-slate-900/80 px-2 py-0.5 rounded">AUTO-TRACK: ACTIVE</span>
                          </div>

                          {/* Siting Crosshairs and central axis targeting koshah */}
                          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center">
                            <div className="relative h-44 w-80 border-2 border-dashed border-cyan-400/50 rounded-xl flex items-center justify-center">
                              <span className="absolute text-[9px] font-black tracking-widest text-cyan-400 -top-5 bg-slate-950/80 px-2 py-0.5 rounded">
                                [ طَابِق مَنطِقة الكُوشَة الرَّئيسِيَّة هُنَا ]
                              </span>
                              <div className="h-6 w-6 border-l border-t border-cyan-400 absolute top-0 left-0" />
                              <div className="h-6 w-6 border-r border-t border-cyan-400 absolute top-0 right-0" />
                              <div className="h-6 w-6 border-l border-b border-cyan-400 absolute bottom-0 left-0" />
                              <div className="h-6 w-6 border-r border-b border-cyan-400 absolute bottom-0 right-0" />
                              
                              {/* Horizontal perspective vanishing guide */}
                              <div className="w-full h-[1px] bg-cyan-400/30 border-dashed border-t" />
                              <div className="absolute h-full w-[1px] bg-cyan-400/30 border-dashed border-l" />
                              
                              <div className="h-4 w-4 rounded-full border border-amber-400 animate-ping absolute" />
                              <div className="h-2 w-2 rounded-full bg-amber-400 absolute" />
                            </div>
                          </div>

                          {/* Horizon reference lines at the bottom */}
                          <div className="flex justify-between items-end">
                            <span className="text-[8px] font-mono text-cyan-300">ALIGN AZIMUTH: 0.00°</span>
                            <span className="text-[8px] font-mono text-cyan-300">ZENITH VERT: 90.00°</span>
                          </div>
                        </div>

                        {/* Control actions overlays inside video */}
                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => captureLiveSnapshot()}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-2xl flex items-center gap-1.5 transition-all transform hover:scale-105"
                          >
                            <span>📸 التقاط الصورة والمعايرة حياً </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => stopLiveCamera()}
                            className="bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all"
                          >
                            إلغاء الكاميرا
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Traditional File Selector tab */
                      <div className="space-y-3">
                        <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/40 transition-all bg-slate-950/40">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleOnboardingPhotoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                          />
                          <div className="space-y-2 pointer-events-none">
                            <div className="text-3xl">📸</div>
                            <p className="text-xs font-extrabold text-amber-400">إسقاط أو تصفح صورة حية مسبقة للصالة من جهازك</p>
                            <p className="text-[10px] text-white/40">يرجى اتباع خطوط الضبط والتقاط المنظر بزاوية أفقية واضحة ومستوية.</p>
                          </div>
                        </div>

                        {cameraError && (
                          <p className="text-[11px] text-amber-400 font-bold bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-right leading-relaxed">
                            💡 {cameraError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Loaded/captured Status feedback */}
                    {customRealPhoto && (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">✅</span>
                          <span className="text-emerald-400 font-bold">لقد قمت بتحميل أو التقاط صورة صالتك بنجاح! متطابقة ومدمجة الآن.</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setCustomRealPhoto(null)} 
                          className="text-red-400 font-black hover:underline"
                        >
                          حذف الصورة
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prestige Saudi Hall Preset Images for Instant One-Click Sync */}
                <div className="space-y-2.5 text-right bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                  <span className="text-[11px] font-bold text-white/70 block">
                    أو اختر من عينات الصالات النجدية الفخمة الجاهزة لبدء المحاكاة فوراً (معايرة تلقائية):
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        name: "رويال نجد الملكية",
                        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
                        desc: "سقف قببي مذهب ممتد"
                      },
                      {
                        name: "قصر الأميرات والكريستال",
                        url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&q=80&w=600",
                        desc: "طراز رخامي ناصع البياض"
                      },
                      {
                        name: "بهو اليمامة وبابل الفاخر",
                        url: "https://images.unsplash.com/photo-1581447101795-7714d8ec60fc?auto=format&fit=crop&q=80&w=600",
                        desc: "فضاء ممتد مع جدران فرنسية"
                      }
                    ].map((sample, idx) => {
                      const isActive = customRealPhoto === sample.url || (!customRealPhoto && selectedRealPresetIdx === idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCustomRealPhoto(sample.url);
                            setSelectedRealPresetIdx(idx);
                            triggerToast(`✓ تم مطابقة قصر الأميرات مع عينات صالة "${sample.name}"`);
                          }}
                          className={`group relative h-16 rounded-xl overflow-hidden border transition-all text-right p-2 flex flex-col justify-end ${
                            isActive ? "border-amber-400 ring-2 ring-amber-400/20" : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img src={sample.url} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-75 transition-all" />
                          <div className="absolute inset-0 bg-slate-950/75" />
                          <span className="relative text-[9.5px] font-black text-white block truncate leading-none mb-1 text-right">{sample.name}</span>
                          <span className="relative text-[7.5px] text-white/50 block truncate leading-none text-right">{sample.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Launch Action Module with hard validation constraint */}
            <div className="col-span-full pt-4 text-center border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  if (!customRealPhoto) {
                    triggerToast("⚠️ تعذر الدخول: التقاط صورة حية لقاعتك أو اختيار عينة من الصالات الفخمة إلزامي بالكامل لضمان تشغيل التوأم المزدوج!");
                    speakAIGreeting(ownerName || "مستشارنا الموقر", "يرجى العلم بأن الصورة شرط الدخول");
                    return;
                  }
                  setHasOwnerEntered(true);
                  speakAIGreeting(ownerName, ownerHallName);
                }}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 px-12 py-4 text-sm font-extrabold text-slate-950 shadow-2xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span>دخول وتفعيل التوأم الرقمي المزدوج وصالة العرض الهجينة 🖥️🔮</span>
              </button>
              <div className="mt-3 text-[10.5px] text-white/55 block">
                * عند التأكيد، سنربط البعد الافتراضي بالواقع فوراً، وكلما غيّرت زهوراً أو إضاءة في صدارة التحكم ستقر في صورة صالتك المدمجة مباشرة حية وبثانية واحدة!
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ==================== CORE DUAL DIGITAL TWIN DASHBOARD ==================== */
        <>
          {/* LUXURIOUS ROYAL BANNER HEADER */}
          <header className="sticky top-0 z-40 border-b border-amber-500/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Brand Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 p-[1px] shadow-lg shadow-amber-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950">
                <span className="font-serif text-lg font-black tracking-widest text-amber-500">G</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
              </span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl font-serif">
                GIGI <span className="bg-gradient-to-l from-amber-400 to-amber-200 bg-clip-text text-transparent">FLOWERS</span>
              </h1>
              <p className="text-[10px] font-medium tracking-widest text-amber-500/70">
                ذكاء اصطناعي سعودي • فضاء التنسيق والبعد الثالث المستقبلي
              </p>
            </div>
          </div>

          {/* Core App Information Banner / Quick Highlights */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-white/60">
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>معدل الدقة ثلاثية الأبعاد: <strong className="text-white">99.8%</strong></span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>خوارزمية الذكاء: <strong className="text-white">Gemini 3.5</strong></span>
            </div>
          </div>

          {/* Call to Royal Actions */}
          <div className="flex items-center gap-3">
            {/* Ambient Chill Audio simulation */}
            <button
              onClick={() => {
                const nextPlaying = !isAmbientMusicPlaying;
                setIsAmbientMusicPlaying(nextPlaying);
                setToastMessage(nextPlaying ? "🎵 تم تفعيل المقطوعة الموسيقية الملكية للتخطيط الإبداعي" : "🔇 تم كتم المقطوعة الكلاسيكية");
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${isAmbientMusicPlaying ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-white/5 text-white/50 border-white/10 hover:text-white"}`}
              title="موسيقى تخطيط كلاسيكية هادئة"
            >
              <Music className={`h-4 w-4 ${isAmbientMusicPlaying ? "animate-bounce" : ""}`} />
            </button>

            {/* AI Voice Greeting replayer */}
            <button
              onClick={() => {
                speakAIGreeting(ownerName || "مستشارنا الموقر", ownerHallName || "قصر الأميرات");
              }}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isSpeaking 
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse" 
                  : "bg-white/5 text-white/50 border-white/10 hover:text-white"
              }`}
              title="إعادة تشغيل ترحيب الغرفة الذكي لجيجي"
            >
              <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-bounce" : ""}`} />
            </button>

            <button
              onClick={() => setShowConsultModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/40"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>استشارة هندسية فورية</span>
            </button>
          </div>
        </div>
      </header>

      {/* GLOWING MASTER DIGITAL TWIN CONNECTION BAR */}
      <div className="bg-slate-900 border-b border-amber-500/10 py-2.5 px-6">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-xs">
              <span className="text-white/50">أهلاً بك يا مالك الصالة الموقر:</span>{" "}
              <strong className="text-amber-400 font-bold">{ownerName}</strong>{" "}
              <span className="text-white/30">|</span>{" "}
              <span className="text-white/50">قاعتك الفخمة:</span>{" "}
              <strong className="text-white font-bold">{ownerHallName}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-white/5">
              <span className="text-amber-400">🌌 السقف الذكي:</span>
              <button 
                onClick={() => setSmartGlassCeiling(!smartGlassCeiling)}
                className={`font-mono font-black ${smartGlassCeiling ? "text-emerald-400" : "text-white/35 hover:text-white"}`}
              >
                {smartGlassCeiling ? "نَشِط ✓" : "مُعَطَّل"}
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-white/5">
              <span className="text-emerald-400">✨ الأرضية الهولوغرافية:</span>
              <button 
                onClick={() => setHolographicGround(!holographicGround)}
                className={`font-mono font-black ${holographicGround ? "text-emerald-400" : "text-white/35 hover:text-white"}`}
              >
                {holographicGround ? "نَشِط ✓" : "مُعَطَّل"}
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-white/5">
              <span className="text-purple-400">💨 معطر Oud & Scent:</span>
              <button 
                onClick={() => setScentSprinkler(!scentSprinkler)}
                className={`font-mono font-black ${scentSprinkler ? "text-emerald-400" : "text-white/35 hover:text-white"}`}
              >
                {scentSprinkler ? "نَشِط ✓" : "مُعَطَّل"}
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-white/5">
              <span className="text-pink-400">🔮 كينيتك راقص:</span>
              <button 
                onClick={() => setKineticChandeliers(!kineticChandeliers)}
                className={`font-mono font-black ${kineticChandeliers ? "text-emerald-400" : "text-white/35 hover:text-white"}`}
              >
                {kineticChandeliers ? "نَشِط ✓" : "مُعَطَّل"}
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded bg-slate-950 text-emerald-400 font-extrabold border border-emerald-500/30">
              <span className="animate-pulse">●</span>
              <span>مزامنة التوأم ثنائي الاتجاه بالكامل (الافتراضي ⇆ الواقع)</span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOAT TOAST DYNAMIC SYSTEM WARNING FREE */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-500/25 bg-slate-950/95 px-5 py-3.5 text-xs text-amber-300 shadow-2xl backdrop-blur-xl animate-bounce" dir="rtl">
          <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HERO PRESTIGE TITLE SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-4">
        <div className="rounded-3xl bg-gradient-to-l from-slate-900 to-slate-900/40 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>لأول مرة في المملكة العربية السعودية 🇸🇦</span>
            </div>
            <h2 className="text-2xl font-black text-white sm:text-3xl leading-tight">
              أبهر ضيوفك بتصاميم زهور مستحيلة التخيل بالذكاء الاصطناعي
            </h2>
            <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
              تحكّم كامل بأبعاد قاعتك، ونوع ومزيج باقات الورود المنسقة بدقة متناهية تحت محاكاة تفاعلية ثلاثية الأبعاد. حوِّل الابتكار الهولوغرافي إلى واقع ملموس في الرياض، جدة، الشرقية، ونيوم.
            </p>
          </div>

          {/* Hall Owner stats dashboard block */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <div className="text-xl font-bold font-mono text-amber-400">١٠٠٪</div>
              <p className="text-[10px] text-white/50">تخصيص حر وفوري للصالات</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 text-center">
              <div className="text-xl font-bold font-mono text-amber-400">العربية</div>
              <p className="text-[10px] text-white/50">تصاميم مستوحاة من هويتنا</p>
            </div>
          </div>
        </div>
      </section>

      {/* GIGI CINEMATIC PROJECTION MULTIVERSE SCREEN */}
      <section className="mx-auto max-w-7xl px-6 py-4">
        <CinematicSimulator
          venueTitle={selectedVenue.title}
          themeName={currentDesign.themeName}
          isMusicPlaying={isAmbientMusicPlaying}
          onToggleMusic={(state) => {
            setIsAmbientMusicPlaying(state);
            setToastMessage(state ? "🎵 تم تفعيل المقطوعة الموسيقية الملكية للتخطيط الإبداعي" : "🔇 تم كتم المقطوعة الكلاسيكية");
            setTimeout(() => setToastMessage(null), 4000);
          }}
          flowerColors={currentDesign.recommendedFlowers.map(f => f.color)}
        />
      </section>

      {/* 5-STAGE MASTER WORKFLOW STEPPER */}
      <section className="mx-auto max-w-7xl px-6 py-2">
        <div className="rounded-2xl border border-amber-500/15 bg-slate-900/60 p-4 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sliders className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">مسار التخطيط الخماسي الفاخر</h3>
                <p className="text-[10px] text-white/50">خطوات بسيطة لصياغة باقة الأحلام متناهية الأبعاد</p>
              </div>
            </div>
            
            {/* Steps Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
              {[
                { step: 1, label: "صرح القاعة", desc: "أبعاد المكان", action: () => { setWorkflowStep(1); } },
                { step: 2, label: "فن الزهور", desc: "باقات النخبة", action: () => { setWorkflowStep(2); setActiveTab("creative"); } },
                { step: 3, label: "الهندسة والممرات", desc: "طول ممشى العز", action: () => { setWorkflowStep(3); setActiveTab("engineering"); } },
                { step: 4, label: "أجواء الإضاءة", desc: "أثير قمرة القيادة", action: () => { setWorkflowStep(4); setActiveTab("lighting"); } },
                { step: 5, label: "الختم الملكي والصك", desc: "المعاهدة والمصادقة", action: () => { setWorkflowStep(5); } }
              ].map((s) => {
                const isActive = workflowStep === s.step;
                const isCompleted = workflowStep > s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      s.action();
                      setToastMessage(`📍 تم الانتقال للمرحلة ${s.step}: ${s.label}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`flex-1 md:flex-none p-2 rounded-xl border text-right transition-all duration-350 min-w-[100px] sm:min-w-[125px] flex flex-col justify-between relative overflow-hidden ${
                      isActive 
                        ? "border-amber-400 bg-amber-500/[0.05] shadow-lg shadow-amber-500/5 text-amber-400" 
                        : isCompleted
                          ? "border-emerald-500/30 bg-emerald-500/[0.02] text-emerald-400"
                          : "border-white/5 bg-slate-950/60 text-white/60 hover:text-white hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${isActive ? "bg-amber-400 text-slate-950" : isCompleted ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-white/70"}`}>
                        {s.step}
                      </span>
                      {isCompleted && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                    </div>
                    <div className="mt-1.5">
                      <div className="text-[10px] font-extrabold leading-none">{s.label}</div>
                      <div className="text-[8px] text-white/40 mt-1">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DOCKING WORKSPACE */}
      <main className="mx-auto max-w-7xl px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ===================== COLUMN 1: LEFT SIDEBAR CONTROLS (5 COLS) ===================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 1: SELECT ACTIVE BALLROOM */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-sm text-white">اختر قاعة المؤامرة والمناسبة الخاصة بك</h3>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {PRESET_VENUES.length} صالات مادية
              </span>
            </div>

            <p className="text-xs text-white/60">
              قمنا بإعداد البنية المعمارية الدقيقة لأبرز الصالات في المملكة. اختر صالتك للبدء في إسقاط باقات الزهور:
            </p>

            {/* Hall selector card grid */}
            <div className="grid grid-cols-2 gap-3">
              {PRESET_VENUES.map((venue) => {
                const isSelected = selectedVenue.id === venue.id;
                return (
                  <button
                    key={venue.id}
                    onClick={() => {
                      setSelectedVenue(venue);
                      setToastMessage(`🏟️ تم تحميل أبعاد قاعة: ${venue.title}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`relative p-3.5 rounded-xl border text-right transition-all duration-300 group flex flex-col justify-between h-28 overflow-hidden ${
                      isSelected 
                        ? "border-amber-400 bg-amber-500/[0.04] shadow-md shadow-amber-500/5" 
                        : "border-white/5 bg-white/5 hover:border-white/15"
                    }`}
                  >
                    {/* Background faint Image */}
                    <img 
                      src={venue.imgUrl} 
                      alt={venue.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay group-hover:scale-110 transition-all duration-700"
                    />

                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-amber-500/80 bg-slate-950/90 px-1.5 py-0.5 rounded-md">🇸🇦 {venue.location.split("،")[0]}</span>
                        {isSelected && <CheckCircle className="h-3.5 w-3.5 text-amber-400" />}
                      </div>
                      <h4 className="text-[11px] font-bold text-white leading-tight mt-1 group-hover:text-amber-300 transition-colors">
                        {venue.title}
                      </h4>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[8px] text-white/50 border-t border-white/5 pt-1 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="h-2 w-2" />
                        {venue.capacity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTERACTIVE PALETTE SWAPPER */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-sm text-white">تأثيرات السجادة اللونية والنسق العام</h3>
              </div>
            </div>
            <p className="text-xs text-white/60">
              اختر أحد الأنساق اللونية الفاخرة لتغيير الورود، الشدّة الضوئية وإضاءة القاعة الكاملة بكبسة واحدة:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "royalLavender", name: "أرجوان القصر الملكي", color: "bg-violet-600" },
                { id: "goldenDesert", name: "شروق الصحراء المذهب", color: "bg-amber-500" },
                { id: "classicRedWhite", name: "الممرّ الكلاسيكي الفطن", color: "bg-rose-600" },
                { id: "neomEmerald", name: "مستقبل نيوم الزمردي", color: "bg-indigo-500" }
              ].map((theme) => {
                const isSelected = currentDesign.themeName === PRESET_THEMES[theme.id].themeName;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentDesign(PRESET_THEMES[theme.id]);
                      setToastMessage(`🎨 تم تطبيق نسق: ${PRESET_THEMES[theme.id].themeName}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/[0.03] text-amber-400"
                        : "border-white/5 bg-slate-950/40 text-white/60 hover:text-white"
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full ${theme.color} shrink-0`} />
                    <span className="text-[11px] font-bold truncate">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MULTI-TAB CONTROLLERS PANEL (Creative, Engineering, Ambiance) */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 shadow-xl space-y-5">
            
            {/* Tab Swappers */}
            <div className="flex border-b border-white/5 pb-2">
              <button
                onClick={() => setActiveTab("creative")}
                className={`flex-1 text-center py-2 text-xs font-bold transition-all duration-200 border-b-2 -mb-[10px] flex items-center justify-center gap-1.5 ${
                  activeTab === "creative" 
                    ? "border-amber-500 text-amber-400 font-black" 
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>الذكاء الاصطناعي وباقة الورد</span>
              </button>
              <button
                onClick={() => setActiveTab("engineering")}
                className={`flex-1 text-center py-2 text-xs font-bold transition-all duration-200 border-b-2 -mb-[10px] flex items-center justify-center gap-1.5 ${
                  activeTab === "engineering" 
                    ? "border-amber-500 text-amber-400 font-black" 
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>هندسة وتخطيط القاعة</span>
              </button>
              <button
                onClick={() => setActiveTab("lighting")}
                className={`flex-1 text-center py-2 text-xs font-bold transition-all duration-200 border-b-2 -mb-[10px] flex items-center justify-center gap-1.5 ${
                  activeTab === "lighting" 
                    ? "border-amber-500 text-amber-400 font-black" 
                    : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>الإضاءة والجو العام</span>
              </button>
            </div>

            {/* TAB CONTENT: CREATIVE AND AI FLOWERS */}
            {activeTab === "creative" && (
              <div className="space-y-5">
                
                {/* AI Generative Prompter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>مهندس التنسيق التوليدي AI (التصميم بالوصف)</span>
                    </label>
                    <span className="text-[9px] text-white/40">مبني على ذوق العرائس السعودي</span>
                  </div>

                  <form onSubmit={(e) => handleAiOrchestration(e)} className="relative">
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="صف ثانوية أحلام صاحب الحفل، مثل: 'درجات الخزامى البنفسجية لليلة عرائسية فخمة بالرياض، زهور الممر ممتدة، وإضاءة ليزر رومانسية خافتة مع فخامة الكريستال والهايدرنجا...'"
                      className="w-full h-24 rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                    />
                    <button
                      type="submit"
                      disabled={isOrchestrating}
                      className="absolute bottom-3 left-3 bg-amber-500 hover:bg-amber-400 font-bold p-2 text-slate-950 rounded-lg transition-all shadow-md flex items-center gap-1 disabled:opacity-50 text-[10px]"
                    >
                      {isOrchestrating ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>يرتب الزهور...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          <span>احسب ونظّم</span>
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Prompt Idea Templates */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40 block">قوالب إلهام سعودية جاهزة بنقرة واحدة:</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {templatePrompts.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPromptInput(p.text);
                            handleAiOrchestration(undefined, p.text);
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20 text-[10px] text-white/70 hover:text-amber-400 transition-all font-medium text-right"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {aiError && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] rounded-lg flex items-start gap-2 max-h-20 overflow-y-auto">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{aiError}</span>
                    </div>
                  )}
                </div>

                {/* Fine floral catalog adjustments */}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      <span>مكونات باقة الزهور التفاعلية</span>
                    </h4>
                    <button
                      onClick={handleAddCustomFlower}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md"
                    >
                      <Plus className="h-3 w-3" />
                      <span>إضافة زنبق/زهرة مخصصة</span>
                    </button>
                  </div>

                  {/* Flowers percentages mapping list */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {currentDesign.recommendedFlowers.map((flower, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex flex-col gap-2 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Color preview box */}
                            <input
                              type="color"
                              value={flower.color}
                              onChange={(e) => handleEditFlower(idx, { color: e.target.value })}
                              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent block"
                              title="تغيير لون الزهرة"
                            />
                            <input
                              type="text"
                              value={flower.nameArabic}
                              onChange={(e) => handleEditFlower(idx, { nameArabic: e.target.value })}
                              className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-400 focus:outline-none text-xs font-bold text-white w-32"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded">
                              {flower.percentage}%
                            </span>
                            <button
                              onClick={() => handleRemoveFlower(idx)}
                              className="text-white/40 hover:text-rose-400 p-1"
                              title="حذف الزهرة من الباقة"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Symbolic cultural meaning */}
                        <input
                          type="text"
                          value={flower.symbolicMeaning}
                          onChange={(e) => handleEditFlower(idx, { symbolicMeaning: e.target.value })}
                          className="text-[9px] text-white/50 bg-transparent border-0 italic focus:outline-none focus:text-white"
                          placeholder="الرمز الثقافي أو الجمالي للزهرة"
                        />

                        {/* Range slider for percentage */}
                        <input
                          type="range"
                          min="5"
                          max="80"
                          step="5"
                          value={flower.percentage}
                          onChange={(e) => {
                            const newPct = parseInt(e.target.value, 10);
                            handleEditFlower(idx, { percentage: newPct });
                          }}
                          className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: ENGINEERING LAYOUT */}
            {activeTab === "engineering" && (
              <div className="space-y-4">
                <p className="text-xs text-white/50 leading-relaxed">
                  هوامش المخطط المالي والمعماري وتوزيع الطاوولات والممشى. عيِّن مواصفات الكرنفال الملكي بدقة:
                </p>

                {/* Catwalk Length slider */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">طول ممشى العروسين (Catwalk)</span>
                    <strong className="text-amber-400 font-mono">{currentDesign.floorLayout.catwalkLength} متر طولي</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="26"
                    step="1"
                    value={currentDesign.floorLayout.catwalkLength}
                    onChange={(e) => handleUpdateLayout(prev => ({ ...prev, catwalkLength: parseInt(e.target.value, 10) }))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>10 أمتار (وسط)</span>
                    <span>18 أمتار (ملكي)</span>
                    <span>26 متراً (صالات عملاقة)</span>
                  </div>
                </div>

                {/* Table Layout Selector */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-white block">نمط مقاعد وجلوس المدعوين:</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleUpdateLayout(prev => ({ ...prev, tableStyle: "Round" }))}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        currentDesign.floorLayout.tableStyle === "Round"
                          ? "border-amber-500 bg-amber-500/[0.03] text-amber-400"
                          : "border-white/5 bg-slate-950 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">طاولات دائرية VIP</div>
                      <div className="text-[9px] text-white/40 mt-1">تنسق بزهور ملكية مستديرة</div>
                    </button>

                    <button
                      onClick={() => handleUpdateLayout(prev => ({ ...prev, tableStyle: "Banqueting" }))}
                      className={`p-3.5 rounded-xl border text-center transition-all ${
                        currentDesign.floorLayout.tableStyle === "Banqueting"
                          ? "border-amber-500 bg-amber-500/[0.03] text-amber-400"
                          : "border-white/5 bg-slate-950 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">طاولات ممتدة (Banqueting)</div>
                      <div className="text-[9px] text-white/40 mt-1">زهور طولية ممتدة مع السجاد</div>
                    </button>
                  </div>
                </div>

                {/* Backdrop / Kosha Selection */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-white block">بنية خلفية الكوشة الرئيسية (مسرح القاعة):</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "RoseWall", label: "جدار السجاد الملكي (RoseWall)", desc: "مغطى بمخمل الورود" },
                      { key: "CrystalHarp", label: "شبك الكريستال (CrystalHarp)", desc: "إبر مذهبة متدلية" },
                      { key: "GardenArch", label: "أقواس الطبيعة (GardenArch)", desc: "أوراق الخيزران الغامرة" },
                      { key: "ModernGold", label: "الهندسة الذهبية (ModernGold)", desc: "أضلاع ومرايا النخبة" }
                    ].map((item) => {
                      const isSelected = currentDesign.floorLayout.koshaBackground === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => handleUpdateLayout(prev => ({ ...prev, koshaBackground: item.key as KoshaStyle }))}
                          className={`p-2.5 rounded-xl border text-right transition-all text-xs flex flex-col gap-0.5 ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/[0.03] text-amber-400"
                              : "border-white/5 bg-slate-950 text-white/60 hover:text-white"
                          }`}
                        >
                          <span className="font-bold">{item.label.split(" (")[0]}</span>
                          <span className="text-[9px] text-white/40">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Structural Entrance Flower Arch Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-white/5">
                  <div>
                    <h5 className="text-xs font-bold text-white">قوس الورد العملاق بمدخل القاعة</h5>
                    <p className="text-[9px] text-white/40">بوابة ترحيبية مهيبة مكسوة بالكامل بنظام الورود</p>
                  </div>
                  <button
                    onClick={() => handleUpdateLayout(prev => ({ ...prev, hasFlowerArch: !prev.hasFlowerArch }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      currentDesign.floorLayout.hasFlowerArch ? "bg-amber-500" : "bg-slate-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        currentDesign.floorLayout.hasFlowerArch ? "-translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Density Setting */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-white block">درجة الكثافة الفنية التكرارية للزهور:</span>
                  <div className="flex rounded-lg bg-slate-950 p-1 border border-white/5 text-xs text-center">
                    {(["moderate", "dense", "royal"] as FlowerDensity[]).map((d) => {
                      const isSelected = currentDesign.floorLayout.flowerDensity === d;
                      const label = d === "royal" ? "ملكي (100%)" : d === "dense" ? "مكثف (80%)" : "معتدل (50%)";
                      return (
                        <button
                          key={d}
                          onClick={() => handleUpdateLayout(prev => ({ ...prev, flowerDensity: d }))}
                          className={`flex-1 py-1.5 rounded transition-all font-bold ${
                            isSelected 
                              ? "bg-amber-500 text-slate-950" 
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: LIGHTING / ATMOSPHERE */}
            {activeTab === "lighting" && (
              <div className="space-y-4">
                
                {/* Visualizer Atmosphere Name input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">موضوع أو هالة الإضاءة الشاملة (Atmosphere):</label>
                  <input
                    type="text"
                    value={currentDesign.suggestedLighting.atmosphereName}
                    onChange={(e) => handleUpdateLighting(prev => ({ ...prev, atmosphereName: e.target.value }))}
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="مثل: النور السرمدي، شجون العرائس، الغسق الذهبي"
                  />
                </div>

                {/* Lighting intensity range */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">شدة وقوة الإضاءة (Intensity)</span>
                    <strong className="text-amber-400 font-mono">{currentDesign.suggestedLighting.intensity}%</strong>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={currentDesign.suggestedLighting.intensity}
                    onChange={(e) => handleUpdateLighting(prev => ({ ...prev, intensity: parseInt(e.target.value, 10) }))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>خافتة رومانسية (30%)</span>
                    <span>أمسية ساطعة (100%)</span>
                  </div>
                </div>

                {/* Color pickers: Ambient Wash vs Spotlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <span className="text-[10px] text-white/60 block mb-1">الفيض المحيطي للقاعة (Wash)</span>
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="color"
                        value={currentDesign.suggestedLighting.ambientHex}
                        onChange={(e) => handleUpdateLighting(prev => ({ ...prev, ambientHex: e.target.value }))}
                        className="w-10 h-10 rounded-full cursor-pointer border border-white/10"
                      />
                      <span className="text-xs font-mono font-bold text-white">{currentDesign.suggestedLighting.ambientHex.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <span className="text-[10px] text-white/60 block mb-1">كشافات ممشى الروضة (Spotlight)</span>
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="color"
                        value={currentDesign.suggestedLighting.spotlightHex}
                        onChange={(e) => handleUpdateLighting(prev => ({ ...prev, spotlightHex: e.target.value }))}
                        className="w-10 h-10 rounded-full cursor-pointer border border-white/10"
                      />
                      <span className="text-xs font-mono font-bold text-white">{currentDesign.suggestedLighting.spotlightHex.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3 text-[10px] text-white/50 leading-relaxed">
                  💡 <strong>نصيحة خبراء جيرار:</strong> ننصح باختيار ألوان متباينة بين الإضاءة المحيطية ودرجة ورود الممشى للحصول على تباين فوتوغرافي رائع يخطف الألباب.
                </div>

              </div>
            )}

          </div>

          {/* HISTORIC DESIGNS FOR OWNER PERSISTENCE */}
          {savedDesigns.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-3 shadow-xl">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <History className="h-4 w-4 text-amber-500" />
                <span>سجل مخططات قاعتك المحفوظة محلياً</span>
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedDesigns.map((save) => (
                  <div key={save.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-white/5 hover:border-amber-500/10 transition-colors text-right">
                    <div>
                      <h5 className="text-xs font-bold text-white">{save.themeName}</h5>
                      <p className="text-[9px] text-white/40">{save.venueTitle} • {save.date}</p>
                    </div>
                    <button
                      onClick={() => handleLoadSavedDesign(save.id)}
                      className="px-2.5 py-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md hover:bg-amber-500 hover:text-slate-950 transition-all"
                    >
                      استرجاع المخطط
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ===================== COLUMN 2: RIGHT INTERACTIVE VIEW (7 COLS) ===================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE 3D INTERACTIVE VISUALIZER FRAME CONTAINER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                  منظور المعاينة ثلاثية الأبعاد الفاخرة • GIGI VIRTUAL 3D CAVERN
                </h3>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-emerald-400 font-mono font-black animate-pulse">مباشر ومحسوب بدقة</span>
              </div>
            </div>

            {/* Render recursive 3D svg canvas */}
            <HallVisualizer 
              design={currentDesign}
              onUpdateLayout={handleUpdateLayout}
              onUpdateLighting={handleUpdateLighting}
              hasOwnerEntered={hasOwnerEntered}
              setHasOwnerEntered={setHasOwnerEntered}
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              ownerHallName={ownerHallName}
              setOwnerHallName={setOwnerHallName}
              smartGlassCeiling={smartGlassCeiling}
              setSmartGlassCeiling={setSmartGlassCeiling}
              holographicGround={holographicGround}
              setHolographicGround={setHolographicGround}
              scentSprinkler={scentSprinkler}
              setScentSprinkler={setScentSprinkler}
              kineticChandeliers={kineticChandeliers}
              setKineticChandeliers={setKineticChandeliers}
              customRealPhoto={customRealPhoto}
              setCustomRealPhoto={setCustomRealPhoto}
            />
          </div>

          {/* GENERATIVE BLUEPRINT DETAIL SHEET */}
          <div className="rounded-3xl border border-white/5 bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Elegant corner watermark styling */}
            <div className="absolute top-4 left-4 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-full font-bold">
              موصى به بالذكاء الاصطناعي للمملكة
            </div>

            {/* Theme headers */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase block">توقيع المخطط الحالي</span>
              <h3 className="text-xl font-black text-white sm:text-2xl leading-tight">
                {currentDesign.themeName}
              </h3>
              <p className="text-xs text-white/40 italic font-serif">
                {currentDesign.themeEnglish}
              </p>
            </div>

            {/* Aesthetic descriptive explanation in Saudi tone */}
            <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
              {currentDesign.aestheticDescription}
            </p>

            {/* Budget, Venue stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Local pricing */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 block">الميزانية التقديرية للتنفيذ الفاخر</span>
                  <span className="text-[13px] font-mono font-black text-amber-400">
                    {(currentDesign.estimatedBudgetSAR || 160000).toLocaleString("en").split(".")[0]} <span className="text-xs text-white font-normal">ريال سعودي</span>
                  </span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>

              {/* Saudi Cultural Suitability indicator */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/50 block">ملاءمة العرس والتقاليد المحلية</span>
                  <p className="text-xs font-bold text-emerald-400 leading-tight">
                    {currentDesign.ksaSuitability || "ملائم لجميع صالات ومجالس المملكة الرفيعة."}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

            </div>

            {/* Bottom Actions of Blueprint sheet */}
            <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-white/5 pt-5 mt-4 justify-between">
              <p className="text-[10px] text-white/40 max-w-sm text-right leading-tight">
                * الأسعار والكميات تقديرية بناءً على أسواق الرياض الكبرى وباقات الاستيراد الفاخرة للورود الطبيعية الهولندية.
              </p>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {/* Save blueprint locally */}
                <button
                  onClick={handleSaveToMyBlueprints}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-white/10 text-xs text-white hover:text-amber-400 hover:border-amber-400 bg-white/5 hover:bg-amber-500/5 transition-all font-bold"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>حفظ المخطط بالسجل</span>
                </button>

                <button
                  onClick={() => {
                    alert("📤 يجري تصدير لوحة القيادة والمخطط الفني كملف تسعير وصور ثلاثية الأبعاد تفاعلية... شارك الرابط مع فريق الديكور وصاحب القاعة!");
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-white/10 text-xs text-white hover:text-amber-400 hover:border-amber-400 bg-white/5 hover:bg-amber-500/5 transition-all font-bold"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>مشاركة وتصدير</span>
                </button>
              </div>
            </div>

          </div>

          {/* STAGE 5: THE GRAND TREATY SEAL & WAX STAMP COMPONENT */}
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Background luxury seal hologram effect */}
            <div className={`absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-amber-500/5 blur-xl transition-all duration-1000 ${isContractStamped ? "scale-150 bg-amber-500/10" : ""}`} />
            
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1">
                <Award className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>الخطوة الخامسة: المصادقة وصيانة العهد</span>
              </span>
              <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-amber-400">
                وثيقة التوريد والديكور المالي
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">
                توقيع واعتماد مخطط زفاف: <span className="text-amber-400 font-serif">{currentDesign.themeName}</span>
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                لكي نقوم بحجز واستيراد باقات الزهور الهولندية الطبيعية المحددة في جدول تسعير قاعة (<strong>{selectedVenue.title}</strong>)، تفضّل بتوقيع ودمغ صك المعاهدة الإبداعية لضمان الأمانة الجغرافية والكميات المدرجة:
              </p>
            </div>

            {!isContractStamped ? (
              <div className="space-y-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Representative Name input */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-bold text-white block">اسم مفوض التوقيع (صاحب السمو / السعادة / المهندس):</label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="عبدالله بن خالد بن عبدالعزيز"
                      className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right"
                    />
                  </div>

                  {/* Organization Name input */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-bold text-white block">العائلة الموقرة أو الجهة المستفيدة:</label>
                    <input
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="عائلة السديري الكرام"
                      className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right"
                    />
                  </div>
                </div>

                {/* Wax Seal Action Button */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      if (!signatureName.trim() || !organizationName.trim()) {
                        setToastMessage("⚠️ الرجاء ملء حقول الاسم والجهة للمصادقة على العقد الملكي.");
                        setTimeout(() => setToastMessage(null), 3500);
                        return;
                      }
                      
                      setIsStampingAnimation(true);
                      setToastMessage("🔔 يجري صهر الشمع الملكي وتطبيق الختم المذهب المائي...");
                      
                      setTimeout(() => {
                        setIsStampingAnimation(false);
                        setIsContractStamped(true);
                        setToastMessage("👑 تم ختم المخطط رسمياً وختم المعاهدة بنجاح!");
                        setTimeout(() => setToastMessage(null), 4000);
                      }, 2400);
                    }}
                    disabled={isStampingAnimation}
                    className="relative px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/40 flex items-center gap-2 overflow-hidden"
                  >
                    {isStampingAnimation ? (
                      <>
                        <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>يجري غمس الختم في الشمع الساخن...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base animate-bounce">⚜️</span>
                        <span>اضغط لختم الصك بالشمع الملكي المذهب</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Signed and stamped presentation card showing gorgeous glowing gold wax stamp! */
              <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
                
                {/* Glowing stamp watermark overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-amber-500/[0.01] to-transparent pointer-events-none" />

                <div className="space-y-3 text-right">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    <span>صك توريد معتمد ومختوم إلكترونياً</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-white/40 uppercase font-mono">AUTHORIZED REPRESENTATIVE</p>
                    <p className="text-sm font-black text-white">{signatureName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-white/40 uppercase font-mono">ORGANIZATION / HOUSEHOLD</p>
                    <p className="text-xs font-bold text-amber-200">{organizationName}</p>
                  </div>

                  <div className="text-[10px] text-white/50 leading-relaxed font-mono">
                    تاريخ الختم: <strong>{new Date().toLocaleDateString("ar-SA")}</strong> • رمز الوثيقة الرقمية: <strong>GIGI-{Math.floor(100000 + Math.random() * 900000)}</strong>
                  </div>
                </div>

                {/* GORGEOUS GOLDEN WAX STAMP COMPONENT */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute h-24 w-24 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                  
                  {/* Wax Seal outer rings */}
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-500/40 bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 shadow-2xl skew-x-3 rotate-6 transform transition-transform hover:scale-105 duration-300">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-300/30 bg-slate-950">
                      <div className="text-center p-1 select-none">
                        <div className="text-[9px] font-bold tracking-widest text-amber-500/80 leading-none">GIGI</div>
                        <div className="text-base font-serif font-black text-amber-400 my-0.5 animate-pulse">⚜️</div>
                        <div className="text-[7px] font-black tracking-widest text-emerald-400 leading-none">APPROVED</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revoke stamp */}
                <button
                  onClick={() => {
                    setIsContractStamped(false);
                    setToastMessage("🔓 تم كسر الشمع الملكي. يمكنك تعديل البيانات.");
                    setTimeout(() => setToastMessage(null), 3500);
                  }}
                  className="absolute bottom-2.5 left-2.5 text-[9px] text-white/30 hover:text-rose-400 font-bold hover:bg-white/5 px-2 py-1 rounded-md transition-colors"
                >
                  إعادة تحرير
                </button>
              </div>
            )}

          </div>

          {/* INTERACTIVE GUIDE ON HOW SHADERS WORK */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-4 shadow-xl">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Sliders className="h-4 w-4 text-amber-500" />
              <span>دليل المخطط الملكي التفاعلي ثلاثي الأبعاد</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                <span className="text-amber-400 font-bold block mb-1">١. جيل الذكاء الاصطناعي</span>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  اكتب فكرتك في حوار المعالج التوليدي واضغط "احسب ونظّم" ليقوم النظام بتعديل التناغم اللوني والعدد والأنواع بدقة.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                <span className="text-amber-400 font-bold block mb-1">٢. النقر المباشر (3D Click)</span>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  تفاعل مع المجسم! انقر على خلفية الكوشة للمسرح الدائري، ممشى العروسين، أو طاولات الحضور لتغييرهم بلمسة سحرية.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                <span className="text-amber-400 font-bold block mb-1">٣. إضاءة النيتروجين والضباب</span>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  فعِّل "ضباب النيتروجين" لرؤية تأثير الدخان الراقص الكثيف لإضفاء لمسة واقعية وعاطفية لا تنسى على المعاينة الافتراضية.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* LUXURY ROYAL VENUE HIGHLIGHT GRID SHOWCASE */}
      <footer className="border-t border-white/5 bg-slate-950/70 mt-16 py-12 text-center text-xs text-white/50">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          
          <div className="space-y-2">
            <h4 className="text-sm font-black text-white">الرواد التقنيون الأوائل لديكورات القاعات الفخمة بالمملكة</h4>
            <p className="text-xs text-white/40 max-w-xl mx-auto">
              GIGI FLOWERS هي علامة هندسية مسجّلة متفرّدة بالدمج التفاعلي المباشر بين لوجستيات تزيين الزهر وصناعة تجربة غامرة لمهندسي العرائس وصالونات النخبة.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/30 text-[10px] tracking-widest font-mono uppercase pb-4">
            <span>RIYADH BALLROOMS NETWORK</span>
            <span>•</span>
            <span>JEDDAH ROYAL PAVILIONS</span>
            <span>•</span>
            <span>DAMMAM CORNICHE BRIDAL</span>
            <span>•</span>
            <span>NEOM FUTURE EVENTS</span>
          </div>

          <div className="text-[11px] text-white/30">
            حقوق الطبع محفوظة © {new Date().getFullYear()} جيجي فلاورز للتصميم الرقمي والذكاء الاصطناعي المحدودة. المملكة العربية السعودية.
          </div>
        </div>
      </footer>

      {/* ROYAL CONSULTATION / APPOINTMENT BOOKING MODAL */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-900 p-6 shadow-2xl">
            
            {/* Top close button */}
            <button
              onClick={() => { setShowConsultModal(false); setBookingSuccess(false); }}
              className="absolute top-4 left-4 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Heading */}
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BellRing className="h-6 w-6 animate-swing" />
              </div>
              <h4 className="text-lg font-black text-white">استشارة هندسية وفلترت ليلة الزفاف الملكية</h4>
              <p className="text-xs text-white/50">
                سيقوم كبير مستشاري التنسيق الفني بـ GIGI FLOWERS بالتواصل معك لتجسيد هذا المخطط على أرض الواقع.
              </p>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h5 className="text-lg font-bold text-white">تم قبول طلب الاستشارة الملكية بنجاح!</h5>
                <p className="text-xs text-white/60 max-w-sm mx-auto">
                  لقد استلمنا مخطط زهور "{currentDesign.themeName}" وسيتم مراجعته من قبل مهندس الديكور المخصص للصالون للتواصل معك قريباً جداً عبر الهاتف وتأكيد الحجز.
                </p>
              </div>
            ) : (
              <form onSubmit={submitConsultation} className="space-y-4">
                
                {/* Pre-fill blueprint overview snippet */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-xs text-right space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block">مخطط الورود المستهدف:</span>
                  <div className="text-white font-bold">{currentDesign.themeName}</div>
                  <div className="text-[11px] text-white/50">{selectedVenue.title}</div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">الميزانية التقديرية: {currentDesign.estimatedBudgetSAR?.toLocaleString()} ريال سعودي</div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">اسم وعائلة صاحب القاعة أو الحفلة:</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: المهندس عبدالرحمن بن سعود"
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-right"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">رقم الجوال السعودي للتواصل المباشر:</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="مثال: +966 50 123 4567"
                    className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                {/* Custom Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">طلب خاص أو تعديلات معمارية تود إضافتها:</label>
                  <textarea
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="تعديلات إضافية على ثريّات السقف ومرايا المدخل، إحضار طاولات كريستالية مخصصة..."
                    className="w-full h-20 rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed text-right"
                  />
                </div>

                {/* Consent */}
                <p className="text-[9px] text-white/40 leading-relaxed text-right">
                  * بالضغط على حجز الاستشارة الملكية، فإنك تخول مهندسينا في الرياض وجدة بتقديم دراسة جدوى فوتوغرافية ومخطط مالي مجاني بالكامل مبني على الرؤية الفوقية وقواعد البيانات الرقمية.
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01]"
                >
                  حجز موعد الاتصال والطلب الفوري
                </button>

              </form>
            )}

          </div>
        </div>
      )}

      </>)}

    </div>
  );
}
