"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "@/components/animations/MagneticButton";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/why-us", label: "Why Us" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset mobile menu state on route change synchronously during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* MAIN HEADER (FIXED TOP BAR) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-[#e5e5e5] py-3.5 shadow-subtle text-[#111111]"
            : "bg-white/95 backdrop-blur-md border-b border-[#e5e5e5]/80 py-4 md:py-5 text-[#111111]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className="group flex flex-col focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm"
            onClick={closeMenu}
            aria-label="Complete Glass Innovations Home"
          >
            <span className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-widest text-[#111111] uppercase transition-colors duration-300">
              COMPLETE GLASS
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#555555] uppercase -mt-0.5 font-sans">
              INNOVATIONS
            </span>
          </Link>

          {/* DESKTOP NAV (Visible on lg: 1024px and above; hidden on mobile <= 768px) */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest font-medium transition-all duration-300 relative py-1 focus-visible:ring-2 focus-visible:ring-[#111111] ${
                    isActive
                      ? "text-[#111111] font-semibold"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP PRIMARY CTA BUTTON */}
          <div className="hidden lg:flex items-center">
            <MagneticButton>
              <Link
                href="/quote"
                className="group flex items-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-3.5 px-6 hover:bg-[#333333] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#111111] shadow-sm"
              >
                Get a Free Quote
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON (Shown on <= 768px / < 1024px) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-[#111111] hover:text-[#555555] focus-visible:ring-2 focus-visible:ring-[#111111] p-2 -mr-2 flex items-center justify-center"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE OVERLAY MENU (Z-INDEX 9999, SOLID WHITE, NO OVERLAP) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 z-[9999] bg-white flex flex-col justify-between h-[100dvh] w-full overflow-y-auto"
          >
            {/* OVERLAY TOP HEADER ROW */}
            <div className="px-4 sm:px-6 md:px-12 py-4 border-b border-[#e5e5e5] flex items-center justify-between bg-white shrink-0">
              <Link
                href="/"
                className="flex flex-col"
                onClick={closeMenu}
                aria-label="Complete Glass Innovations Home"
              >
                <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-[#111111] uppercase">
                  COMPLETE GLASS
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#555555] uppercase -mt-0.5 font-sans">
                  INNOVATIONS
                </span>
              </Link>

              <button
                onClick={closeMenu}
                className="text-[#111111] p-2 -mr-2 hover:text-[#555555] focus-visible:ring-2 focus-visible:ring-[#111111]"
                aria-label="Close menu"
              >
                <X size={26} />
              </button>
            </div>

            {/* OVERLAY NAVIGATION LINKS (VERTICALLY STACKED, INDIVIDUAL ROWS) */}
            <div className="flex-1 px-6 py-6 sm:py-8 flex flex-col overflow-y-auto bg-white">
              <nav className="flex flex-col w-full divide-y divide-[#e5e5e5]" aria-label="Mobile Navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`py-4 sm:py-5 flex items-center justify-between text-xl sm:text-2xl font-serif tracking-wider transition-all duration-200 ${
                        isActive
                          ? "text-[#111111] font-semibold pl-2"
                          : "text-[#555555] hover:text-[#111111] hover:pl-2"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight
                        size={18}
                        className={`transition-transform ${
                          isActive ? "text-[#111111] opacity-100" : "text-[#999999] opacity-50"
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* OVERLAY BOTTOM CTA */}
            <div className="p-6 border-t border-[#e5e5e5] bg-white shrink-0">
              <Link
                href="/quote"
                onClick={closeMenu}
                className="flex items-center justify-center gap-3 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-6 hover:bg-[#333333] transition-colors w-full shadow-subtle text-center"
              >
                Get a Free Quote
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
