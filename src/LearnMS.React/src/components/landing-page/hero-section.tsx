import { useGetProfile } from "@/generated/api";
import { Link } from "react-router-dom";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { FlowButton } from "../ui/flow-button";
import { Heading } from "../ui/heading";
import { Paragraph } from "../ui/paragraph";
import { Highlight } from "@/components/ui/hero-highlight";
import { Spotlight } from "../ui/spotlight";
import { ChemistryGraphics } from "./chemistry-graphics";
import { FlaskConical } from "lucide-react";

const getLeftToRightVariants = (isRTL: boolean) => ({
  hidden: { opacity: 0, filter: "blur(20px)", x: isRTL ? 300 : -300 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      duration: 1.0,
      ease: "easeInOut",
    },
  },
});

const getRightToLeftVideoVariants = (isRTL: boolean) => ({
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(20px)",
    x: isRTL ? -300 : 300,
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
});

const HeroSection = () => {
  const { data: profile } = useGetProfile();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const videoDelay = (5 - 1) * 0.15 + 1.0 + 0.2;

  const leftToRightVariants = getLeftToRightVariants(isRTL);
  const rightToLeftVideoVariants = getRightToLeftVideoVariants(isRTL);

  return (
    <motion.section
      dir={isRTL ? "rtl" : "ltr"}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex items-center justify-center min-h-screen py-16 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-950 lg:py-0"
    >
      <ChemistryGraphics />
      <Spotlight
        className="absolute left-0 -top-40 md:-top-20 md:left-60"
        fill="white"
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mx-auto lg:flex-row lg:px-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          className="relative flex flex-col items-center w-full gap-6 text-center lg:w-1/2 lg:items-start"
        >
          <motion.div
            variants={leftToRightVariants}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200"
          >
            <FlaskConical className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </motion.div>

          <motion.div variants={leftToRightVariants} className="relative z-10">
            <Heading>{t("hero.title")}</Heading>
          </motion.div>

          <motion.div variants={leftToRightVariants}>
            <Highlight className="text-2xl text-black dark:text-white md:text-3xl from-emerald-200 to-teal-200 dark:from-emerald-600 dark:to-teal-600">
              {t("hero.subtitle")}
            </Highlight>
          </motion.div>

          <motion.div variants={leftToRightVariants}>
            <Paragraph
              className={cn(
                "relative z-10 text-balance",
                isRTL ? "md:text-right" : "md:text-left"
              )}
            >
              {t("hero.description")}
            </Paragraph>
          </motion.div>

          <motion.p
            variants={leftToRightVariants}
            className="font-mono text-sm tracking-[0.18em] text-emerald-700/70 dark:text-emerald-300/70"
          >
            H₂O · C₆H₆ · NaCl · CO₂
          </motion.p>

          <motion.div
            variants={leftToRightVariants}
            className="flex flex-col items-center justify-center w-full gap-4 pt-4 sm:flex-row lg:justify-start lg:items-start"
          >
            {!profile?.data && (
              <Link to="/sign-in-sign-up" className="relative z-10">
                <FlowButton text={t("hero.getStarted")} />
              </Link>
            )}
            <Link to="/courses" className="relative z-10">
              <FlowButton
                text={t("hero.browseCourses")}
                className="bg-white text-emerald-700 border-emerald-300 hover:text-emerald-600 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-700"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={rightToLeftVideoVariants}
          transition={{
            delay: videoDelay,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="flex items-center justify-center w-full mt-12 lg:w-1/2 lg:max-w-3xl lg:pl-16 lg:mt-0"
        >
          <div className="relative w-full">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-400/20 via-teal-400/10 to-transparent blur-2xl" />
            <HeroVideoDialog
              className="relative block w-full dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/mD6PV4TRsOw"
              thumbnailSrc="https://img.youtube.com/vi/mD6PV4TRsOw/maxresdefault.jpg"
              thumbnailAlt="Promo Video Thumbnail"
            />
            <HeroVideoDialog
              className="relative hidden w-full dark:block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/mD6PV4TRsOw"
              thumbnailSrc="https://img.youtube.com/vi/mD6PV4TRsOw/maxresdefault.jpg"
              thumbnailAlt="Promo Video Thumbnail"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
