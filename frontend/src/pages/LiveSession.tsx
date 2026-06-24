// import { transcript, TranscriptItem } from "../data/sessionData";
// import { transcript } from "../data/sessionData";
import type { TranscriptItem } from "../data/sessionData";
import Sidebar from "../components/Sidebar";

import { useState, useRef, useEffect } from "react";
import {
  generateHint,
  detectMisconception,
  getNextStep,
} from "../services/aiService";

// import { generateHint } from "../services/aiService";
import {
  Lightbulb,
  Brain,
  BookOpen,
  ArrowRight,
  Sparkles,
  Mic,
} from "lucide-react";

export default function LiveSession() {
  // const [aiHint, setAiHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachResponse, setCoachResponse] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [misconception, setMisconception] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  // const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/transcript/${sessionId}`,
        );

        const data = await response.json();

        const formatted = data.map((item: any) => ({
          id: item.id,
          role: item.speaker === "Student" ? "student" : "tutor",
          message: item.message,
        }));

        setTranscript(formatted);
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);
  // const [sessionId, setSessionId] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const chunksRef = useRef<Blob[]>([]);
  const [aiHint, setAiHint] = useState(
    "Record a session to generate AI guidance.",
  );

  const handleGenerateHint = async () => {
    try {
      setLoading(true);

      const result = await generateHint(liveTranscript);

      setAiHint(result.hint);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const startSession = async () => {
    if (!subject.trim() || !topic.trim()) {
      alert("Please enter Subject and Topic");
      return null;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
        }),
      });

      const data = await response.json();

      console.log("Session Created:", {
        subject,
        topic,
        sessionId: data.session_id,
      });

      setSessionId(data.session_id);

      return data.session_id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const startRecording = async () => {
    const currentSessionId = await startSession();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = async (event) => {
        if (event.data.size === 0) return;

        const formData = new FormData();

        formData.append("file", event.data, "chunk.webm");

        try {
          const response = await fetch(
            "http://127.0.0.1:8000/transcript/upload",
            {
              method: "POST",
              body: formData,
            },
          );

          const data = await response.json();

          if (data.transcript) {
            setLiveTranscript((prev) => prev + " " + data.transcript);

            if (currentSessionId) {
              await fetch("http://127.0.0.1:8000/session/save-transcript", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  session_id: currentSessionId,
                  transcript: data.transcript,
                }),
              });
            }

            const hintData = await generateHint(data.transcript);

            setAiHint(hintData.hint);

            const misconceptionData = await detectMisconception(
              data.transcript,
            );

            setMisconception(misconceptionData.misconception);

            const nextStepData = await getNextStep(data.transcript);

            setNextStep(nextStepData.next_step);
          }
        } catch (error) {
          console.error(error);
        }
      };

      // recorder.onstop = async () => {
      //   const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

      //   const formData = new FormData();

      //   formData.append("file", audioBlob, "session.webm");

      //   try {
      //     const response = await fetch(
      //       "http://127.0.0.1:8000/transcript/upload",
      //       {
      //         method: "POST",
      //         body: formData,
      //       },
      //     );
      //     const data = await response.json();

      //     console.log(data);

      //     const transcriptText = data.transcript || "";

      //     setLiveTranscript(transcriptText);
      //     await fetch("http://127.0.0.1:8000/session/save-transcript", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         session_id: currentSessionId,
      //         transcript: transcriptText,
      //       }),
      //     });

      //     if (transcriptText) {
      //       try {
      //         const hintData = await generateHint(transcriptText);

      //         setAiHint(hintData.hint);

      //         const misconceptionData =
      //           await detectMisconception(transcriptText);

      //         setMisconception(misconceptionData.misconception);

      //         const nextStepData = await getNextStep(transcriptText);

      //         setNextStep(nextStepData.next_step);
      //       } catch (error) {
      //         console.error("AI Error:", error);
      //       }
      //     }
      //   } catch (error) {
      //     console.error(error);
      //   }

      //   await endSession(currentSessionId);
      // };
      recorder.onstop = async () => {
        try {
          await endSession(currentSessionId);
        } catch (error) {
          console.error(error);
        }
      };
      recorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const endSession = async (currentSessionId: number) => {
    if (!currentSessionId) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/session/end/${currentSessionId}`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      console.log("Session Ended:", data);
    } catch (error) {
      console.error(error);
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    setIsRecording(false);
  };

  const sendCoachMessage = async () => {
    if (!coachQuestion.trim()) return;

    setCoachLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ai/coach-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: coachQuestion,
          transcript: liveTranscript,
        }),
      });

      const data = await response.json();

      setCoachResponse(data.response);
    } catch (error) {
      console.error(error);
    }

    setCoachLoading(false);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/transcript/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);

    setLiveTranscript(data.transcript);
  };
  //   const {
  //   transcript,
  //   isListening,
  //   startListening,
  //   stopListening,
  // } = useSpeechRecognition();
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {" "}
      <Sidebar />
      <main className="ml-72 p-8 min-h-screen">
        {/* Workspace Header */}

        <div className="bg-white border border-slate-200 rounded-3xl px-6 py-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Live Coaching Workspace
              </h1>

              <p className="text-slate-500 mt-1">
                Real-time AI instructional guidance
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
                  }`}
                />

                <span className="font-medium text-slate-700">
                  {isRecording ? "RECORDING" : "READY"}
                </span>
              </div>

              <button
                onClick={() =>
                  sessionId &&
                  window.open(
                    `http://127.0.0.1:8000/export/report/${sessionId}`,
                  )
                }
                className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition"
              >
                Export Session
              </button>

              <button
                onClick={() => {
                  if (sessionId) {
                    endSession(sessionId);
                  }
                }}
                className="bg-red-500 text-white px-5 py-3 rounded-2xl hover:bg-red-600 transition"
              >
                End Session
              </button>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-green-600 text-white px-5 py-3 rounded-2xl"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white px-5 py-3 rounded-2xl"
                >
                  Stop Recording
                </button>
              )}

              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl">
                Upload Recording
                <input
                  type="file"
                  accept=".mp3,.wav,.webm,.mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {/* <div className="flex gap-4 mb-4">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Subject"
                  className="border p-3 rounded-xl flex-1"
                />

                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter Topic"
                  className="border p-3 rounded-xl flex-1"
                />
              </div> */}

          <div className="mt-5 grid grid-cols-2 gap-4">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter Subject"
              disabled={isRecording}
              className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter Topic"
              disabled={isRecording}
              className="border border-slate-300 rounded-xl px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* AI Recommendation */}

        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white shadow-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-violet-300">
                <Sparkles size={18} />
                <span>Current AI Recommendation</span>
              </div>

              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-orange-300">Hint</h3>

                  <p>{aiHint || "Waiting..."}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-red-300">Misconception</h3>

                  <p>{misconception || "None detected"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-300">Next Step</h3>

                  <p>{nextStep || "Waiting..."}</p>
                </div>
              </div>

              <p className="text-slate-300 mt-3 max-w-2xl">
                AI-powered instructional coaching recommendations will appear
                here.
              </p>
            </div>

            {/* <button className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition">
              Generate Hint
            </button> */}

            <button
              onClick={handleGenerateHint}
              disabled={!liveTranscript}
              className="px-4 py-3 rounded-xl bg-[#0B1739] text-white"
            >
              {loading ? "Generating..." : "Generate Hint"}
            </button>
          </div>

          {aiHint && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                AI Generated Hint
              </h3>

              <p className="text-blue-800">
                {" "}
                {liveTranscript || "No transcript available yet"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-slate-300 text-sm">Transcript Length</p>

              <h3 className="text-2xl font-bold mt-1">
                {liveTranscript.length}
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-slate-300 text-sm">Misconception</p>

              <h3 className="text-sm font-medium mt-1">
                {misconception || "None"}
              </h3>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-slate-300 text-sm">Next Step</p>

              <h3 className="text-sm font-medium mt-1">
                {nextStep || "Waiting..."}
              </h3>
            </div>
          </div>
        </div>

        {/* Workspace */}

        <div className="grid grid-cols-12 gap-6">
          {/* Transcript */}

          <div className="col-span-8 bg-white rounded-[32px] border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Live Transcript
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Conversation updates in real time
                </p>
              </div>

              <Mic className="text-red-500" />
            </div>
            <div className="p-6 space-y-5 h-[420px] overflow-y-auto">
              {liveTranscript && (
                <div className="mb-6 p-5 rounded-2xl bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Latest Whisper Transcript
                  </h3>

                  <p className="text-blue-800">{liveTranscript}</p>
                </div>
              )}
              {transcript.map((item: TranscriptItem) => (
                <div
                  key={item.id}
                  className={
                    item.role === "student" ? "flex" : "flex justify-end"
                  }
                >
                  <div
                    className={
                      item.role === "student"
                        ? "max-w-[70%] bg-white border border-slate-200 rounded-3xl p-5 shadow-sm"
                        : "max-w-[70%] bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5"
                    }
                  >
                    <p
                      className={
                        item.role === "student"
                          ? "font-semibold text-slate-900 mb-2"
                          : "font-semibold mb-2"
                      }
                    >
                      {item.role === "student" ? "Student" : "Tutor"}
                    </p>

                    <p
                      className={
                        item.role === "student" ? "text-slate-700" : ""
                      }
                    >
                      {item.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}

          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5">
                AI Tools
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="group p-5 rounded-3xl border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer">
                  <Lightbulb className="text-amber-500" />
                  <p className="mt-3 font-semibold text-slate-900">Hint</p>
                </div>

                <div className="group p-5 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                  <BookOpen className="text-blue-500" />
                  <p className="mt-3 font-semibold text-slate-900">Practice</p>
                </div>

                <div className="group p-5 rounded-3xl border border-slate-200 hover:border-rose-300 hover:shadow-lg transition-all cursor-pointer">
                  <Brain className="text-rose-500" />
                  <p className="mt-3 font-semibold text-slate-900">
                    Detect Error
                  </p>
                </div>

                <div className="group p-5 rounded-3xl border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer">
                  <ArrowRight className="text-green-500" />
                  <p className="mt-3 font-semibold text-slate-900">Next Step</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Live Insights
              </h2>

              <div className="mt-4 bg-violet-50 border border-violet-100 p-4 rounded-2xl">
                <p className="font-semibold text-violet-900">
                  Misconception Detected
                </p>

                <p className="text-violet-700 text-sm mt-2">{aiHint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat */}

        {/* <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm mt-6 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              AI Coaching Chat
            </h2>

            <p className="text-slate-500 mt-1 text-sm">
              Ask questions about teaching strategies and misconceptions.
            </p>
          </div>

          <div className="p-6">
            <div className="flex gap-4">
              {coachResponse && (
                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <p className="font-semibold text-slate-900 mb-2">AI Coach</p>

                  <p className="text-slate-700 whitespace-pre-wrap">
                    {coachResponse}
                  </p>
                </div>
              )}
              <input
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="Ask AI Coach..."
                className="flex-1 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={sendCoachMessage}
                className="bg-slate-900 text-white px-8 rounded-2xl hover:bg-slate-800 transition"
              >
                {coachLoading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div> */}

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm mt-6 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">
              AI Coaching Chat
            </h2>

            <p className="text-slate-500 mt-1 text-sm">
              Ask questions about teaching strategies and misconceptions.
            </p>
          </div>

          {/* AI Response Area */}
          <div className="p-6 max-h-[350px] overflow-y-auto">
            {coachResponse ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="font-semibold text-slate-900 mb-3">AI Coach</p>

                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {coachResponse}
                </p>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-10">
                Ask a question to get coaching guidance.
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <input
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="Ask AI Coach..."
                className="
          flex-1
          border
          border-slate-200
          rounded-2xl
          px-5
          py-4
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500
        "
              />

              <button
                onClick={sendCoachMessage}
                disabled={coachLoading}
                className="
          bg-slate-900
          text-white
          px-8
          py-4
          rounded-2xl
          hover:bg-slate-800
          transition
          whitespace-nowrap
        "
              >
                {coachLoading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
