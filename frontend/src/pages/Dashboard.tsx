import { useEffect, useState } from "react";
// import { latestSession } from "../data/dashboardData";
import Sidebar from "../components/Sidebar";

import {
  ArrowRight,
  Brain,
  TrendingUp,
  FileText,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [latestSession, setLatestSession] = useState<any>(null);
  const [latestReflection, setLatestReflection] = useState<any>(null);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/session/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const latest = data[data.length - 1];
          setLatestSession(latest);
          if (latest?.id) {
            fetch(`http://127.0.0.1:8000/reflection/${latest.id}`)
              .then((res) => res.json())
              .then((reflection) => {
                setLatestReflection(reflection);
              })
              .catch(() => {});
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/session/history")
      .then((res) => res.json())
      .then((data) => {
        const latest = data.reverse().slice(0, 4);
        setRecentSessions(latest);
      })
      .catch((err) => console.error(err));
  }, []);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        {/* 
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wider">
                Welcome Back
              </p>

              <h1 className="text-5xl font-black text-slate-900 mt-2 leading-tight">
                Good Afternoon, Sejal
              </h1>

              <p className="text-slate-500 mt-3 text-xl">
                Your AI coaching performance is improving steadily.
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-500">Coaching Score</p>

              <h2 className="text-4xl font-bold text-slate-900">92%</h2>
            </div>
          </div>
        </div> */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100
text-slate-700 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                Coaching Performance Improving
              </div>

              <h1 className="text-5xl font-bold text-slate-900 mt-5">
                Welcome Back, {user?.name || "Tutor"}
              </h1>

              <p className="text-slate-500 text-lg mt-3 max-w-2xl">
                Your tutoring effectiveness has improved consistently over the
                last few sessions.
              </p>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => navigate("/insights")}
                  className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-medium hover:bg-slate-800 transition"
                >
                  View Insights
                </button>

                <span className="text-slate-900 font-semibold">
                  ↑ 12% this month
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-sm uppercase tracking-wider">
                Coaching Score
              </p>

              <h2 className="text-7xl font-bold text-slate-900 mt-2">
                {latestReflection?.reflection?.match(/\d+\/10/)?.[0] || "N/A"}
              </h2>
{/* 
              <h2 className="text-7xl font-bold text-slate-900 mt-2">
                {latestReflection?.score ?? 0}/10
              </h2> */}

              <p className="text-slate-900 font-medium mt-2">Excellent</p>
            </div>
          </div>
        </div>
        {/* Metrics */}

        <div className="grid grid-cols-4 gap-5 mt-6">
          <MetricCard
            icon={<Clock3 size={22} />}
            title="Sessions"
            value={stats?.total_sessions ?? 0}
          />
          <MetricCard
            icon={<Brain size={22} />}
            title="AI Hints"
            value={stats?.total_transcripts ?? 0}
          />
          <MetricCard
            icon={<FileText size={22} />}
            title="Reports"
            value={stats?.completed_sessions ?? 0}
          />
          <MetricCard
            icon={<TrendingUp size={22} />}
            title="Growth"
            value={stats?.active_sessions ?? 0}
          />
        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-12 gap-6 mt-10 items-start">
          <div className="col-span-8 flex flex-col gap-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 text-white">
              <p className="text-slate-300">Continue Coaching</p>

              <h2 className="text-3xl xl:text-4xl font-bold mt-3 leading-tight">
                Resume your latest tutoring session.
              </h2>

              <p className="text-slate-300 mt-4">
                {latestSession?.subject} • {latestSession?.topic}
              </p>

              <div className="mt-5">
                <div className="flex justify-between text-sm text-slate-300 mb-2">
                  <span>Session Progress</span>
                  <span>{latestSession?.status || "Active"}</span>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-white rounded-full"></div>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate("/reports", {
                    state: {
                      sessionId: latestSession?.id,
                    },
                  })
                }
                className="mt-6 bg-white text-slate-900 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2"
              >
                Continue Session
                <ArrowRight size={18} />
              </button>

              <div className="flex gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 flex-1">
                  <p className="text-slate-300 text-sm">AI Hints</p>

                  <h3 className="text-2xl font-bold mt-1">AI Ready</h3>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 flex-1">
                  <p className="text-slate-300 text-sm">Misconceptions</p>

                  <h3 className="text-2xl font-bold mt-1">
                    Reflection Available
                  </h3>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 flex-1">
                  <p className="text-slate-300 text-sm">Duration</p>

                  <h3 className="text-2xl font-bold mt-1">
                    {latestSession?.status}
                  </h3>
                </div>
              </div>
              <div className="flex gap-6 mt-6 text-sm text-slate-300">
                <span>✓ 7 AI Hints Generated</span>
                <span>✓ 3 Misconceptions Found</span>
                <span>✓ 92% Coaching Score</span>
              </div>
            </div>
          </div>

          {/* <div className="col-span-4">

            <div className="bg-white rounded-[32px] border border-slate-200 p-6 h-full">

              <div className="flex items-center gap-3">

                <Sparkles className="text-violet-500" />

                <h3 className="font-bold text-xl">
                  AI Insight
                </h3>

              </div>

              <div className="mt-6">

                <p className="text-slate-500 text-sm">
                  MOST COMMON CHALLENGE
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  Sign Errors
                </h2>

                <p className="text-slate-500 mt-3">
                  Students confuse sign inversion with algebraic operations.
                </p>

              </div>

            </div>

          </div> */}

          <div className="col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 h-full shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="text-slate-700" />

                <h3 className="font-bold text-xl text-slate-900">
                  AI Teaching Insight
                </h3>
              </div>

              <div className="mt-8">
                <p className="text-sm uppercase tracking-wider text-slate-500">
                  Most Common Challenge
                </p>

                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  Latest AI Reflection
                </h2>

                <p className="text-slate-600 mt-4 leading-relaxed">
                  {latestReflection?.reflection
                    ? latestReflection.reflection.slice(0, 200)
                    : "No AI reflection generated yet."}
                  .
                </p>

                <div className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl p-4">
                  <p className="text-violet-900 font-semibold">
                    Session Status
                  </p>

                  <p className="text-violet-700 text-sm mt-2">
                    {latestSession?.status || "Completed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions */}
        {/* Recent Sessions */}

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 mt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-4xl font-bold text-slate-900">
                Recent Sessions
              </h3>

              <p className="text-slate-500 mt-2">
                Review your latest AI-assisted tutoring sessions
              </p>
            </div>

            <button className="font-medium text-slate-700 hover:text-violet-700 transition">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {recentSessions.map((session: any) => (
              <div
                key={session.id}
                onClick={() =>
                  navigate("/reports", {
                    state: {
                      sessionId: session.id,
                    },
                  })
                }
                className="
      group
      bg-slate-50
      hover:bg-white
      border
      border-slate-200
      hover:border-slate-300
      rounded-3xl
      p-5
      transition-all
      duration-300
      hover:shadow-lg
      cursor-pointer
    "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      {session.subject}
                    </h4>

                    <p className="text-slate-500 mt-2">{session.topic}</p>
                  </div>

                  <span className="text-slate-400 text-sm">#{session.id}</span>
                </div>

                <div className="flex gap-2 mt-5">
                  <span
                    className="
          bg-violet-50
          text-violet-700
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
        "
                  >
                    {session.status}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm text-slate-500">Session ID</span>

                  <span className="font-bold text-green-600">
                    #{session.id}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/reports", {
                      state: {
                        sessionId: session.id,
                      },
                    });
                  }}
                  className="
        mt-4
        font-semibold
        text-slate-900
        hover:text-violet-700
        transition
      "
                >
                  View Report →
                </button>
              </div>
            ))}
            {/* Card 1

            <div
              onClick={() => navigate("/session")}
              className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Algebra Fundamentals
                  </h4>

                  <p className="text-slate-500 mt-2">
                    AI detected misconceptions related to sign inversion.
                  </p>
                </div>

                <span className="text-slate-400 text-sm">32 min</span>
              </div>

              <div className="flex gap-2 mt-5">
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium">
                  3 Errors
                </span>

                <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                  AI Assisted
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Coaching Score</span>

                <span className="font-bold text-green-600">91%</span>
              </div>
              <button
                onClick={() => navigate("/session")}
                className="font-semibold text-slate-900 hover:text-violet-700 transition"
              >
                View Report →
              </button>
            </div>

            {/* Card 2 */}

            {/* <div
              onClick={() => navigate("/session")}
              className="
group
bg-slate-50
hover:bg-white
border
border-slate-200
hover:border-slate-300
rounded-3xl
p-5
transition-all
duration-300
hover:shadow-lg
cursor-pointer
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Linear Equations
                  </h4>

                  <p className="text-slate-500 mt-2">
                    Generated 5 AI coaching recommendations.
                  </p>
                </div>

                <span className="text-slate-400 text-sm">28 min</span>
              </div>

              <div className="flex gap-2 mt-5">
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                  Completed
                </span>

                <span className="bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                  Reflection Ready
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Coaching Score</span>

                <p className="text-slate-900 font-bold">95%</p>
              </div>
              <button
                onClick={() => navigate("/session")}
                className="font-semibold text-slate-900 hover:text-violet-700 transition"
              >
                View Report →
              </button>
            </div> */}

            {/* Card 3 */}

            {/* <div
              onClick={() => navigate("/session")}
              className="
group
bg-slate-50
hover:bg-white
border
border-slate-200
hover:border-slate-300
rounded-3xl
p-5
transition-all
duration-300
hover:shadow-lg
cursor-pointer
"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Quadratic Equations
                  </h4>

                  <p className="text-slate-500 mt-2">
                    Student struggled with factorization concepts.
                  </p>
                </div>

                <span className="text-slate-400 text-sm">40 min</span>
              </div>

              <div className="flex gap-2 mt-5">
                <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  Needs Review
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Coaching Score</span>

                <p className="text-amber-600 font-bold">84%</p>
              </div>
              <button
                onClick={() => navigate("/session")}
                className="font-semibold text-slate-900 hover:text-violet-700 transition"
              >
                View Report →
              </button>
            </div> */}

            {/* Card 4 */}

            {/* <div
              onClick={() => navigate("/session")}
              className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Fractions & Ratios
                  </h4>

                  <p className="text-slate-500 mt-2">
                    Excellent student engagement throughout session.
                  </p>
                </div>

                <span className="text-slate-400 text-sm">24 min</span>
              </div>

              <div className="flex gap-2 mt-5">
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                  Excellent
                </span>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Coaching Score</span>

                <p className="text-violet-700 font-bold">91%</p>
              </div>
              <button
                onClick={() => navigate("/session")}
                className="font-semibold text-slate-900 hover:text-violet-700 transition"
              >
                View Report →
              </button>
            </div> */}
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 p-8 mt-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Today's AI Summary
          </h2>

          <div className="mt-6 grid grid-cols-3 gap-5">
            <div className="bg-slate-50 rounded-3xl p-6">
              <p className="text-slate-500">Students Coached</p>

              <h3 className="text-4xl font-bold text-slate-900 mt-2">4</h3>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6">
              <p className="text-slate-500">Misconceptions</p>

              <h3 className="text-4xl font-bold text-slate-900 mt-2">12</h3>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6">
              <p className="text-slate-500">AI Hints Generated</p>

              <h3 className="text-4xl font-bold text-slate-900 mt-2">27</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// function MetricCard({ icon, title, value }: any) {
//   return (
//     <div className="bg-white rounded-[28px] border border-slate-200 p-6">
//       <div className="text-slate-500">
//         {icon}
//       </div>

//       <p className="mt-4 text-slate-500">
//         {title}
//       </p>

//       <h3 className="text-3xl font-bold mt-1">
//         {value}
//       </h3>
//     </div>
//   );
// }

function MetricCard({ icon, title, value }: any) {
  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="text-slate-700">{icon}</div>

      <p className="mt-4 text-slate-500 font-medium">{title}</p>

      <h3 className="text-4xl font-bold text-slate-900 mt-2">{value}</h3>
    </div>
  );
}
