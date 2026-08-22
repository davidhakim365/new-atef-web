import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

const ELEMENTS = [
  { symbol: "H", style: "left-[8%] top-[18%]", delay: 0 },
  { symbol: "C", style: "left-[18%] bottom-[22%]", delay: 0.4 },
  { symbol: "O", style: "right-[10%] top-[16%]", delay: 0.8 },
  { symbol: "N", style: "right-[16%] bottom-[18%]", delay: 1.1 },
  { symbol: "Na", style: "left-[6%] top-[52%]", delay: 0.2 },
  { symbol: "Cl", style: "right-[8%] top-[48%]", delay: 0.6 },
];

const FORMULAS = [
  "H₂O",
  "C₆H₆",
  "NaCl",
  "CO₂",
  "C₆H₁₂O₆",
  "2H₂ + O₂ → 2H₂O",
  "PV = nRT",
  "H₂SO₄",
  "NH₃",
  "CH₄",
];

export function ChemistryFormulaStrip() {
  const reduceMotion = useReducedMotion();
  const loop = [...FORMULAS, ...FORMULAS];

  return (
    <div
      className="relative overflow-hidden border-y border-emerald-200/70 bg-emerald-950 py-3 text-emerald-100 dark:border-emerald-800"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-emerald-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-emerald-950 to-transparent" />
      <motion.div
        className="flex w-max gap-10 px-6 font-mono text-sm tracking-[0.22em]"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((formula, i) => (
          <span key={`${formula}-${i}`} className="whitespace-nowrap opacity-90">
            {formula}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ChemistryGraphics({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] overflow-hidden",
        className
      )}
      aria-hidden
    >
      <HexGrid />
      <AtomGraphic
        className="absolute left-[4%] top-[12%] h-36 w-36 opacity-50 dark:opacity-40 md:h-48 md:w-48"
        reduceMotion={!!reduceMotion}
      />
      <AtomGraphic
        className="absolute right-[3%] bottom-[10%] h-28 w-28 opacity-40 dark:opacity-30 md:h-40 md:w-40"
        reduceMotion={!!reduceMotion}
        reverse
      />
      <Benzene
        className="absolute right-[12%] top-[22%] h-24 w-24 opacity-40 md:h-32 md:w-32"
        reduceMotion={!!reduceMotion}
      />
      <Flask className="absolute left-[12%] bottom-[14%] h-28 w-20 opacity-50 md:h-36 md:w-24" />
      <Molecule className="absolute right-[22%] bottom-[28%] hidden opacity-40 lg:block" />
      {ELEMENTS.map((el) => (
        <motion.span
          key={el.symbol}
          className={cn(
            "absolute font-mono text-sm font-semibold text-emerald-700/40 dark:text-emerald-300/30 md:text-base",
            el.style
          )}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -10, 0], opacity: [0.35, 0.7, 0.35] }
          }
          transition={{
            duration: 5 + el.delay,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        >
          {el.symbol}
        </motion.span>
      ))}
    </div>
  );
}

function HexGrid() {
  const patternId = `chem-hex-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.12] dark:opacity-[0.16]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={patternId}
          width="56"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.2)"
        >
          <path
            d="M28 2 L54 18 L54 50 L28 66 L2 50 L2 18 Z"
            fill="none"
            className="stroke-emerald-700 dark:stroke-emerald-300"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function ChemistryPortrait({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex h-44 w-44 items-center justify-center md:h-52 md:w-52",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
      <AtomGraphic
        className="absolute inset-0 h-full w-full"
        reduceMotion={!!reduceMotion}
      />
      <div className="relative z-10 flex h-[46%] w-[46%] items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-800 text-lg font-semibold tracking-wide text-white shadow-lg md:text-xl">
        AH
      </div>
    </div>
  );
}

function AtomGraphic({
  className,
  reduceMotion,
  reverse,
}: {
  className?: string;
  reduceMotion: boolean;
  reverse?: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className={className}
      animate={reduceMotion ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration: reverse ? 48 : 36, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="60" cy="60" r="8" className="fill-emerald-500" />
      <ellipse
        cx="60"
        cy="60"
        rx="48"
        ry="18"
        fill="none"
        className="stroke-emerald-500/70"
        strokeWidth="2"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="48"
        ry="18"
        fill="none"
        className="stroke-teal-500/70"
        strokeWidth="2"
        transform="rotate(60 60 60)"
      />
      <ellipse
        cx="60"
        cy="60"
        rx="48"
        ry="18"
        fill="none"
        className="stroke-cyan-500/70"
        strokeWidth="2"
        transform="rotate(120 60 60)"
      />
      <circle cx="108" cy="60" r="4" className="fill-teal-400" />
      <circle cx="12" cy="60" r="4" className="fill-cyan-400" />
    </motion.svg>
  );
}

function Benzene({
  className,
  reduceMotion,
}: {
  className?: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <polygon
        points="50,8 86,29 86,71 50,92 14,71 14,29"
        fill="none"
        className="stroke-emerald-600 dark:stroke-emerald-400"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="50"
        r="16"
        fill="none"
        className="stroke-teal-500"
        strokeWidth="2"
      />
    </motion.svg>
  );
}

function Flask({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 96" className={className}>
      <path
        d="M24 8 h16 v22 l14 40 a16 16 0 0 1-14 22 H24 a16 16 0 0 1-14-22 L24 30 Z"
        fill="none"
        className="stroke-emerald-700 dark:stroke-emerald-400"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M16 58 l8 22 a16 16 0 0 0 16 0 l8-22 Z"
        className="fill-emerald-400/35"
      />
      <circle cx="28" cy="70" r="3" className="fill-emerald-400/80" />
      <circle cx="38" cy="76" r="2.5" className="fill-teal-400/80" />
      <circle cx="32" cy="80" r="2" className="fill-cyan-400/80" />
    </svg>
  );
}

function Molecule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 70" className={cn("h-16 w-32", className)}>
      <line x1="20" y1="35" x2="70" y2="35" className="stroke-emerald-500" strokeWidth="3" />
      <line x1="70" y1="35" x2="110" y2="16" className="stroke-teal-500" strokeWidth="3" />
      <line x1="70" y1="35" x2="110" y2="54" className="stroke-cyan-500" strokeWidth="3" />
      <circle cx="20" cy="35" r="10" className="fill-emerald-500" />
      <circle cx="70" cy="35" r="12" className="fill-teal-500" />
      <circle cx="110" cy="16" r="8" className="fill-cyan-400" />
      <circle cx="110" cy="54" r="8" className="fill-emerald-400" />
    </svg>
  );
}
