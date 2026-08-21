"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ y: shouldReduceMotion ? 0 : -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] py-4 shadow-subtle text-[#111111]"
          : "bg-white/80 backdrop-blur-sm border-b border-[#e5e5e5]/50 py-6 text-[#111111]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="group flex flex-col focus-visible:ring-2 focus-visible:ring-[#111111] rounded-sm"
          onClick={closeMenu}
          aria-label="Complete Glass Innovations Home"
        >
          <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-[#111111] uppercase transition-colors duration-300">
            COMPLETE GLASS
          </span>
          <span className="text-[10px] tracking-[0.3em] text-[#555555] uppercase -mt-1 font-sans">
            INNOVATIONS
          </span>
        </Link>

        {/* DESKTOP NAV */}
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

        {/* PRIMARY CTA BUTTON */}
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

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-[#111111] hover:text-[#555555] focus-visible:ring-2 focus-visible:ring-[#111111] p-1"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:hidden fixed inset-0 top-[70px] bg-white/98 backdrop-blur-xl z-40 border-t border-[#e5e5e5]"
          >
            <div className="flex flex-col h-full px-6 py-12 md:px-12 justify-between">
              <nav className="flex flex-col space-y-6" aria-label="Mobile Navigation">
                {NAV_LINKS.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={`text-2xl font-serif font-light tracking-wider transition-colors py-3 block border-b border-[#e5e5e5] ${
                          isActive
                            ? "text-[#111111] font-normal pl-2 border-l-2 border-l-[#111111]"
                            : "text-[#555555]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mb-16">
                <Link
                  href="/quote"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 bg-[#111111] text-white text-xs uppercase tracking-[0.2em] font-bold py-4 px-6 hover:bg-[#333333] transition-colors w-full"
                >
                  Get a Free Quote
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
