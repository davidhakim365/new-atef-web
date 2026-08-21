import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heading } from "./ui/heading";

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/dr.atefhelmi/",
      hoverColor:
        "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white",
      label: t("footer.social.facebook"),
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/@geniuschemistry-atefhelmy",
      hoverColor:
        "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white",
      label: t("footer.social.youtube"),
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/+201222388569",
      hoverColor:
        "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white",
      label: t("footer.social.whatsapp"),
    }
    
  ];

  const navLinks = [
    { title: t("footer.links.home"), href: "/home" },
    { title: t("footer.links.payments"), href: "/payments" },
  ];

  return (
    <div className="bg-footer">
      <footer className="md:rounded-t-3xl relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-16 lg:py-24">
        <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
          <AnimatedContainer className="flex flex-col items-center space-y-4">
            <Heading className="text-2xl font-bold md:text-3xl">
              {t("footer.brand")}
            </Heading>
          </AnimatedContainer>

          <AnimatedContainer delay={0.1} className="flex flex-col items-center">
            <ul className="flex flex-wrap justify-center gap-6 my-8 text-sm">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="hover:underline text-footer-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedContainer>

          <AnimatedContainer delay={0.2} className="flex flex-col items-center">
            <ul className="flex flex-wrap justify-center gap-6 my-8">
              {socialLinks.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`group ${social.hoverColor} duration-150 inline-flex`}
                  >
                    <social.icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </AnimatedContainer>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <span className="block text-sm text-center text-footer-foreground">
            BY
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        1D_Comapny 
            </a>
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </span>
        </div>
      </footer>
    </div>
  );
};

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Footer;
