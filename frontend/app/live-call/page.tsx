"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic, Activity, AlertTriangle, User, Ear } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const demoScenarios = {
  cardiac: [
    "911, what is your emergency?",
    "My husband just collapsed! He was clutching his chest and now he's on the floor!",
    "Is he conscious? Can he speak to you?",
    "No! He's not responding! I think his heart stopped! Please hurry!",
    "Okay, stay on the line. I'm dispatching an ambulance now. Can you check if he's breathing?",
    "He's gasping... like a fish... oh god, please help him!",
    "That's agonal breathing. We need to start CPR immediately."
  ],
  bleeding: [
    "911, state your emergency.",
    "There's blood everywhere! My friend was using a power tool and it slipped!",
    "Where is the injury?",
    "His leg! His upper thigh! It's spurting... it won't stop!",
    "Okay, I need you to find a clean cloth and apply heavy pressure right now.",
    "I'm trying! But it's soaking through everything! He's getting very pale.",
    "Listen to me, you need to use a tourniquet if you have one. Tie it tight above the wound."
  ],
  allergic: [
    "Emergency services.",
    "Help... I can't... breathe...",
    "Sir? Tell me where you are.",
    "Ate... nuts... throat... closing...",
    "Are you having an allergic reaction? Do you have an EpiPen?",
    "No... dizzy... feeling faint...",
    "Help is on the way. Try to stay sitting upright."
  ]
};

