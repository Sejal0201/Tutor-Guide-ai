import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {API_URL} from "../services/api";
interface SessionItem {
  id: number;
  subject: string;
  topic: string;
  status: string;
}

interface TranscriptItem {
  speaker: string;
  message: string;
}

interface ReflectionData {
  summary: string;
  strengths: string;
  improvements: string;
  score: number;
  reflection: string;
}

export default function Reports() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [reflection, setReflection] = useState<ReflectionData | null>(null);
  const location = useLocation();
  useEffect(() => {
    fetch("${API_URL}/session/history")
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    if (location.state?.sessionId) {
      loadReport(location.state.sessionId);
    }
  }, [location.state]);
  const loadReport = async (id: number) => {
    try {
      const response = await fetch(
        `${API_URL}/session/report/${id}`,
      );

      const reportData = await response.json();

      setSelectedSession(reportData);

      try {
        const reflectionResponse = await fetch(
          `${API_URL}/reflection/${id}`,
        );

        if (reflectionResponse.ok) {
          const reflectionData = await reflectionResponse.json();

          setReflection(reflectionData);
        }
      } catch (error) {
        console.log("Reflection not available yet");
      }
    } catch (error) {
      console.error("Error loading report:", error);
    }
  };
  const deleteSession = async (id: number) => {
    try {
      await fetch(`${API_URL}/session/delete/${id}`, {
        method: "DELETE",
      });

      setSessions(sessions.filter((session) => session.id !== id));

      if (selectedSession?.session?.id === id) {
        setSelectedSession(null);
        setReflection(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <main className="ml-72 p-10">
        <div className="mb-8">
          {/* <h1 className="text-4xl font-bold text-slate-900">Session Reports</h1>

          <p className="text-slate-500 mt-2">
            Review transcripts, reflections and coaching insights.
          </p> */}

          <h1 className="text-5xl font-bold text-slate-900">
            Session Analytics
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            Review transcripts, reflections and coaching outcomes.
          </p>
        </div>
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT PANEL */}
          <div className="col-span-3 bg-white rounded-3xl p-6 shadow">
            <h2 className="font-bold text-xl mb-4">Sessions</h2>

            {sessions.length === 0 ? (
              <p className="text-slate-500">No sessions found</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="
  mb-4
  bg-slate-50
  hover:bg-white
  border
  border-slate-200
  rounded-3xl
  p-5
  transition-all
  hover:shadow-lg
  "
                >
                  <button
                    onClick={() => loadReport(session.id)}
                    className="w-full text-left"
                  >
                    {/* <p className="font-semibold">Session #{session.id}</p> */}
                    <p className="font-bold text-lg">{session.subject}</p>

                    <p className="text-slate-500">{session.topic}</p>
                    <p className="text-sm text-slate-500">{session.subject}</p>

                    <p className="text-sm text-slate-500">{session.topic}</p>

                    <p className="text-xs text-blue-500 mt-1">
                      {session.status}
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Delete this session?")) {
                        deleteSession(session.id);
                      }
                    }}
                    className="
    mt-3
    bg-red-500
    text-white
    px-3
    py-1
    rounded-lg
    text-sm
  "
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-9 bg-white rounded-3xl p-6 shadow">
            {!selectedSession ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500">
                  Select a session to view report
                </p>
              </div>
            ) : (
              <>
                {/* SESSION INFO */}
                <h2 className="text-3xl font-bold mb-2">
                  {selectedSession.session.subject}
                </h2>

                <p className="text-slate-600 mb-2">
                  Topic: {selectedSession.session.topic}
                </p>

                <p className="text-slate-600 mb-6">
                  Status: {selectedSession.session.status}
                </p>

                {/* TRANSCRIPT */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Transcript</h3>

                  <div className="space-y-3">
                    {selectedSession.transcripts?.map(
                      (item: TranscriptItem, index: number) => (
                        <div
                          key={index}
                          className={
                            item.speaker.toLowerCase() === "student"
                              ? "flex"
                              : "flex justify-end"
                          }
                        >
                          <p className="font-semibold text-blue-600">
                            {item.speaker}
                          </p>

                          <p className="mt-1">{item.message}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* AI REFLECTION */}
                {/* <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">AI Reflection</h3>

                {reflection ? (
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">Summary</p>
                      <p>{reflection.summary}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Strengths</p>
                      <p>{reflection.strengths}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Improvements</p>
                      <p>{reflection.improvements}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Coaching Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {reflection.score}/10
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">
                    Reflection report not available.
                  </p>
                )}
              </div> */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">
                    AI Reflection Report
                  </h3>

                  {reflection ? (
                    //                   <pre  className="
                    // bg-violet-50
                    // border
                    // border-violet-100
                    // rounded-3xl
                    // p-6
                    // ">
                    //                     {reflection.reflection}
                    //                   </pre>
                    <div
                      className="
  whitespace-pre-wrap
  break-words
  text-slate-700
  text-sm
  leading-7
  "
                    >
                      {reflection.reflection}
                    </div>
                  ) : (
                    <p>Reflection not available</p>
                  )}
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `${API_URL}/export/report/${selectedSession.session.id}`,
                    )
                  }
                  className="
  
mt-6
bg-[#fdab23]
hover:bg-[#f59e0b]
text-white
font-semibold
px-6
py-3
rounded-2xl
transition
"
                >
                  Export PDF
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
