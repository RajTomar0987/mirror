"use client";

import React, { useRef } from "react";
import { Printer, X, Download, ShieldCheck } from "lucide-react";
import { Estimate, Invoice, QuoteRequest } from "@/types";

interface DocumentPrintViewProps {
  type: "estimate" | "invoice" | "quote";
  data: Estimate | Invoice | QuoteRequest;
  onClose: () => void;
}

export const DocumentPrintView: React.FC<DocumentPrintViewProps> = ({ type, data, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isEstimate = type === "estimate";
  const isInvoice = type === "invoice";
  const isQuote = type === "quote";

  const est = isEstimate ? (data as Estimate) : null;
  const inv = isInvoice ? (data as Invoice) : null;
  const quote = isQuote ? (data as QuoteRequest) : null;

  const docTitle = isEstimate
    ? `ESTIMATE #${est?.estimate_number}`
    : isInvoice
    ? `TAX INVOICE #${inv?.invoice_number}`
    : `QUOTE SPECIFICATION #${quote?.id}`;

  const customerName = isEstimate ? est?.customer_name : isInvoice ? inv?.customer_name : quote?.name;
  const customerEmail = isEstimate ? est?.customer_email : isInvoice ? inv?.customer_email : quote?.email;
  const customerPhone = isEstimate ? est?.customer_phone : isInvoice ? inv?.customer_phone : quote?.phone;
  const customerAddress = isEstimate ? est?.customer_address : isInvoice ? inv?.customer_address : quote?.location || quote?.suburb;

  const items = isEstimate ? est?.items : isInvoice ? inv?.items : [];
  const subtotal = isEstimate ? est?.subtotal : isInvoice ? inv?.subtotal : (quote?.estimated_value || 0);
  const discount = isEstimate ? (est?.discount_amount || 0) : 0;
  const gstAmount = isEstimate ? est?.gst_amount : isInvoice ? inv?.gst_amount : ((quote?.estimated_value || 0) * 0.1);
  const totalAmount = isEstimate ? est?.total_amount : isInvoice ? inv?.total_amount : ((quote?.estimated_value || 0) * 1.1);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white text-brand-charcoal max-w-3xl w-full my-8 rounded-sm shadow-2xl overflow-hidden print:m-0 print:max-w-none print:shadow-none">
        {/* Controls Bar (Hidden in Print) */}
        <div className="p-4 bg-brand-charcoal text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
            <span>{docTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-brand-charcoal text-xs font-mono font-bold uppercase rounded-sm hover:bg-[#eaeaea] transition-colors"
            >
              <Printer size={14} /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Document */}
        <div ref={printRef} className="p-8 sm:p-12 space-y-8 bg-white font-sans text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-black/10 pb-8">
            <div>
              <span className="font-serif text-2xl font-normal tracking-tight uppercase block text-brand-charcoal">
                COMPLETE GLASS INNOVATIONS
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666] block mt-0.5">
                Architectural Glazing & Structural Glass
              </span>
              <div className="mt-3 text-[11px] text-[#555555] space-y-0.5">
                <p>ABN: 58 123 456 789 · ACN: 123 456 789</p>
                <p>128 Architectural Way, Alexandria NSW 2015</p>
                <p>Phone: +61 2 9876 5432 · Email: admin@completeglass.com.au</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider mb-2">
                {isInvoice ? "TAX INVOICE" : isEstimate ? "ESTIMATE" : "QUOTE SHEET"}
              </span>
              <p className="font-mono text-sm font-bold text-brand-charcoal">
                {isEstimate ? est?.estimate_number : isInvoice ? inv?.invoice_number : quote?.id}
              </p>
              <p className="text-[11px] text-[#666666] font-mono mt-1">
                Date: {isEstimate ? est?.issue_date : isInvoice ? inv?.issue_date : new Date().toLocaleDateString("en-AU")}
              </p>
              {isEstimate && est?.valid_until && (
                <p className="text-[11px] text-[#666666] font-mono">
                  Valid Until: {est.valid_until}
                </p>
              )}
              {isInvoice && inv?.due_date && (
                <p className="text-[11px] text-[#666666] font-mono">
                  Due Date: {inv.due_date}
                </p>
              )}
            </div>
          </div>

          {/* Client & Project Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-black/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#888888] tracking-wider block mb-1">
                Bill To / Client Details
              </span>
              <p className="font-bold text-sm text-brand-charcoal">{customerName || "Valued Client"}</p>
              {customerEmail && <p className="text-[#555555]">{customerEmail}</p>}
              {customerPhone && <p className="text-[#555555]">{customerPhone}</p>}
              {customerAddress && <p className="text-[#555555]">{customerAddress}</p>}
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#888888] tracking-wider block mb-1">
                Project & Glazing Spec
              </span>
              <p className="font-bold text-sm text-brand-charcoal">
                {isEstimate ? est?.project_name : isInvoice ? inv?.project_name : quote?.service || quote?.project_type}
              </p>
              <p className="text-[#555555] mt-1">
                {isQuote ? quote?.description || quote?.message : "Compliant with Australian Safety Standard AS1288"}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          {items && items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-black/20 text-[10px] uppercase font-mono text-[#666666]">
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-2 text-right">Unit Price (ex GST)</th>
                    <th className="py-2.5 px-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {items.map((item, i) => (
                    <tr key={item.id || i}>
                      <td className="py-3 px-2 font-medium text-brand-charcoal">{item.description}</td>
                      <td className="py-3 px-2 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-2 text-center text-[#666666]">{item.unit}</td>
                      <td className="py-3 px-2 text-right font-mono">${item.unit_price?.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold">${item.subtotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-[#f8f8f8] border border-black/5 text-xs text-[#555555]">
              <p className="font-bold mb-1">Custom Architectural Glazing Scope:</p>
              <p>{quote?.description || quote?.message || "Custom glazing specification."}</p>
              {quote?.measurements && <p className="mt-2 font-mono text-[11px]">Dimensions: {quote.measurements}</p>}
            </div>
          )}

          {/* Totals & Australian GST Calculation */}
          <div className="flex justify-end pt-4 border-t-2 border-black/20">
            <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#555555]">
                <span>Subtotal (ex GST):</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-${discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555555]">
                <span>Australian GST (10%):</span>
                <span>${gstAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-brand-charcoal pt-2 border-t border-black/10">
                <span>TOTAL (incl. GST):</span>
                <span>${totalAmount?.toFixed(2)}</span>
              </div>
              {isInvoice && (
                <>
                  <div className="flex justify-between text-emerald-600 pt-1">
                    <span>Amount Paid:</span>
                    <span>${inv?.amount_paid?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-charcoal pt-1 border-t border-black/10">
                    <span>BALANCE DUE:</span>
                    <span>${inv?.balance_due?.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Details & Bank Transfer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-black/10 text-[11px] text-[#555555]">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-brand-charcoal block mb-1">
                EFT / Direct Bank Transfer Details:
              </span>
              <p>Bank: Commonwealth Bank of Australia</p>
              <p>Account Name: Complete Glass Innovations Pty Ltd</p>
              <p>BSB: 062-000 · Account No: 1234 5678</p>
              <p className="mt-1 font-mono text-[10px] text-[#777777]">
                Reference: {isInvoice ? inv?.invoice_number : isEstimate ? est?.estimate_number : quote?.id}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-brand-charcoal block mb-1">
                Terms & Certification:
              </span>
              <p className="flex items-center gap-1 font-medium text-brand-charcoal">
                <ShieldCheck size={13} className="text-blue-600" />
                AS1288 (Glazing Code) & AS/NZS 2208 Compliant
              </p>
              <p className="text-[10px] text-[#777777] leading-relaxed">
                {isEstimate ? est?.terms : isInvoice ? inv?.payment_terms : "Quotes are valid for 30 days. 50% deposit required upon confirmation."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