export default function LiveCallPage() {
  const [callState, setCallState] = useState<"incoming" | "active" | "ended">("incoming");
  const [activeScenario, setActiveScenario] = useState<keyof typeof demoScenarios>("cardiac");
  const [transcript, setTranscript] = useState<string>("");
  const [liveStreamText, setLiveStreamText] = useState<string>("");
  
  // NLP Data from Backend
  const [triageScore, setTriageScore] = useState<number>(5);
  const [severity, setSeverity] = useState<string>("Pending");
  const [condition, setCondition] = useState<string>("Listening...");
  const [distressLevel, setDistressLevel] = useState<string>("Low");
  const [criticalKeywords, setCriticalKeywords] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isCritical, setIsCritical] = useState(false);
  
  const [timer, setTimer] = useState(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const backendIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wordStreamRef = useRef<NodeJS.Timeout | null>(null);
  
  const acceptCall = () => {
    setCallState("active");
    startDemoSimulation();
  };

  useEffect(() => {
    if (triageScore <= 2) {
      setIsCritical(true);
    } else {
      setIsCritical(false);
    }
  }, [triageScore]);

  const endCall = () => {
    setCallState("ended");
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    if (backendIntervalRef.current) clearInterval(backendIntervalRef.current);
    if (wordStreamRef.current) clearInterval(wordStreamRef.current);
  };

  const startDemoSimulation = () => {
    // 1. Start call timer
    audioIntervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    // 2. Simulate streaming text word by word
    const lines = demoScenarios[activeScenario];
    let wordIndex = 0;
    const allWords = lines.join(" ").split(" ");
    
    let currentFullTranscript = "";
    
    wordStreamRef.current = setInterval(() => {
      if (wordIndex < allWords.length) {
        const nextWord = allWords[wordIndex];
        currentFullTranscript += (currentFullTranscript.length > 0 ? " " : "") + nextWord;
        setTranscript(currentFullTranscript);
        wordIndex++;
      } else {
        if (wordStreamRef.current) clearInterval(wordStreamRef.current);
      }
    }, 350); // Slightly faster streaming

    // 3. Ping Backend every 3 seconds
    backendIntervalRef.current = setInterval(async () => {
      if (!currentFullTranscript) return;

      try {
        const response = await fetch(`${API_BASE}/api/analyze-call`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: currentFullTranscript }),
        });
        const result = await response.json();
        if (result.success && result.data) {
          setTriageScore(result.data.triageScore);
          setSeverity(result.data.severity);
          setCondition(result.data.condition);
          setDistressLevel(result.data.distressLevel);
          setCriticalKeywords(result.data.criticalKeywords || []);
          setSymptoms(result.data.symptoms || []);
        }
      } catch (err) {
        console.error("Live Analysis failed", err);
      }
    }, 6000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const highlightText = (text: string, keywords: string[]) => {
    if (!keywords.length) return text;
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
        return <span key={i} className="bg-destructive/20 text-destructive font-bold px-1 rounded">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
        <AnimatePresence mode="wait">
          
          {callState === "incoming" && (
            <motion.div
              key="incoming"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative">
                {/* Ping rings */}
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></span>
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25 animation-delay-500" style={{ animationDelay: '0.5s'}}></span>
                
                <div className="h-32 w-32 bg-slate-900 rounded-full border-4 border-slate-800 flex items-center justify-center relative z-10 shadow-2xl">
                  <User className="h-12 w-12 text-slate-500" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white tracking-widest animate-pulse">INCOMING EMERGENCY CALL</h2>
                <div className="flex gap-2 justify-center">
                  {(Object.keys(demoScenarios) as Array<keyof typeof demoScenarios>).map((key) => (
                    <Button 
                      key={key}
                      variant={activeScenario === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveScenario(key)}
                      className="capitalize"
                    >
                      {key} Demo
                    </Button>
                  ))}
                </div>
                <p className="text-slate-400">Caller ID: 555-0192 • Location: Pinpointing...</p>
              </div>

              <div className="flex gap-6 mt-8">
                <Button 
                  onClick={acceptCall}
                  className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                >
                  <Phone className="h-8 w-8 text-white" />
                </Button>
                <Button 
                  onClick={() => setCallState("ended")}
                  className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  <PhoneOff className="h-8 w-8 text-white" />
                </Button>
              </div>
            </motion.div>
          )}

          {callState === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Critical Glow Pulse */}
                {isCritical && (
                  <motion.div 
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-red-600 rounded-3xl -z-10 blur-3xl"
                  />
                )}
                
              <div className="col-span-1 lg:col-span-2 space-y-6">
                {/* Call Header */}
                <Card className={cn(
                  "bg-slate-900/50 border-slate-800 border-2 shadow-2xl backdrop-blur-xl transition-all duration-300",
                  isCritical && "border-red-500/50"
                )}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">LIVE 911 AUDIO FEED</h2>
                        <p className="text-slate-400 text-sm font-mono">00:00:{formatTime(timer)} • Encrypted Stream</p>
                      </div>
                    </div>
                    
                    {/* Audio Waveform Animation */}
                    <div className="flex items-center gap-1 h-12">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["20%", `${Math.random() * 80 + 20}%`, "20%"] }}
                          transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.3 }}
                          className="w-1.5 bg-primary/70 rounded-full"
                          style={{ minHeight: "4px" }}
                        />
                      ))}
                    </div>

                    <Button variant="destructive" onClick={endCall}>
                      <PhoneOff className="h-4 w-4 mr-2" /> End Call
                    </Button>
                  </CardContent>
                </Card>

                {/* Transcript Viewer */}
                <Card className="bg-slate-900/50 border-slate-800 min-h-[400px]">
                  <CardHeader className="border-b border-slate-800">
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Ear className="h-5 w-5 text-blue-400" /> Live Whisper Transcription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-xl leading-relaxed text-slate-300 font-medium">
                      {highlightText(transcript, criticalKeywords)}
                      <motion.span 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2.5 h-6 bg-primary ml-1 align-middle"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: AI Insights */}
              <div className="col-span-1 space-y-6">
                
                {/* Live Triage Score */}
                <Card className={cn(
                  "border-2 transition-colors duration-500",
                  triageScore === 1 ? "bg-red-950/40 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" :
                  triageScore === 2 ? "bg-orange-950/40 border-orange-500/50" :
                  triageScore === 3 ? "bg-yellow-950/40 border-yellow-500/50" :
                  "bg-slate-900/50 border-slate-800"
                )}>
                  <CardContent className="p-8 text-center relative overflow-hidden">
                    {/* Background glow pulse for critical */}
                    {triageScore === 1 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute inset-0 bg-red-500/20"
                      />
                    )}
                    
                    <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase mb-4">Interim Triage Priority</p>
                    <motion.div 
                      key={triageScore}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "text-8xl font-black mb-2",
                        triageScore === 1 ? "text-red-500" :
                        triageScore === 2 ? "text-orange-500" :
                        triageScore === 3 ? "text-yellow-500" :
                        "text-slate-500"
                      )}
                    >
                      {triageScore}
                    </motion.div>
                    <Badge variant="outline" className="text-lg px-4 py-1 mt-2 bg-slate-950/50">
                      Level: <span className="font-bold ml-2 text-white">{severity}</span>
                    </Badge>
                  </CardContent>
                </Card>

                {/* NLP Analysis Breakdown */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" /> AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Detected Condition</p>
                      <p className="text-slate-200 font-medium">{condition}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Distress Level</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            className={cn(
                              "h-full rounded-full",
                              distressLevel === "Extreme" ? "bg-red-500" :
                              distressLevel === "High" ? "bg-orange-500" :
                              distressLevel === "Moderate" ? "bg-yellow-500" :
                              "bg-green-500"
                            )}
                            initial={{ width: "25%" }}
                            animate={{ width: distressLevel === "Extreme" ? "100%" : distressLevel === "High" ? "75%" : distressLevel === "Moderate" ? "50%" : "25%" }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-300 w-16">{distressLevel}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Emergency Flags</p>
                      <div className="flex flex-wrap gap-2">
                        {criticalKeywords.length === 0 ? (
                          <span className="text-sm text-slate-600">No flags yet...</span>
                        ) : (
                          criticalKeywords.map((kw, i) => (
                            <Badge key={i} variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30 font-mono animate-in fade-in zoom-in">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {kw}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Extracted Symptoms</p>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                        {symptoms.length === 0 ? (
                          <li className="text-slate-600 list-none -ml-4">Listening for symptoms...</li>
                        ) : (
                          symptoms.map((sym, i) => (
                            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                              {sym}
                            </motion.li>
                          ))
                        )}
                      </ul>
                    </div>

                  </CardContent>
                </Card>

              </div>
            </motion.div>
          )}

          {callState === "ended" && (
            <motion.div
              key="ended"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6 bg-slate-900 border border-slate-800 p-12 rounded-2xl max-w-md shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 mb-6">
                <PhoneOff className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Call Disconnected</h2>
              <p className="text-slate-400">Final Triage Score: {triageScore}</p>
              <div className="pt-6 border-t border-slate-800 flex justify-center gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">Run Demo Again</Button>
                <Button 
                  onClick={() => {
                    sessionStorage.setItem("pendingCallTranscript", transcript);
                    window.location.href = '/emergency';
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Fill Emergency Form
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
