import Sidebar from "../components/Sidebar";
import { Sparkles, Brain, TrendingUp, AlertTriangle } from "lucide-react";

import { useEffect, useState } from "react";
// import {API_URL} from "../services/api";
// useEffect(() => {
//   fetch("http://127.0.0.1:8000/insights")
//     .then((res) => res.json())
//     .then((data) => setInsights(data))
//     .catch(console.error);
// }, []);
export default function Insights() {
  const [insights, setInsights] = useState<any>(null);
  useEffect(() => {
    fetch("${API_URL}/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data))
      .catch(console.error);
  }, []);
  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Sidebar />

      <main className="ml-72 p-10">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            AI Teaching Insights
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Discover learning patterns, misconceptions and coaching trends.
          </p>
          {/* <p className="text-slate-500 mt-2">
            Analyze coaching effectiveness and teaching patterns.
          </p> */}
        </div>

        {/* Stats */}

        <div className="grid grid-cols-4 gap-6 mb-8">
          {insights &&
            [
              {
                title: "Total Sessions",
                value: insights.stats.total_sessions,
              },
              {
                title: "Completed Sessions",
                value: insights.stats.completed_sessions,
              },
              {
                title: "Transcripts",
                value: insights.stats.total_transcripts,
              },
              {
                title: "Avg Coaching Score",
                value: insights.stats.coaching_score,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm"
              >
                <p className="text-slate-500">{item.title}</p>

                <h2 className="text-4xl font-bold mt-3 text-slate-900">
                  {item.value}
                </h2>
              </div>
            ))}
        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-12 gap-6">
          {/* Misconceptions */}

          <div className="col-span-7 bg-white rounded-[28px] border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Brain className="text-violet-600" />

              <h2 className="text-3xl font-bold text-slate-900">
                Common Misconceptions
              </h2>
            </div>

            <div className="space-y-5">
              {insights?.misconceptions?.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-800">
                      {item.topic}
                    </span>

                    <span className="font-semibold text-slate-700">
                      {item.count}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full">
                    <div
                      className="bg-slate-900 h-3 rounded-full"
                      style={{
                        width: `${item.count * 6}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}

          <div className="col-span-5 bg-white rounded-[28px] border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-violet-600" />

              <h2 className="text-3xl font-bold text-slate-900">
                AI Recommendations
              </h2>
            </div>

            <div className="space-y-4">
              {insights?.recommendations?.map((item: string, index: number) => (
                <div
                  key={index}
                  className="bg-violet-50 border border-violet-200 rounded-2xl p-5 text-slate-800 font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Section */}

        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-6 bg-white rounded-[28px] border border-slate-200 p-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-green-600" />

              <h2 className="text-3xl font-bold text-slate-900">
                Teaching Growth
              </h2>
            </div>

            <h1 className="text-6xl font-bold mt-6 text-slate-900">+18%</h1>

            <p className="text-slate-700 mt-3 text-lg">
              Improvement in coaching effectiveness over the last month.
            </p>
          </div>

          <div className="col-span-6 bg-white rounded-[28px] border border-slate-200 p-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" />

              <h2 className="text-3xl font-bold text-slate-900">Focus Area</h2>
            </div>

            <h1 className="text-5xl font-bold mt-6 text-slate-900">
              Algebra Sign Errors
            </h1>

            <p className="text-slate-700 mt-4 text-lg">
              This remains the most common misconception across tutoring
              sessions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
