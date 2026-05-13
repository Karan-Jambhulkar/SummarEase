import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FileText,
  Sparkles,
  Upload,
  ArrowRight,
  SunMedium,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useTheme } from "next-themes";

import logo from "@/assets/logo.png";

function Home() {
  const { theme, setTheme } =
    useTheme();

  const darkMode =
    theme === "dark";

  const pageBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-white text-slate-900";

  const navbarBg = darkMode
    ? "bg-zinc-950/75 border-zinc-800"
    : "bg-white/80 border-slate-200/70";

  const cardBg = darkMode
    ? "bg-zinc-900/80 border-zinc-800"
    : "bg-white/85 border-slate-200/80";

  const softText = darkMode
    ? "text-zinc-400"
    : "text-slate-600";

  const sectionReveal = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${pageBg}`}>
      {/* Glow background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[220px] h-[420px] w-[420px] rounded-full bg-purple-400/20 blur-[130px]" />
      <div className="pointer-events-none absolute left-[-120px] bottom-[-120px] h-[360px] w-[360px] rounded-full bg-sky-300/20 blur-[120px]" />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-20 border-b backdrop-blur-xl ${navbarBg}`}
      >
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center">
            <img
              src={logo}
              alt="SummarEase Logo"
              className="
                h-28
                md:h-32
                w-auto
                object-contain
                transition-all
                duration-300
                hover:scale-105
                drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]
              "
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setTheme(
                  darkMode
                    ? "light"
                    : "dark"
                )
              }
              className={`
                inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all
                ${
                  darkMode
                    ? "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                }
              `}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunMedium className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

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
        </div>
      </motion.nav>

      <main className="relative z-10">
        {/* Hero */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl px-6 py-24 text-center lg:px-10 lg:py-28"
        >
          <div
            className={`
              mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm
              ${
                darkMode
                  ? "border-zinc-700 bg-zinc-900/80 text-zinc-200"
                  : "border-slate-200 bg-white/80 text-slate-700"
              }
            `}
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI Powered Video Intelligence
          </div>

          <h1 className="mt-8 text-6xl font-bold leading-tight tracking-tight sm:text-6xl">
            Transform Long Videos Into
            <span className="block bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Intelligent Summaries
            </span>
          </h1>

          <p className={`mx-auto mt-6 max-w-3xl text-xl leading-8 ${softText}`}>
            SummarEase uses Whisper ASR and Transformer-based NLP models to
            generate concise summaries, transcripts, and insights from
            long-form videos.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="
                  h-14 rounded-2xl px-8 text-lg font-semibold
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  text-white shadow-xl shadow-blue-500/20
                  hover:from-blue-600 hover:to-indigo-700
                  hover:scale-[1.03] transition-all
                "
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <a href="#features">
              <Button
                variant="outline"
                size="lg"
                className={`
                  h-14 rounded-2xl px-8 text-lg font-semibold transition-all
                  ${
                    darkMode
                      ? "border-zinc-700 bg-zinc-900/60 text-white hover:bg-zinc-800"
                      : "border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-100"
                  }
                `}
              >
                Explore Features
              </Button>
            </a>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          id="features"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-6 py-16 lg:px-10"
        >
          <h2 className="text-center text-4xl font-bold tracking-tight">
            Features
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl text-center ${softText}`}>
            A clean AI dashboard built for video summarization, transcript
            extraction, and intelligent output presentation.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Upload,
                title: "Video Upload",
                desc: "Upload MP4 videos and process them through an AI-powered summarization pipeline.",
              },
              {
                icon: Brain,
                title: "Whisper ASR",
                desc: "Uses OpenAI Whisper for robust speech-to-text transcription.",
              },
              {
                icon: FileText,
                title: "Smart Summaries",
                desc: "Generate concise paragraph or bullet summaries using Transformer NLP models.",
              },
              {
                icon: Sparkles,
                title: "Multiple Modes",
                desc: "Supports short, medium, and detailed summary generation.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={sectionReveal}
                  whileHover={{ y: -6 }}
                  className={`
                    rounded-3xl border p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]
                    backdrop-blur-sm transition-all
                    ${cardBg}
                  `}
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-zinc-900 text-white shadow-lg shadow-blue-200/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className={`mt-3 leading-7 ${softText}`}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Pipeline */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl px-6 py-16 lg:px-10"
        >
          <h2 className="text-center text-4xl font-bold tracking-tight">
            AI Processing Pipeline
          </h2>
          <p className={`mx-auto mt-4 max-w-2xl text-center ${softText}`}>
            A guided flow that mirrors the backend architecture: input,
            extraction, transcription, summarization, and final output.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-5">
            {[
              "Upload Video",
              "Audio Extraction",
              "Whisper ASR",
              "BART NLP",
              "Final Summary",
            ].map((step, index) => (
              <motion.div
                key={step}
                variants={sectionReveal}
                whileHover={{ y: -4 }}
                className={`
                  rounded-2xl border px-4 py-6 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)]
                  ${cardBg}
                `}
              >
                {/* <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/200">
                  {index + 1}
                </div> */}
                <div className="text-sm font-semibold">{step}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-6xl px-6 py-20 lg:px-10"
        >
          <div
            className={`
              overflow-hidden rounded-[2rem] border p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]
              backdrop-blur-sm sm:p-14
              ${cardBg}
            `}
          >
            <h2 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Start Summarizing The Videos
              {/* <span className="block bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                Intelligently
              </span> */}
            </h2>

            <p className={`mx-auto mt-5 max-w-2xl text-lg leading-8 ${softText}`}>
              Save time and extract meaningful insights instantly using AI.
            </p>

            <Link to="/dashboard">
              <Button
                size="lg"
                className="
                  mt-10 h-14 rounded-2xl px-10 text-lg font-semibold
                  bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                  text-white shadow-xl shadow-blue-500/20
                  hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700
                  hover:scale-[1.03] transition-all
                "
              >
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.section>
      </main>

      <footer
        className={`
          border-t py-8 text-center backdrop-blur-sm
          ${darkMode
            ? "border-zinc-800 bg-zinc-950/70 text-zinc-500"
            : "border-slate-200 bg-white/70 text-slate-500"}
        `}
      >
        © 2026 SummarEase — AI Video Summarization Platform
      </footer>
    </div>
  );
}

export default Home;