import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import {
  Sparkles,
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  Loader2,
  Wand2,
  PiggyBank,
  PieChart,
} from "lucide-react";
import axiosConfig from "../util/axios";
import { Endpoints } from "../util/apiEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setQuestion } from "../redux/aiSlice";

function useTypewriter(text, speed = 16) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isTyping };
}

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={`${keyPrefix}-b-${i}`}
          className="font-semibold text-gray-800"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>;
  });
}

function formatAiText(text) {
  if (!text) return null;

  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const elements = [];
  let listBuffer = [];

  const flushList = (key) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul
          key={`list-${key}`}
          className="list-disc list-inside space-y-1.5 my-1 pl-1"
        >
          {listBuffer.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-600 leading-7">
              {renderInline(item, `li-${key}-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
    } else {
      flushList(idx);
      elements.push(
        <p key={`p-${idx}`} className="text-sm text-gray-600 leading-7">
          {renderInline(trimmed, `p-${idx}`)}
        </p>,
      );
    }
  });
  flushList("end");

  return elements;
}

const AnimatedItem = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {children}
    </div>
  );
};

const AiPlanner = () => {
  const dispatch = useDispatch();
  const type = useSelector((state) => state.profiles.type);
  const dashboardData = useSelector((state) => state.team.dashboardData);
  const dashboard = useSelector((state) => state.profiles.dashboard);
  const question = useSelector((state) => state.ai.question);
  const summary = useSelector((state) => state.ai.summary);
  const recommendations = useSelector((state) => state.ai.recommendations);

  const [loading, setLoading] = useState(false);

  const { displayedText: typedSummary, isTyping } = useTypewriter(summary, 16);

  const data = type === "TEAM" ? dashboardData : dashboard;

  const suggestions = [
    { icon: PiggyBank, text: "How can I save more this month?" },
    { icon: PieChart, text: "Where is most of my money going?" },
    { icon: Target, text: "Help me build a budget plan" },
  ];

  async function fetchQuestion() {
    if (!question) {
      alert("Write the question down");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosConfig.post(Endpoints.ASKAI, {
        type: type,
        question: question,
        dashboardData: data,
      });

      if (response.status === 200) {
        dispatch(setAnswer(response.data));
        dispatch(setQuestion(""));
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleAsk() {
    fetchQuestion();
  }

  const hasResponse =
    summary || (recommendations && recommendations.length > 0);

  return (
    <div>
      <Dashboard activeMenu={"AI Planner"}>
        <div className="my-5 mx-auto max-w-3xl">
          <div className="relative text-center pt-10 pb-8 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-300/30 rounded-full blur-3xl -z-10" />
            <div className="absolute top-10 left-1/3 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl -z-10" />

            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rotate-6 opacity-20 blur-sm" />
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-xl shadow-violet-200/70 ring-4 ring-white">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR90aJrOjVwRPxa4ps9o2Mp3dV-gs8IgAdXONmbXUYv6w&s=10"
                  alt="AI Planner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center ring-4 ring-white">
                <Sparkles className="text-white" size={12} />
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
              Your AI Planner
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Ask anything about your money and get a plan tailored to your
              spending, income, and goals
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 mb-6">
            {suggestions.map(({ icon: Icon, text }, i) => (
              <button
                key={i}
                onClick={() => dispatch(setQuestion(text))}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-200 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon className="text-violet-600" size={11} />
                </span>
                {text}
              </button>
            ))}
          </div>

          <div className="relative rounded-[28px] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-2 mb-8">
            <div className="rounded-3xl bg-gradient-to-br from-violet-50/80 via-white to-emerald-50/60 p-5 sm:p-6">
              <textarea
                value={question}
                onChange={(e) => dispatch(setQuestion(e.target.value))}
                placeholder="I want to save $500 by the end of this month — how should I adjust my spending?"
                rows={3}
                disabled={loading}
                className="w-full resize-none bg-transparent text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none leading-relaxed disabled:opacity-60"
              />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100/80">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Wand2 size={13} className="text-violet-400" />
                  Personalized using your dashboard data
                </div>
                <button
                  onClick={handleAsk}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:brightness-110 transition-all text-white font-semibold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-violet-300/50 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  {loading ? "Thinking..." : "Ask Planner"}
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3">
                <Loader2 className="text-violet-500 animate-spin" size={18} />
                <p className="text-sm text-gray-500">
                  Thinking through your finances...
                </p>
              </div>
            </div>
          )}

          {!loading && hasResponse && (
            <div className="space-y-4 pb-10">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  AI Response
                </p>
              </div>

              {summary && (
                <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-7">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                      <img
                        src="/ai-summary.png"
                        alt="Summary"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800">
                      Summary
                    </h3>
                  </div>

                  <div className="space-y-2 pl-11.5">
                    {formatAiText(typedSummary)}
                    {isTyping && (
                      <span className="inline-block w-1.5 h-4 bg-violet-400 ml-0.5 align-middle animate-pulse" />
                    )}
                  </div>
                </div>
              )}

              {!isTyping && recommendations && recommendations.length > 0 && (
                <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-7">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0">
                      <Target className="text-emerald-600" size={16} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800">
                      Recommendations
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {recommendations.map((rec, i) => (
                      <AnimatedItem key={i} delay={i * 130}>
                        <div className="group flex items-start gap-3 bg-gradient-to-r from-emerald-50/80 to-transparent border border-emerald-100/80 rounded-2xl px-4 py-3.5 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-emerald-200">
                            <TrendingUp className="text-white" size={12} />
                          </div>
                          <p className="text-sm text-gray-700 leading-7">
                            {renderInline(rec, `rec-${i}`)}
                          </p>
                        </div>
                      </AnimatedItem>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Dashboard>
    </div>
  );
};

export default AiPlanner;
