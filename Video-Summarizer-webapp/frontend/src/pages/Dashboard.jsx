import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import api from "@/api/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Dashboard() {
  const { resolvedTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  
  const [sourceType, setSourceType] = useState("upload");
  const [file, setFile] = useState(null);
  const [youtubeURL, setYoutubeURL] = useState("");
  const [videoURL, setVideoURL] = useState("");

  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [benchmarks, setBenchmarks] = useState(null);

  const [formatType, setFormatType] = useState("paragraph");
  const [lengthMode, setLengthMode] = useState("medium");

  const sectionReveal = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const pageBg = darkMode
    ? "bg-zinc-950 text-white"
    : "bg-white text-slate-900";

  const cardBg = darkMode
    ? "border-zinc-800 bg-zinc-900/80 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
    : "border-slate-200/80 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)]";

  const titleColor = darkMode ? "text-white" : "text-slate-900";
  const softText = darkMode ? "text-zinc-400" : "text-slate-600";

  const inputBg = darkMode
    ? "border-zinc-700 bg-zinc-950/60 text-white placeholder:text-zinc-500"
    : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400";

  const tabsBg = darkMode ? "bg-zinc-900/90" : "bg-slate-100/90";

  const summaryBoxBg = darkMode
    ? "border-zinc-800 bg-black text-zinc-200"
    : "border-slate-200 bg-white text-slate-900";

  const statusTone =
    status === "Completed"
      ? darkMode
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Error"
      ? darkMode
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : "border-red-200 bg-red-50 text-red-700"
      : darkMode
      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
      : "border-blue-200 bg-blue-50 text-blue-700";

  const displayStatus =
    status === "Idle" ? "Waiting for input" : status;

  const handleSourceChange = (type) => {
    setSourceType(type);
    setSummary("");
    setBenchmarks(null);
    setStatus("Idle");
    setJobId(null);

    if (type === "upload") {
      setYoutubeURL("");
    } else {
      setFile(null);
      setVideoURL("");
    }
  };

  const getProgressWidth = () => {
    if (status === "Completed") return 100;
    if (status === "Error") return 100;
    if (status.includes("Downloading")) return 15;
    if (status.includes("Uploading")) return 15;
    if (status.includes("Extracting")) return 30;
    if (status.includes("Transcribing")) return 50;
    if (status.includes("Analyzing")) return 72;
    if (status.includes("Synthesizing")) return 92;
    if (loading) return 10;
    return 0;
  };

  const generateSummary = async () => {
    try {
      setLoading(true);

      let response;

      // -----------------------------
      // LOCAL VIDEO UPLOAD
      // -----------------------------
      if (sourceType === "upload") {

        if (!file) {
          toast.error("Please upload a video.");
          return;
        }

        const formData = new FormData();

        formData.append("file", file);

        setStatus("Uploading local file...");

        response = await api.post(
          `/summarize-video/?format_type=${formatType}&length_mode=${lengthMode}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      // -----------------------------
      // YOUTUBE LINK
      // -----------------------------
      else {

        if (!youtubeURL) {
          toast.error("Please enter YouTube URL.");
          return;
        }

        setStatus("Sending YouTube link...");

        response = await api.post(
          `/summarize-youtube/?url=${encodeURIComponent(
            youtubeURL
          )}&format_type=${formatType}&length_mode=${lengthMode}`
        );
      }

      const jobId = response.data.job_id;
      setJobId(jobId);

      if (!jobId) {
        toast.error("Job ID not received.");
        return;
      }

      toast.success("Processing started.");

      // ----------------------------------
      // CHECK STATUS LOOP
      // ----------------------------------
      const interval = setInterval(async () => {

        const statusResponse = await api.get(
          `/status/${jobId}`
        );

        const result = statusResponse.data.data;

        // STRING STATUS
        if (typeof result === "string") {

          setStatus(result);

        }

        // COMPLETED
        else if (result.status === "Completed") {

          clearInterval(interval);

          setStatus("Completed");

          setSummary(result.summary);

          if (result.benchmarks) {

            setBenchmarks(result.benchmarks);

          }

          toast.success("Summary generated successfully!");

          setLoading(false);
        }

        // ERROR
        else if (result.status === "Error") {

          clearInterval(interval);

          toast.error(result.message);

          setLoading(false);
        }

      }, 3000);

    } catch (error) {

      console.error(error);

      toast.error("Something went wrong.");

      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  const downloadSummary = () => {
    if (!summary) return;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isBusy =
    loading || (jobId && status !== "Completed" && status !== "Error");

  return (
    <div className={`relative space-y-8 overflow-hidden ${pageBg}`}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-80px] top-[220px] h-[320px] w-[320px] rounded-full bg-purple-400/15 blur-[120px]" />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <div
          className={`
            mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-md
            ${
              darkMode
                ? "border-zinc-700 bg-zinc-900/80 text-zinc-200"
                : "border-slate-200 bg-white/80 text-slate-700"
            }
          `}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.55)]" />
          AI Video Summarizer
        </div>

        <h1 className={`text-6xl font-bold leading-tight tracking-tight sm:text-5xl ${titleColor}`}>
          SummarEase Dashboard
        </h1>

        <p className={`mt-3 max-w-4xl text-lg leading-8 ${softText}`}>
          Intelligent multimodal video summarization using Whisper, BLIP and
          Transformer NLP.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* SOURCE CARD */}
        <motion.div variants={sectionReveal} initial="hidden" animate="visible" className="xl:col-span-7">
          <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
            <CardContent className="p-8">
              <h2 className={`mb-6 text-3xl font-semibold ${titleColor}`}>
                Video Source
              </h2>

              <div className="mb-6 flex gap-4">
                <button
                  onClick={() => handleSourceChange("upload")}
                  className={`h-18 flex-1 rounded-2xl px-6 text-lg font-bold transition-all duration-300 ${
                    sourceType === "upload"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : darkMode
                      ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Upload Local File
                </button>

                <button
                  onClick={() => handleSourceChange("youtube")}
                  className={`h-18 flex-1 rounded-2xl px-6 text-lg font-bold transition-all duration-300 ${
                    sourceType === "youtube"
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/25"
                      : darkMode
                      ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  YouTube Link
                </button>
              </div>

              {sourceType === "upload" && (
                <label
                  className={`
                    flex min-h-[320px] cursor-pointer flex-col items-center justify-center
                    rounded-[2rem] border-2 border-dashed p-10
                    transition-all duration-300
                    ${
                      darkMode
                        ? "border-zinc-700 bg-zinc-950/55 hover:border-blue-500 hover:bg-zinc-900/70"
                        : "border-slate-300 bg-slate-50/80 hover:border-blue-400 hover:bg-blue-50/70"
                    }
                  `}
                >
                  <input
                    type="file"
                    accept=".mp4,video/mp4"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      setFile(selectedFile);
                      setYoutubeURL("");

                      if (selectedFile) {
                        setVideoURL(URL.createObjectURL(selectedFile));
                      }
                    }}
                  />

                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                    <span className="text-3xl">↑</span>
                  </div>

                  <h3 className={`text-3xl font-bold ${titleColor}`}>
                    Upload MP4 Video
                  </h3>

                  <p className={`mt-2 text-center text-base leading-7 ${softText}`}>
                    Click to browse or drag & drop your video
                  </p>

                  {file && (
                    <div
                      className={`
                        mt-6 rounded-full px-5 py-3 text-sm font-medium
                        ${darkMode ? "bg-zinc-800 text-zinc-200" : "bg-slate-200 text-slate-700"}
                      `}
                    >
                      {file.name}
                    </div>
                  )}
                </label>
              )}

              {sourceType === "youtube" && (
                <div className="space-y-5">
                  <input
                    type="text"
                    placeholder="Paste YouTube URL..."
                    value={youtubeURL}
                    onChange={(e) => {
                      setYoutubeURL(e.target.value);
                      setFile(null);
                      setVideoURL("");
                    }}
                    className={`
                      h-16 w-full rounded-2xl border px-5 text-base outline-none transition-all
                      placeholder:text-slate-400
                      ${inputBg}
                      ${
                        darkMode
                          ? "focus:border-rose-400 focus:ring-4 focus:ring-rose-500/15"
                          : "focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                      }
                    `}
                  />

                  {youtubeURL && (
                    <div
                      className={`
                        overflow-hidden rounded-[2rem] border shadow-sm
                        ${
                          darkMode
                            ? "border-zinc-800 bg-zinc-950"
                            : "border-slate-200 bg-white"
                        }
                      `}
                    >
                      <iframe
                        width="100%"
                        height="320"
                        src={
                          youtubeURL.includes("watch?v=")
                            ? youtubeURL.replace("watch?v=", "embed/")
                            : youtubeURL
                        }
                        title="YouTube Preview"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {videoURL && sourceType === "upload" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    mt-6 overflow-hidden rounded-[2rem] border shadow-sm
                    ${darkMode ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"}
                  `}
                >
                  <video src={videoURL} controls className="w-full" />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          <motion.div variants={sectionReveal} initial="hidden" animate="visible">
            <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
              <CardContent className="p-8">
                <h2 className={`mb-6 text-3xl font-semibold ${titleColor}`}>
                  Summary Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <p className={`mb-3 text-lg font-semibold ${softText}`}>
                      Format
                    </p>
                    <Select
                      defaultValue="paragraph"
                      onValueChange={(value) => setFormatType(value)}
                    >
                      <SelectTrigger
                        className={`
                          h-16 rounded-2xl border px-5 text-base
                          ${
                            darkMode
                              ? "border-zinc-700 bg-zinc-950/60 text-white"
                              : "border-slate-300 bg-white text-slate-900"
                          }
                        `}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="
                          rounded-2xl
                          border
                          border-zinc-700
                          bg-zinc-950
                          text-white
                          p-2
                          min-w-[240px]
                        "
                      >
                        <SelectItem value="paragraph"
                          className="
                            h-14
                            rounded-xl
                            text-lg
                            font-medium
                            px-4
                          "
                        >
                          Paragraph
                        </SelectItem>
                        <SelectItem value="bullet"
                          className="
                            h-14
                            rounded-xl
                            text-lg
                            font-medium
                            px-4
                          "
                          >Bullet Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className={`mb-3 text-lg font-semibold ${softText}`}>
                      Detail Level
                    </p>
                    <Select
                      defaultValue="medium"
                      onValueChange={(value) => setLengthMode(value)}
                    >
                      <SelectTrigger
                        className={`
                          h-16 rounded-2xl border px-6 text-lg font-medium
                          ${
                            darkMode
                              ? "border-zinc-700 bg-zinc-950/60 text-white"
                              : "border-slate-300 bg-white text-slate-900"
                          }
                        `}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        className="
                          rounded-2xl
                          border
                          border-zinc-700
                          bg-zinc-950
                          text-white
                          p-2
                          min-w-[240px]
                        "
                      >
                        <SelectItem value="short"
                        className="
                          h-14
                          rounded-xl
                          text-lg
                          font-medium
                          px-4
                        "
                        >Short</SelectItem>
                        <SelectItem value="medium" 
                        className="
                          h-14
                          rounded-xl
                          text-lg
                          font-medium
                          px-4
                        "
                        >Medium</SelectItem>
                        <SelectItem 
                        value="detailed"
                          className="
                            h-14
                            rounded-xl
                            text-lg
                            font-medium
                            px-4
                          "
                        >
                          Detailed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="
                      h-16 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                      text-lg font-semibold text-white shadow-lg shadow-blue-500/25
                      transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
                      active:scale-[0.98]
                    "
                    onClick={generateSummary}
                    disabled={isBusy}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      "Generate Summary"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={sectionReveal} initial="hidden" animate="visible">
            <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
              <CardContent className="p-8">
                <h2 className={`mb-2 text-3xl font-semibold ${titleColor}`}>
                  Pipeline Status
                </h2>
                <p className={`mb-5 text-sm ${softText}`}>
                  Current backend stage and performance metrics.
                </p>

                <div className={`rounded-2xl border px-5 py-5 ${statusTone}`}>
                  <p className="text-lg font-semibold">{displayStatus}</p>
                </div>

                <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 ease-out"
                    style={{ width: `${getProgressWidth()}%` }}
                  />
                </div>

                {benchmarks && (
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div
                      className={`
                        rounded-2xl p-5
                        ${darkMode ? "bg-zinc-950/70 text-white" : "bg-slate-50 text-slate-900"}
                      `}
                    >
                      <p className={`text-sm ${softText}`}>Audio</p>
                      <p className="mt-1 text-2xl font-bold">
                        {benchmarks.audio_s}s
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-2xl p-5
                        ${darkMode ? "bg-zinc-950/70 text-white" : "bg-slate-50 text-slate-900"}
                      `}
                    >
                      <p className={`text-sm ${softText}`}>Transcribe</p>
                      <p className="mt-1 text-2xl font-bold">
                        {benchmarks.transcribe_s}s
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-2xl p-5
                        ${darkMode ? "bg-zinc-950/70 text-white" : "bg-slate-50 text-slate-900"}
                      `}
                    >
                      <p className={`text-sm ${softText}`}>Visual</p>
                      <p className="mt-1 text-2xl font-bold">
                        {benchmarks.visual_s}s
                      </p>
                    </div>

                    <div
                      className={`
                        rounded-2xl p-5
                        ${darkMode ? "bg-zinc-950/70 text-white" : "bg-slate-50 text-slate-900"}
                      `}
                    >
                      <p className={`text-sm ${softText}`}>Total</p>
                      <p className="mt-1 text-2xl font-bold">
                        {benchmarks.total_s}s
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* OUTPUT */}
      <motion.div variants={sectionReveal} initial="hidden" animate="visible">
        <Card className={`rounded-[2rem] border backdrop-blur-xl ${cardBg}`}>
          <CardContent className="p-8">
            <Tabs defaultValue="summary">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <TabsList
                  className={`
                    h-20 rounded-2xl p-2
                    gap-3
                    ${tabsBg}
                  `}
                >
                  <TabsTrigger
                    value="summary"
                    className="
                      h-14 min-w-[140px]
                      rounded-xl
                      px-8
                      text-lg
                      font-semibold
                      transition-all
                      data-[state=active]:bg-white
                      data-[state=active]:text-slate-900
                      dark:data-[state=active]:bg-zinc-950
                      dark:data-[state=active]:text-white
                    "
                  >
                    Summary
                  </TabsTrigger>

                  <TabsTrigger
                    value="details"
                    className="
                      h-14 min-w-[140px]
                      rounded-xl
                      px-8
                      text-lg
                      font-semibold
                      transition-all
                      data-[state=active]:bg-white
                      data-[state=active]:text-slate-900
                      dark:data-[state=active]:bg-zinc-950
                      dark:data-[state=active]:text-white
                    "
                  >
                    Details
                  </TabsTrigger>
                </TabsList>

                {summary && (
                  <Button
                    onClick={downloadSummary}
                    className="
                      h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600
                      px-6 text-base font-semibold text-white shadow-lg shadow-green-500/25
                      transition-all duration-300 hover:scale-[1.02] hover:from-emerald-600 hover:to-green-700
                      active:scale-[0.98]
                    "
                  >
                    Download Summary
                  </Button>
                )}
              </div>

              <TabsContent value="summary">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    min-h-[360px] rounded-[2rem] border p-8 text-lg leading-8
                    ${summaryBoxBg}
                  `}
                >
                  {summary || "Summary output will appear here..."}
                </motion.div>
              </TabsContent>

              <TabsContent value="details">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div
                    className={`
                      rounded-[2rem] border p-6
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70" : "border-slate-200 bg-slate-50"}
                    `}
                  >
                    <p className={`text-sm ${softText}`}>Model</p>
                    <p className={`mt-1 text-lg font-semibold ${titleColor}`}>
                      Whisper + BLIP + DistilBART
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-[2rem] border p-6
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70" : "border-slate-200 bg-slate-50"}
                    `}
                  >
                    <p className={`text-sm ${softText}`}>Format</p>
                    <p className={`mt-1 text-lg font-semibold ${titleColor}`}>
                      {formatType}
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-[2rem] border p-6
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70" : "border-slate-200 bg-slate-50"}
                    `}
                  >
                    <p className={`text-sm ${softText}`}>Length</p>
                    <p className={`mt-1 text-lg font-semibold ${titleColor}`}>
                      {lengthMode}
                    </p>
                  </div>

                  <div
                    className={`
                      rounded-[2rem] border p-6
                      ${darkMode ? "border-zinc-800 bg-zinc-950/70" : "border-slate-200 bg-slate-50"}
                    `}
                  >
                    <p className={`text-sm ${softText}`}>Source</p>
                    <p className={`mt-1 text-lg font-semibold ${titleColor}`}>
                      {sourceType === "upload" ? "Local File" : "YouTube Link"}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Dashboard;