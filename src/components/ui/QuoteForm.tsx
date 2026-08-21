"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SERVICES_DATA } from "@/data/services";
import { FileUploader } from "./FileUploader";
import { submitQuoteRequest } from "@/services/quoteService";
import { sendCustomerQuoteConfirmation, sendAdminQuoteNotification } from "@/services/emailService";

export interface QuoteFormProps {
  onSuccess: () => void;
  preselectedService?: string;
}

interface FormErrors {
  service?: string;
  description?: string;
  name?: string;
  email?: string;
  phone?: string;
  suburb?: string;
  preferredContact?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ onSuccess, preselectedService }) => {
  const [step, setStep] = useState<number>(1);
  const shouldReduceMotion = useReducedMotion();

  // Form Fields
  const [service, setService] = useState<string>(() => preselectedService || SERVICES_DATA[0].title);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [suburb, setSuburb] = useState<string>("");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "sms">("email");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Validation & Submission States
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Inline Validation checks per step
  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!service) newErrors.service = "Please select a service category.";
      if (!description || description.trim().length < 10) {
        newErrors.description = "Please describe your project in at least 10 characters.";
      }
    }

    if (currentStep === 2) {
      if (!name || name.trim().length < 2) newErrors.name = "Please enter your full name.";
      if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";
      if (!phone || phone.trim().length < 8) newErrors.phone = "Please enter a valid contact phone number.";
      if (!suburb || suburb.trim().length < 2) newErrors.suburb = "Please enter your project suburb/location.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(5, prev + 1));
      setSubmitError(null);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      setSubmitError("Please correct form errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Create Quote via backend API
      const res = await submitQuoteRequest({
        name,
        phone,
        email,
        suburb,
        service,
        description,
        preferredContact,
      });

      if (!res.success) {
        setSubmitError(res.error || "Failed to submit quote request. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const quoteData = res.data as { id?: string } | undefined;
      const quoteId = quoteData?.id || `quote-${Date.now()}`;

      // 2. Upload Attached Files if present
      if (attachedFiles.length > 0) {
        const formData = new FormData();
        formData.append("quoteId", quoteId);
        attachedFiles.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/quotes/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          console.warn("File upload notice: Quote created but attachments failed.");
        }
      }

      // 3. Trigger Email Notifications Boundary
      await sendCustomerQuoteConfirmation({
        quoteId,
        name,
        email,
        phone,
        suburb,
        service,
        description,
        preferredContact,
        filesCount: attachedFiles.length,
      });
      await sendAdminQuoteNotification({
        quoteId,
        name,
        email,
        phone,
        suburb,
        service,
        description,
        preferredContact,
        filesCount: attachedFiles.length,
      });

      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("A network or server error occurred. Please try submitting again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-[#e5e5e5] p-6 sm:p-10 md:p-12 shadow-premium">
      {/* Step Progress Bar */}
      <div className="mb-10 pb-8 border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#555555]">
            Step 0{step} of 05 — {["Project", "Contact Details", "Preferences", "Photos & Plans", "Review & Submit"][step - 1]}
          </span>
          <span className="text-xs font-mono font-bold text-[#111111]">
            {step * 20}% Complete
          </span>
        </div>
        <div className="w-full h-1 bg-[#e5e5e5] overflow-hidden relative rounded-full">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-[#111111]"
            initial={{ width: "20%" }}
            animate={{ width: `${step * 20}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* STEP 1: PROJECT DETAILS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-4 font-mono">
                  Select Glazing Service *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {SERVICES_DATA.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => {
                        setService(item.title);
                        setErrors((prev) => ({ ...prev, service: undefined }));
                      }}
                      className={`p-4 border text-left transition-all duration-300 ${
                        service === item.title
                          ? "border-[#111111] bg-[#f7f7f5] font-bold text-[#111111]"
                          : "border-[#e5e5e5] hover:border-[#111111] text-[#555555] bg-white"
                      }`}
                    >
                      <span className="block text-xs font-serif text-[#111111]">{item.title}</span>
                    </button>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-2 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                    <AlertCircle size={14} /> {errors.service}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-3 font-mono">
                  Project Details & Dimensions *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.trim().length >= 10) {
                      setErrors((prev) => ({ ...prev, description: undefined }));
                    }
                  }}
                  placeholder="Describe your project (e.g. 8 meters of frameless glass balustrade for a second-story balcony with core-drilled spigots)."
                  className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
                    errors.description ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
                  }`}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="mt-2 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                    <AlertCircle size={14} /> {errors.description}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: CUSTOMER DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim().length >= 2) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Jane Doe"
                    className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
                      errors.name ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                      <AlertCircle size={14} /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (/\S+@\S+\.\S+/.test(e.target.value)) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="jane@example.com"
                    className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
                      errors.email ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
                    Contact Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value.trim().length >= 8) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="0400 000 000"
                    className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
                      errors.phone ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                      <AlertCircle size={14} /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="suburb" className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-2 font-mono">
                    Suburb / Location *
                  </label>
                  <input
                    id="suburb"
                    type="text"
                    value={suburb}
                    onChange={(e) => {
                      setSuburb(e.target.value);
                      if (e.target.value.trim().length >= 2) setErrors((prev) => ({ ...prev, suburb: undefined }));
                    }}
                    placeholder="Sydney, NSW"
                    className={`w-full p-4 border text-sm bg-white text-[#111111] focus:outline-none transition-colors ${
                      errors.suburb ? "border-red-500" : "border-[#e5e5e5] focus:border-[#111111]"
                    }`}
                  />
                  {errors.suburb && (
                    <p className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1" role="alert">
                      <AlertCircle size={14} /> {errors.suburb}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PREFERENCES */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-4 font-mono">
                  Preferred Contact Method *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "email", label: "Email Response", desc: "Detailed written estimate & specs" },
                    { id: "phone", label: "Phone Call", desc: "Direct consultation & discussion" },
                    { id: "sms", label: "SMS Text Message", desc: "Quick estimate notification" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPreferredContact(method.id as "email" | "phone" | "sms")}
                      className={`p-6 border text-left transition-all duration-300 ${
                        preferredContact === method.id
                          ? "border-[#111111] bg-[#f7f7f5]"
                          : "border-[#e5e5e5] hover:border-[#111111] bg-white"
                      }`}
                    >
                      <span className="block text-sm font-bold text-[#111111] mb-1 font-serif">
                        {method.label}
                      </span>
                      <span className="text-xs text-[#555555] font-sans font-light">
                        {method.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: FILES & PLANS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-bold text-[#555555] mb-3 font-mono">
                  Attach Photos or Architectural Plans (Optional)
                </label>
                <FileUploader files={attachedFiles} onFilesChange={setAttachedFiles} />
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="p-6 border border-[#e5e5e5] bg-[#f7f7f5] space-y-6">
                <h3 className="font-serif text-xl font-light text-[#111111] border-b border-[#e5e5e5] pb-4">
                  Review Quote Request Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Selected Service</span>
                    <span className="font-bold text-[#111111]">{service}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Customer Name</span>
                    <span className="font-medium text-[#111111]">{name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Email</span>
                    <span className="text-[#111111]">{email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Phone & Suburb</span>
                    <span className="text-[#111111]">{phone} — {suburb}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Preferred Contact</span>
                    <span className="uppercase text-[#111111] font-mono">{preferredContact}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#555555] mb-1">Attachments</span>
                    <span className="text-[#111111]">{attachedFiles.length} file(s) attached</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e5e5e5]">
                  <span className="block text-[10px] uppercase font-mono text-[#555555] mb-2">Project Description</span>
                  <p className="text-xs md:text-sm text-[#555555] leading-relaxed font-sans font-light">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Banner */}
        {submitError && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-sm flex items-center gap-2" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 pt-8 border-t border-[#e5e5e5] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#555555] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-colors duration-300"
            >
              Continue Step 0{step + 1}
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 hover:bg-[#333333] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  Submit Quote Request
                  <Check size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
