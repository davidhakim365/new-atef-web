import { useMemo, useState } from "react";
import { Gallery4 } from "@/components/ui/gallery4";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";
import { BlurryBackground } from "@/components/ui/blurry-background";

const seniors = [
  {
    year: "Seniors'24",
    images: [
      {
        id: "s22-1",
        src: "https://i.ibb.co/VYrcwgKc/image.png",
        description:
          "Seniors'22 kicking off their year with enthusiasm and teamwork.",
      },
      {
        id: "s22-2",
        src: "https://i.ibb.co/Xx9VMKQF/image.png",
        description:
          "Seniors'22 collaborating on projects that shaped their future.",
      },
      {
        id: "s22-3",
        src: "https://i.ibb.co/jvvnr9B9/image.png",
        description:
          "Moments of joy from Seniors'22, celebrating their achievements.",
      },
      {
        id: "s22-4",
        src: "https://i.ibb.co/4ws1vhXZ/image.png",
        description: "Seniors'22 embracing challenges and growing together.",
      },
      {
        id: "s22-5",
        src: "https://i.ibb.co/7xtx62sj/image.png",
        description: "Seniors'22 creating memories during their final year.",
      },
      {
        id: "s22-6",
        src: "https://i.ibb.co/Ps5mFGcX/image.png",
        description: "Seniors'22 showcasing their creativity and passion.",
      },
      {
        id: "s22-7",
        src: "https://i.ibb.co/7tRj79Fq/image.png",
        description: "Seniors'22 leaving a legacy of inspiration and success.",
      },
      {
        id: "s22-8",
        src: "https://i.ibb.co/chHTQ6Yd/image.png",
        description: "Seniors'22 reflecting on their journey with pride.",
      },
    ],
  },
  {
    year: "Seniors'25",
    images: [
      {
        id: "s23-1",
        src: "https://i.ibb.co/W4kDKFNc/image.png",
        description: "Seniors'23 starting their year with ambition and unity.",
      },
      {
        id: "s23-2",
        src: "https://i.ibb.co/VcYPy6sB/image.png",
        description: "Seniors'23 pushing boundaries with innovative ideas.",
      },
      {
        id: "s23-3",
        src: "https://i.ibb.co/xq612TkC/image.png",
        description: "Seniors'23 celebrating milestones with enthusiasm.",
      },
      {
        id: "s23-4",
        src: "https://i.ibb.co/1GYks31d/image.png",
        description: "Seniors'23 building connections that last a lifetime.",
      },
      {
        id: "s23-5",
        src: "https://i.ibb.co/yFWqyjVT/image.png",
        description: "Seniors'23 thriving in collaborative environments.",
      },
      {
        id: "s23-6",
        src: "https://i.ibb.co/d41nvqvC/image.png",
        description:
          "Seniors'23 marking their journey with unforgettable moments.",
      },
      {
        id: "s23-7",
        src: "https://i.ibb.co/XZcnNMS9/image.png",
        description:
          "Seniors'23 leaving their mark with determination and spirit.",
      },
      {
        id: "s23-8",
        src: "https://i.ibb.co/SXx5MxGB/image.png",
        description: "Seniors'23 reflecting on a year of growth and success.",
      },
    ],
  },
];

interface Gallery4Props {
  title: string;
  description: string;
  items: {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
  }[];
}

const leftToRightVariants = {
  hidden: { opacity: 0, filter: "blur(20px)", x: -300 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      duration: 1.0,
      ease: "easeInOut",
    },
  },
};

function SeniorsSection() {
  const [activeYear, setActiveYear] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const galleryData: Gallery4Props = useMemo(
    () => ({
      title: t("seniors.title"),
      description: t("seniors.description"),
      items: seniors[activeYear].images.map(({ id, src }) => ({
        id,
        title: t(`seniors.classes.${activeYear + 1}.title`),
        description: t(`seniors.classes.${activeYear + 1}.description`),
        href: `#${id}`,
        image: src,
      })),
    }),
    [activeYear, t]
  );

  const gradientColors = {
    from: "oklch(0.7 0.2 60)",
    to: "oklch(0.5 0.2 260)",
  };

  if (shouldReduceMotion) {
    return (
      <section className="relative w-full pt-16 bg-seniorsSection">
        {" "}
        <BlurryBackground
          gradientColors={gradientColors}
          className="absolute inset-0 z-0"
        />
        <div className="container relative z-10 px-4 mx-auto">
          {" "}
          {/* Added z-10 to ensure content is above background */}
          <div className="flex flex-col gap-6 text-center">
            <Heading className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl">
              {t("seniors.title")}
            </Heading>
            <SubHeading className="mt-4 text-lg tracking-wide text-balance md:text-xl">
              {t("seniors.description")}
            </SubHeading>

            <div className="flex justify-center gap-4">
              {seniors.map((batch, index) => (
                <button
                  key={batch.year}
                  onClick={() => {
                    setActiveYear(index);
                    setSelectedTab(index);
                  }}
                  className="relative px-6 py-2 transition-all rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {selectedTab === index && (
                    <span className="absolute inset-0 z-10 rounded-full bg-neutral-200 dark:bg-neutral-600"></span>
                  )}
                  <span className="relative z-20">
                    {t(`seniors.classes.${index + 1}.title`)}
                  </span>
                </button>
              ))}
            </div>
            <Gallery4 {...galleryData} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-16 bg-seniorsSection">
      {" "}
      {/* Added relative positioning */}
      {/* Blurry Background */}
      <BlurryBackground
        gradientColors={gradientColors}
        className="absolute inset-0 z-0"
      />
      <div className="container relative z-10 px-4 mx-auto">
        {" "}
        {/* Added z-10 to ensure content is above background */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
          className="flex flex-col gap-6 text-center"
        >
          <motion.div variants={leftToRightVariants}>
            <Heading className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl">
              {t("seniors.title")}
            </Heading>
          </motion.div>
          <motion.div variants={leftToRightVariants}>
            <SubHeading className="mt-4 text-lg tracking-wide text-balance md:text-xl">
              {t("seniors.description")}
            </SubHeading>
          </motion.div>

          <motion.div
            variants={leftToRightVariants}
            className="flex justify-center gap-4"
          >
            {seniors.map((batch, index) => (
              <button
                key={batch.year}
                onClick={() => {
                  setActiveYear(index);
                  setSelectedTab(index);
                }}
                className="relative px-6 py-2 transition-all rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {selectedTab === index && (
                  <motion.span
                    layoutId="active-year"
                    className="absolute inset-0 z-10 rounded-full bg-neutral-200 dark:bg-neutral-600"
                    transition={{ duration: 0.2 }}
                  ></motion.span>
                )}

                <span className="relative z-20">
                  {t(`seniors.classes.${index + 1}.title`)}
                </span>
              </button>
            ))}
          </motion.div>

          <motion.div variants={leftToRightVariants}>
            <Gallery4 {...galleryData} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default SeniorsSection;
