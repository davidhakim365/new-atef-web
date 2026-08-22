import { FlaskConical, School, MonitorPlay } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import {
  ChemistryGraphics,
  ChemistryPortrait,
} from "./chemistry-graphics";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const cardData = [
  {
    icon: FlaskConical,
    titleKey: "about.items.1.title",
    descKey: "about.items.1.description",
  },
  {
    icon: School,
    titleKey: "about.items.2.title",
    descKey: "about.items.2.description",
  },
  {
    icon: MonitorPlay,
    titleKey: "about.items.3.title",
    descKey: "about.items.3.description",
  },
];

function AboutSection() {
  const { t } = useTranslation();

  const stats = [
    {
      value: t("about.stats.experience.value"),
      label: t("about.stats.experience.label"),
    },
    {
      value: t("about.stats.faculty.value"),
      label: t("about.stats.faculty.label"),
    },
    {
      value: t("about.stats.online.value"),
      label: t("about.stats.online.label"),
    },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className="relative overflow-hidden py-16 md:py-28 bg-gradient-to-b from-white via-emerald-50/70 to-white dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-950"
    >
      <ChemistryGraphics className="opacity-35" />

      <div className="relative z-10 px-6 mx-auto max-w-6xl">
        <motion.div variants={fadeUp} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
            <FlaskConical className="h-3.5 w-3.5" />
            {t("about.badge")}
          </span>
          <Heading
            as="h2"
            className="mt-4 text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl"
          >
            {t("about.title")}
          </Heading>
          <SubHeading className="mt-4 text-lg tracking-wide text-balance md:text-xl">
            {t("about.description")}
          </SubHeading>
        </motion.div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-emerald-800/70 dark:bg-slate-950/70 md:p-10"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-start md:gap-8">
              <ChemistryPortrait />
              <div className="mt-6 md:mt-0">
                <p className="font-mono text-xs tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                  C₆H₆ · H₂O · NaCl
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
                  {t("hero.title")}
                </h3>
                <p className="mt-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  {t("about.role")}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-emerald-100 pt-6 dark:border-emerald-900/60">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 md:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400 md:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.ol
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="relative flex flex-col gap-4"
          >
            {cardData.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.titleKey}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/85 p-5 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-400 hover:bg-emerald-50/80 dark:border-emerald-800/70 dark:bg-slate-950/70 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/50 md:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        0{i + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white md:text-xl">
                        {t(item.titleKey)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </motion.section>
  );
}

export default AboutSection;
