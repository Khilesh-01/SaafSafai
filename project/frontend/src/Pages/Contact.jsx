import React, { useState } from "react";
import {
  User,
  Mail,
  MessageCircle,
  CheckCircle,
  Send,
  Sparkles,
  Clock,
  AlertCircle,
} from "lucide-react";

/* =========================
   CONTACT FORM
========================= */

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = (field, value) => {
    if (!value.trim()) return `${field} is required`;
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email address";
    if (field === "name" && value.length < 2) return "Name too short";
    if (field === "message" && value.length < 10)
      return "Message too short";
    return null;
  };

  const handleSubmit = async () => {
    const errs = {};
    Object.keys(formData).forEach((f) => {
      const e = validate(f, formData[f]);
      if (e) errs[f] = e;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderField = (name, icon, placeholder, isTextArea = false) => {
    const Icon = icon;
    const hasValue = formData[name].trim() !== "";

    return (
      <div className="mb-4">
        <div className="relative">
          <Icon
            className={`absolute left-4 ${isTextArea ? "top-5" : "top-1/2 -translate-y-1/2"
              } w-5 h-5 transition ${focusedField === name || hasValue
                ? "text-violet-400"
                : "text-slate-500"
              }`}
          />

          {isTextArea ? (
            <textarea
              name={name}
              rows={4}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-900 border text-slate-100
                ${errors[name]
                  ? "border-red-500"
                  : "border-slate-700 focus:border-violet-500"
                }
                focus:outline-none transition`}
              placeholder={placeholder}
            />
          ) : (
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-900 border text-slate-100
                ${errors[name]
                  ? "border-red-500"
                  : "border-slate-700 focus:border-violet-500"
                }
                focus:outline-none transition`}
              placeholder={placeholder}
            />
          )}

          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {errors[name] ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : hasValue ? (
              <CheckCircle className="w-5 h-5 text-violet-400" />
            ) : null}
          </div>
        </div>

        {errors[name] && (
          <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderField("name", User, "Your Name")}
      {renderField("email", Mail, "Your Email")}
      {renderField("message", MessageCircle, "Your Message", true)}

      <button
        onClick={handleSubmit}
        disabled={isLoading || submitted}
        className="w-full mt-4 py-4 rounded-xl font-semibold text-white
          bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500
          transition disabled:opacity-60"
      >
        {isLoading
          ? "Sending..."
          : submitted
            ? "Message Sent"
            : "Send Message"}
      </button>

      {submitted && (
        <div className="mt-4 p-4 rounded-xl bg-violet-900/40 border border-violet-700 text-violet-300 flex gap-2 items-center">
          <CheckCircle className="w-5 h-5" />
          Thanks! We’ll get back to you soon.
        </div>
      )}
    </div>
  );
};

/* =========================
   PAGE WRAPPER
========================= */

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-16">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">

        {/* LEFT INFO */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-100 mb-2">
              Contact Us
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Questions, feedback, or support —
              we’re here to help.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex gap-3 items-center">
              <Mail className="text-violet-400" />
              <span className="text-slate-300">
                support@saafsafai.com
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex gap-3 items-center">
              <Clock className="text-indigo-400" />
              <span className="text-slate-300">
                Response within 24 hours
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-100 mb-1">
            Send a Message
          </h2>
          <p className="text-slate-400 mb-6">
            We usually respond the same day
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
