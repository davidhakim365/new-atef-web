import { Badge } from "../ui/badge";
import { Briefcase, School, Laptop, Atom } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import { WobbleCard } from "../ui/wobble-card";
import { CardContent, CardHeader } from "@/components/ui/card";
import { BlurryBackground } from "@/components/ui/blurry-background";

// Animation variants
const leftToRightVariants = {
  hidden: { opacity: 0, filter: "blur(20px)", x: -300 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: { duration: 1.0, ease: "easeInOut" },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, filter: "blur(20px)", scale: 0, y: 300 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    y: 0,
    transition: { type: "spring", bounce: 0.4, duration: 0.9 },
  },
};

const sectionContentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const textGroupVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0,
    },
  },
};

const cardGridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

// Updated green color theme
const cardData = [
  {
    icon: Atom,
    bgClass: "bg-emerald-600",
    titleKey: "about.items.1.title",
    descKey: "about.items.1.description",
    textColor: "text-white",
  },
  {
    icon: School,
    bgClass: "bg-green-700",
    titleKey: "about.items.2.title",
    descKey: "about.items.2.description",
    textColor: "text-white",
  },
  {
    icon: Laptop,
    bgClass: "bg-emerald-900",
    titleKey: "about.items.3.title",
    descKey: "about.items.3.description",
    textColor: "text-white",
  },
];

function AboutSection() {
  const { t } = useTranslation();

  const gradientColors = {
    from: "oklch(0.65 0.2 150)", // soft green
    to: "oklch(0.45 0.25 180)",  // darker green-blue
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionContentVariants}
      className="relative py-16 bg-aboutSection md:py-32"
    >
      <BlurryBackground
        gradientColors={gradientColors}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        <motion.div variants={textGroupVariants} className="text-center">
          <motion.div variants={leftToRightVariants}>
            <Badge className="px-4 py-1 mb-4 text-sm font-medium text-neutral-700 bg-neutral-100 border-neutral-200 hover:bg-neutral-200 dark:text-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 dark:hover:bg-neutral-600">
              {t("about.badge")}
            </Badge>
          </motion.div>

          <motion.div variants={leftToRightVariants}>
            <Heading className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl text-neutral-900 dark:text-neutral-50">
              {t("about.title")}
            </Heading>
          </motion.div>

          <motion.div variants={leftToRightVariants}>
            <SubHeading className="mt-4 text-lg tracking-wide text-balance md:text-xl text-neutral-600 dark:text-neutral-400">
              {t("about.description")}
            </SubHeading>
          </motion.div>
        </motion.div>

        <CardGrid cards={cardData} t={t} />
      </div>
    </motion.section>
  );
}

export default AboutSection;

// ==============
// CardGrid
// ==============

function CardGrid({
  cards,
  t,
}: {
  cards: {
    icon: React.ElementType;
    bgClass: string;
    titleKey: string;
    descKey: string;
    textColor?: string;
  }[];
  t: (key: string) => string;
}) {
  return (
    <motion.div
      variants={cardGridContainerVariants}
      className="md:max-w-full md:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16"
    >
      {cards.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div key={i} variants={cardItemVariants}>
            <WobbleCard containerClassName={`group ${item.bgClass}`}>
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Icon className={`${item.textColor ?? "text-white"} size-6`} aria-hidden />
                </CardDecorator>
                <Heading className={item.textColor ?? "text-white"}>
                  {t(item.titleKey)}
                </Heading>
              </CardHeader>
              <CardContent>
                <SubHeading
                  className={`mt-4 tracking-wide text-md text-balance md:text-lg ${
                    item.textColor ?? "text-white"
                  }`}
                >
                  {t(item.descKey)}
                </SubHeading>
              </CardContent>
            </WobbleCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ==============
// CardDecorator
// ==============

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div
      className="absolute inset-0 flex items-center justify-center m-auto border-t border-l size-12"
      style={{ backgroundColor: "var(--background)" }}
    >
      {children}
    </div>
  </div>
);
