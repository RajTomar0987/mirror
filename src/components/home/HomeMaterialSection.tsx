"use client";

import { useState } from "react";

const MATERIALS = [
  {
    id: "low-iron",
    name: "Ultra-Clear Low-Iron Glass",
    tagline: "Uncompromised transparency for scenic backdrops.",
    description: "Standard glass contains iron oxide which imparts a slight green cast, visible on edges. Low-iron glass undergoes special chemical processing to remove iron, resulting in maximum light transmission, optical clarity, and color neutrality.",
    thickness: "8mm to 19mm",
    transmission: "91.5%",
    standards: "AS1288 Safety Compliant",
    useCase: "Frameless balustrades, premium pool fencing, showcase facades",
    previewStyle: "bg-cyan-50/20 border-cyan-200/40 backdrop-blur-[8px]",
  },
  {
    id: "toughened",
    name: "Toughened Safety Glass (Tempered)",
    tagline: "Thermal strength for structural safety.",
    description: "Subjected to high heat and rapid cooling treatments, toughened glass is up to five times stronger than regular annealed glass of the same thickness. Upon impact, it fractures into small, blunt granules rather than sharp, dangerous shards.",
    thickness: "6mm to 19mm",
    transmission: "90%",
    standards: "AS/NZS 2208 Labeled",
    useCase: "Shower screens, balustrades, sliding doors, high-traffic entries",
    previewStyle: "bg-slate-50/20 border-slate-300/30 backdrop-blur-[6px]",
  },
  {
    id: "laminated",
    name: "Laminated Structural Glass",
    tagline: "Acoustic control and shatter resistance.",
    description: "Formed by sandwiching a tough polyvinyl butyral (PVB) interlayer between two panes of glass under heat and pressure. Even if the glass breaks, the fragments adhere to the plastic interlayer, maintaining structural safety and blockading entry.",
    thickness: "6.38mm to 39.5mm+",
    transmission: "88%",
    standards: "AS1288 Grade A Safety",
    useCase: "Overhead glazing, security windows, balustrades without handrails",
    previewStyle: "bg-blue-50/15 border-blue-200/20 backdrop-blur-[12px]",
  },
  {
    id: "acid-etched",
    name: "Acid-Etched Satin Glass",
    tagline: "Diffused light with high privacy.",
    description: "Chemically treated with acid to create a uniform, matte finish. It diffuses light beautifully to soften interiors while preventing direct line-of-sight. Unlike sandblasted glass, it doesn't attract fingerprints or oil stains.",
    thickness: "4mm to 12mm",
    transmission: "82%",
    standards: "AS1288 Compliant",
    useCase: "Privacy shower screens, office partitions, decorative splashbacks",
    previewStyle: "bg-[#edf4f5]/30 border-white/20 backdrop-blur-[3px] opacity-90",
  },
];

export const HomeMaterialSection = () => {
  const [activeTab, setActiveTab] = useState("low-iron");
  const activeMaterial = MATERIALS.find((m) => m.id === activeTab) || MATERIALS[0];

  return (
    <section className="py-24 md:py-32 bg-brand-bg dark:bg-brand-charcoal border-t border-brand-glass-border-light dark:border-brand-glass-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Information */}
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gray block mb-4">
              [Material Science]
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight mb-8 text-brand-charcoal dark:text-white">
              GLASS SPECIFICATIONS & <br />
              <span className="italic font-normal">MATERIAL PERFORMANCE</span>
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 border-b border-brand-glass-border-light dark:border-brand-glass-border-dark pb-6">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`text-xs uppercase tracking-wider font-bold py-2.5 px-4 transition-all duration-300 ${
                    activeTab === m.id
                      ? "bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal"
                      : "text-brand-gray hover:text-brand-charcoal dark:hover:text-white"
                  }`}
                >
                  {m.id.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Active Material Info */}
            <div className="transition-all duration-500">
              <h3 className="text-2xl font-serif font-light tracking-tight mb-2 text-brand-charcoal dark:text-white">
                {activeMaterial.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-brand-gray/80 dark:text-brand-gray mb-6 italic">
                &ldquo;{activeMaterial.tagline}&rdquo;
              </p>
              <p className="text-sm text-brand-gray dark:text-brand-gray-light leading-relaxed mb-8">
                {activeMaterial.description}
              </p>

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-brand-glass-border-light dark:border-brand-glass-border-dark text-sm">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-brand-gray/60 mb-1">Standard Thickness</span>
                  <span className="font-mono text-brand-charcoal dark:text-white">{activeMaterial.thickness}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-brand-gray/60 mb-1">Light Transmission</span>
                  <span className="font-mono text-brand-charcoal dark:text-white">{activeMaterial.transmission}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-brand-gray/60 mb-1">Compliance</span>
                  <span className="text-brand-charcoal dark:text-white">{activeMaterial.standards}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-brand-gray/60 mb-1">Primary Application</span>
                  <span className="text-brand-charcoal dark:text-white">{activeMaterial.useCase}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Glass Physics Visualizer (Pure CSS) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[450px] aspect-square border border-brand-glass-border-light dark:border-brand-glass-border-dark bg-white dark:bg-brand-bg-dark flex items-center justify-center p-8 overflow-hidden shadow-premium">
              {/* Background architectural drawing overlay */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#121214_1px,transparent_1px),linear-gradient(to_bottom,#121214_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]"></div>
              
              {/* Central object to show refraction/distortion */}
              <div className="w-[180px] h-[180px] border border-dashed border-brand-gray/30 rounded-full flex items-center justify-center relative">
                <div className="text-[10px] font-mono tracking-widest text-brand-gray/40 uppercase">
                  Optical Reference
                </div>
                {/* Visual architectural crosshairs */}
                <div className="absolute top-0 bottom-0 left-1/2 border-r border-brand-gray/10"></div>
                <div className="absolute left-0 right-0 top-1/2 border-b border-brand-gray/10"></div>
              </div>

              {/* Interactive Floating Glass Panel mimicking the selected material */}
              <div
                className={`absolute w-[240px] h-[240px] border transition-all duration-700 shadow-lg flex flex-col justify-between p-6 transform hover:rotate-6 ${activeMaterial.previewStyle}`}
                style={{
                  transform: "rotate(-4deg) translate(10px, -10px)",
                }}
              >
                {/* Glass reflection shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/40 pointer-events-none"></div>

                <span className="text-[10px] font-mono text-brand-charcoal/40 dark:text-white/40 uppercase">
                  Pane Preview
                </span>
                
                <div className="flex flex-col">
                  <span className="font-serif text-sm font-bold text-brand-charcoal dark:text-white leading-tight">
                    {activeMaterial.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-brand-charcoal/60 dark:text-white/60">
                    t: {activeMaterial.thickness}
                  </span>
                </div>
              </div>

              {/* Edge detail description */}
              <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest text-brand-gray/40 font-mono">
                [PBR Material Simulation]
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
