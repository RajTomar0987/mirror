"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { SERVICES_DATA } from "@/data/services";
import { submitContactRequest } from "@/services/contactService";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState(SERVICES_DATA[0].title);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const validate = (): boolean => {
    const errors: typeof validationErrors = {};
    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (phone && phone.trim().length > 0 && phone.trim().length < 8) {
      errors.phone = "Phone number must be at least 8 digits.";
    }
    if (!message || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactRequest({
        name,
        email,
        phone: phone || undefined,
        projectType,
        message,
      });

      if (res.success) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMessage(res.error || "Failed to submit message. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 border border-[#e5e5e5] bg-[#f7f7f5] text-center shadow-subtle">
        <div className="w-16 h-16 rounded-full border border-[#e5e5e5] bg-white flex items-center justify-center text-[#111111] mx-auto mb-6 shadow-subtle">
          <CheckCircle2 size={32} />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#555555] block mb-2 font-bold">
          [Enquiry Sent]
        </span>
        <h3 className="font-serif text-3xl font-light text-[#111111] mb-4">
          THANK YOU FOR GETTING IN TOUCH
        </h3>
        <p className="text-sm text-[#555555] leading-relaxed max-w-md mx-auto mb-8 font-sans font-light">
          Your message has been submitted successfully to Complete Glass Innovations. Our engineering team will review your specifications and contact you shortly.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 px-6 hover:bg-[#333333] transition-colors shadow-subtle"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim().length >= 2) {
                setValidationErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            placeholder="Jane Doe"
            className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
              validationErrors.name ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
            }`}
          />
          {validationErrors.name && (
            <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
              <AlertCircle size={14} /> {validationErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (/\S+@\S+\.\S+/.test(e.target.value)) {
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="jane@example.com"
            className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
              validationErrors.email ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
            }`}
          />
          {validationErrors.email && (
            <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
              <AlertCircle size={14} /> {validationErrors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone & Project Type Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-phone" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
            Contact Phone (Optional)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (e.target.value.trim().length >= 8) {
                setValidationErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            placeholder="0400 000 000"
            className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
              validationErrors.phone ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
            }`}
          />
          {validationErrors.phone && (
            <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
              <AlertCircle size={14} /> {validationErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-project-type" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
            Project Type / Service
          </label>
          <select
            id="contact-project-type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full p-4 border border-[#e5e5e5] text-sm bg-white text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
          >
            {SERVICES_DATA.map((srv) => (
              <option key={srv.slug} value={srv.title}>
                {srv.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
          Message & Project Overview *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (e.target.value.trim().length >= 10) {
              setValidationErrors((prev) => ({ ...prev, message: undefined }));
            }
          }}
          placeholder="Please specify your project location, glass requirements, dimensions, or questions..."
          className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
            validationErrors.message ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
          }`}
        />
        {validationErrors.message && (
          <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
            <AlertCircle size={14} /> {validationErrors.message}
          </p>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-all duration-300 disabled:opacity-50 shadow-subtle"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
};
