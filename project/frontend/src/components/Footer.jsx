import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowUpRight,
  MapPin,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react";
import logoF from "../assets/logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const canvasRef = useRef(null);
  const footerRef = useRef(null);

  const emojis = [
    {
      emoji: "😡",
      label: "Very Dissatisfied",
      color: "hover:bg-red-100 dark:hover:bg-red-900/20",
      bg: "bg-red-500/10",
    },
    {
      emoji: "😕",
      label: "Dissatisfied",
      color: "hover:bg-orange-100 dark:hover:bg-orange-900/20",
      bg: "bg-orange-500/10",
    },
    {
      emoji: "😐",
      label: "Neutral",
      color: "hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
      bg: "bg-yellow-500/10",
    },
    {
      emoji: "🙂",
      label: "Satisfied",
      color: "hover:bg-green-100 dark:hover:bg-green-900/20",
      bg: "bg-green-500/10",
    },
    {
      emoji: "😍",
      label: "Very Satisfied",
      color: "hover:bg-purple-100 dark:hover:bg-purple-900/20",
      bg: "bg-purple-500/10",
    },
  ];

  // Simple particle animation for background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      if (footerRef.current) {
        canvas.width = footerRef.current.offsetWidth;
        canvas.height = footerRef.current.offsetHeight;
      }
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        direction: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgba(167, 243, 208, 0.03)");
      gradient.addColorStop(0.5, "rgba(110, 231, 183, 0.02)");
      gradient.addColorStop(1, "rgba(52, 211, 153, 0.03)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${particle.opacity})`;
        ctx.fill();

        // Move particles
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 dark:opacity-20"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/50 to-emerald-50/30 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/95"></div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-grid-pattern bg-center bg-cover"></div>
      </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          {/* Top Section */}
          <div className="flex flex-col items-center space-y-6 mb-12">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={logoF}
                alt="saafsafai Logo"
                className="w-14 h-auto"
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                saafsafai
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Civic Sense Platform
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
              Empowering citizens through technology. Stay informed, make better
              decisions, and engage with civic life.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center space-y-4 mb-12">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Contact
            </h3>

            <div className="flex flex-col items-center space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>support@saafsafai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>+91 1234567890</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Pune, India</span>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              How was your experience?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              Your feedback helps us improve saafsafai for everyone
            </p>

            <div className="flex justify-center gap-3">
              {emojis.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRating(index)}
                  className={`p-3 rounded-xl transition-transform ${selectedRating === index ? "scale-110 bg-emerald-100 dark:bg-emerald-900/30" : "hover:scale-105"
                    }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Enhanced Toast Message */}
      {message && (
        <div className="fixed top-1 right-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-3 rounded-lg shadow-xl shadow-emerald-500/25 animate-fadeIn z-50 flex items-center space-x-2 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium text-sm">{message}</span>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full flex items-center justify-center text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-300/50 dark:hover:border-emerald-500/50 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUpRight className="w-5 h-5 transform rotate-45" />
      </button>
    </footer>
  );
};

export default Footer;
