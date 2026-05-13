import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Video,
  Cpu,
  Layers3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function About() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  const pageBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-white text-slate-900";

  const cardBg = darkMode
    ? "border-zinc-800 bg-zinc-900/80 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
    : "border-slate-200/80 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)]";

  const titleColor = darkMode ? "text-white" : "text-slate-900";
  const softText = darkMode ? "text-zinc-400" : "text-slate-600";

  const sectionReveal = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: Video,
      title: "MP4 Video Input",
      desc: "Supports local MP4 uploads for backend processing and summarization.",
    },
    {
      icon: Brain,
      title: "Whisper ASR",
      desc: "Converts spoken content into clean transcript text for analysis.",
    },
    {
      icon: Layers3,
      title: "Multimodal Pipeline",
      desc: "Combines audio and visual signals when needed for stronger summaries.",
    },
    {
      icon: FileText,
      title: "Adaptive Summaries",
      desc: "Generates paragraph or bullet summaries in short, medium, or detailed form.",
    },
    {
      icon: Cpu,
      title: "Backend Job Flow",
      desc: "Uses asynchronous job IDs and status polling for responsive processing.",
    },
    {
      icon: Sparkles,
      title: "Clean AI Interface",
      desc: "A polished dashboard with modern dark/light theming and animated UX.",
    },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${pageBg}`}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-80px] top-[220px] h-[320px] w-[320px] rounded-full bg-purple-400/15 blur-[120px]" />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-10"
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.55)]" />
          About SummarEase
        </div>

        <h1 className={`text-5xl font-bold leading-tight tracking-tight sm:text-6xl ${titleColor}`}>
          Intelligent Video Summarization
        </h1>

        <p className={`mt-4 max-w-4xl text-lg leading-8 ${softText}`}>
          SummarEase is an AI-powered video summarization platform built as a
          final year project. It is designed to convert long videos into concise,
          meaningful summaries using a multimodal backend pipeline.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/dashboard">
            <Button
              className="
                h-12 rounded-xl px-6 text-base font-semibold
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white shadow-lg shadow-blue-500/20
                hover:from-blue-600 hover:to-indigo-700
                hover:scale-[1.03] transition-all
              "
            >
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
      >
        <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
          <CardContent className="p-8">
            <h2 className={`text-3xl font-semibold ${titleColor}`}>
              Project Overview
            </h2>
            <p className={`mt-4 max-w-5xl text-lg leading-8 ${softText}`}>
              The system accepts a video input and processes it through multiple
              stages such as audio extraction, speech transcription, scene
              analysis, keyframe captioning, and final summary generation. The
              backend is designed to adapt to the content of the video, so it
              can rely more on audio, more on visuals, or both together.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
      >
        <h2 className={`mb-6 text-3xl font-semibold ${titleColor}`}>
          Key Features
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={sectionReveal}
                whileHover={{ y: -6 }}
              >
                <Card className={`h-full rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
                  <CardContent className="p-6">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={`text-xl font-bold ${titleColor}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-3 leading-7 ${softText}`}>
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:px-10 xl:grid-cols-2">
        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
            <CardContent className="p-8">
              <h2 className={`text-3xl font-semibold ${titleColor}`}>
                Backend Pipeline
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "Video upload / YouTube input",
                  "Audio extraction",
                  "Whisper transcription",
                  "Visual scene detection",
                  "Keyframe captioning",
                  "Final summary generation",
                ].map((step) => (
                  <div
                    key={step}
                    className={`
                      rounded-2xl border px-5 py-4 text-base
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"}
                    `}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
            <CardContent className="p-8">
              <h2 className={`text-3xl font-semibold ${titleColor}`}>
                Technologies Used
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "React",
                  "Tailwind CSS",
                  "FastAPI / Python",
                  "Whisper",
                  "BLIP",
                  "DistilBART",
                  "OpenCV",
                  "yt-dlp",
                ].map((tech) => (
                  <div
                    key={tech}
                    className={`
                      rounded-2xl border px-5 py-4 text-base font-medium
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"}
                    `}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
      >
        <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
          <CardContent className="p-8">
            <h2 className={`text-3xl font-semibold ${titleColor}`}>
              Why This Project Matters
            </h2>
            <p className={`mt-4 max-w-5xl text-lg leading-8 ${softText}`}>
              The goal of SummarEase is to reduce the time required to consume
              long videos while still preserving the important information.
              Instead of manually watching long content, the user receives a
              concise and structured summary generated by the AI pipeline.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 py-8 lg:px-10 pb-16"
      >
        <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
          <CardContent className="p-8">
            <h2 className={`text-3xl font-semibold ${titleColor}`}>
              Future Scope
            </h2>
            <ul className={`mt-4 list-disc space-y-3 pl-6 text-lg leading-8 ${softText}`}>
              <li>Better transcript display and downloadable report generation.</li>
              <li>Improved support for YouTube-based summarization workflows.</li>
              <li>More advanced visual reasoning for slide-heavy videos.</li>
              <li>History storage for previously summarized videos.</li>
              <li>Deployment with optimized performance for real users.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default About;