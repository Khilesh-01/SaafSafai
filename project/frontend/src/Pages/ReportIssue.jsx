import {
  AlertCircle,
  CheckCircle,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Upload,
  MapPin,
} from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";

const FormInput = ({ type = "text", id, label, placeholder, value, onChange, required = false, rows, icon: Icon, disabled = false, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-emerald-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className={`w-5 h-5 ${isFocused ? "text-emerald-500" : "text-gray-400"}`} />
          </div>
        )}
        {type === "textarea" ? (
          <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            disabled={disabled}
            className={`w-full rounded-lg border bg-white shadow-sm transition-all duration-200
              ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5
              ${error
                ? "border-red-300 ring-2 ring-red-100"
                : isFocused
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-emerald-200"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : ""}
              placeholder:text-gray-400 text-gray-900 focus:outline-none resize-y min-h-[100px]
            `}
            required={required}
          />
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`w-full rounded-lg border bg-white shadow-sm transition-all duration-200
              ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5
              ${error
                ? "border-red-300 ring-2 ring-red-100"
                : isFocused
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-emerald-200"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : ""}
              placeholder:text-gray-400 text-gray-900 focus:outline-none
            `}
            required={required}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
};

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    title: "",
    description: "",
    location: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!/^\+?[0-9]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required.";
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const downloadReceipt = useCallback((data) => {
    console.log("Generating receipt for:", data);
    alert("Receipt would be downloaded in real implementation!");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('notifyByEmail', 'true'); // Default to true for notifications

      if (file) {
        formDataToSend.append('file', file);
      }

      const response = await fetch('http://localhost:5000/api/issues', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to submit issue');
      }

      const result = await response.json();
      console.log("Issue submitted successfully:", result);
      setSubmitStatus("success");

      downloadReceipt(formData);

      setFormData({
        phone: "",
        email: "",
        title: "",
        description: "",
        location: "",
      });
      setFile(null);

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, file, isSubmitting, validateForm, downloadReceipt]);

  const formFields = useMemo(() => [
    { id: "phone", type: "tel", label: "Phone Number", placeholder: "+91 98765 43210", required: true, icon: Phone },
    { id: "email", type: "email", label: "Email Address", placeholder: "you@example.com", required: true, icon: Mail },
    { id: "title", type: "text", label: "Issue Title", placeholder: "Brief description of the issue", required: true, icon: FileText },
    { id: "description", type: "textarea", label: "Detailed Description", placeholder: "Please provide comprehensive details about the issue.", rows: 4, required: true, icon: MessageSquare },
    { id: "location", type: "text", label: "Location", placeholder: "Detecting location...", required: true, icon: MapPin },
  ], []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setFormData((prev) => ({ ...prev, location: data.display_name || `${latitude}, ${longitude}` }));
        } catch {
          setFormData((prev) => ({ ...prev, location: `${latitude}, ${longitude}` }));
        }
      },
      () => console.warn("Geolocation not available")
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-100/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-green-100/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-4">
            <AlertCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600 text-sm">Help us improve by reporting any problems you've encountered.</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 space-y-6">
          {formFields.map((field) => (
            <FormInput
              key={field.id}
              {...field}
              value={formData[field.id]}
              onChange={handleInputChange(field.id)}
              disabled={isSubmitting}
              error={errors[field.id]}
            />
          ))}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Attach File <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${file ? "border-emerald-300 bg-emerald-50/50" : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50/30"
                } ${isSubmitting ? "opacity-60" : ""}`}>
                <Upload className={`w-6 h-6 mx-auto mb-2 ${file ? "text-emerald-500" : "text-gray-400"}`} />
                <p className="text-sm text-gray-600">{file ? file.name : "Click to upload or drag and drop"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:shadow-md"
              }`}>
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Submitting...
              </div>
            ) : ("Submit Report")}
          </button>

          {submitStatus === "success" && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-emerald-700">Report submitted successfully!</span>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">Failed to submit. Please check errors.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}