import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import { ToastContainer, toast } from "react-toastify";

import ProfileCompletionBanner from "./components/ProfileCompletionBanner";
import TestimonialCarousel from "./components/TestimonialCarousel";
import useProfileStatus from "./hooks/useProfileStatus";

import hero from "./assets/logo.jpg";
import "./Home.css";

function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqFilter, setFaqFilter] = useState("All");

  const navigate = useNavigate();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { isProfileComplete, isLoading } = useProfileStatus();

  /* ======================
     REDIRECT LOGIC
  ====================== */
  useEffect(() => {
    const justSubmitted = sessionStorage.getItem("profileJustSubmitted") === "true";
    if (isSignedIn && !isLoading && !isProfileComplete && !justSubmitted) {
      navigate("/profile-setup");
    }
  }, [isSignedIn, isLoading, isProfileComplete, navigate]);

  /* ======================
     LOGOUT
  ====================== */
  const handleLogout = async () => {
    try {
      await signOut();
      toast.info("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ======================
     FAQ DATA
  ====================== */
  const faqs = [
    {
      id: 1,
      question: "What is saafsafai?",
      answer:
        "saafsafai is a civic-tech platform that allows citizens to report, track, and collectively prioritize local infrastructure and public service issues.",
      popular: true,
    },
    {
      id: 2,
      question: "How do I report an issue?",
      answer:
        "Capture a photo, add a description, and mark the location on the map. The issue is routed to the relevant civic authority automatically.",
    },
    {
      id: 3,
      question: "Is saafsafai free?",
      answer:
        "Yes. saafsafai is free for citizens. There are no hidden charges.",
      popular: true,
    },
    {
      id: 4,
      question: "Can I track progress?",
      answer:
        "You can track issue status updates in real time, from submission to resolution.",
    },
    {
      id: 5,
      question: "Can I vote on issues?",
      answer:
        "Yes. Community voting helps authorities prioritize issues with the highest public impact.",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ToastContainer theme="dark" position="bottom-right" />

      <Helmet>
        <title>saafsafai | Civic Issue Reporting Platform</title>
        <meta
          name="description"
          content="Report, track, and resolve local civic issues with saafsafai."
        />
      </Helmet>

      <main>
        <ProfileCompletionBanner />

        {/* ======================
            HERO SECTION
        ====================== */}
        <section className="relative py-24 bg-gradient-to-b from-white via-indigo-50/40 to-violet-100/60 dark:from-slate-950 dark:via-indigo-950/50 dark:to-violet-950/60">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            {/* TEXT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                Report Local Issues.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  Improve Your City.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-xl">
                saafsafai empowers citizens to report civic problems, collaborate
                with local authorities, and drive real change through transparency.
              </p>

              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl 
                bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                Get Started
                <span className="text-lg">→</span>
              </button>
            </motion.div>

            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <img
                src={hero}
                alt="saafsafai app preview"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ======================
            FEATURES
        ====================== */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built for <span className="text-indigo-600">real civic impact</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Designed to be simple for citizens and powerful for authorities.
            </p>
          </div>

          <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Report Issues",
                desc: "Submit problems with photos, categories, and location.",
              },
              {
                title: "Track Progress",
                desc: "Follow updates from submission to resolution.",
              },
              {
                title: "Community Voting",
                desc: "Prioritize what matters most collectively.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 bg-white dark:bg-slate-800 
                border border-slate-200 dark:border-slate-700
                shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">
                  {f.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================
            FAQ
        ====================== */}
        <section className="py-24 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-10">
              Frequently Asked Questions
            </h2>

            <div className="flex justify-center gap-3 mb-8">
              {["All", "Popular"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFaqFilter(t)}
                  className={`px-4 py-2 rounded-full font-medium transition ${faqFilter === t
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-800"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(faqFilter === "All"
                ? faqs
                : faqs.filter((f) => f.popular)
              ).map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === faq.id ? null : faq.id)
                    }
                    className="w-full px-5 py-4 flex justify-between items-center text-left font-medium"
                  >
                    {faq.question}
                    <span className="text-indigo-600">
                      {activeFaq === faq.id ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-4 text-slate-700 dark:text-slate-300"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialCarousel />
      </main>
    </div>
  );
}

export default Home;