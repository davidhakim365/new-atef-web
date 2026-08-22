import HeroSection from "@/components/landing-page/hero-section";
import MemoriesSection from "@/components/landing-page/memories-section";
import SeniorsSection from "@/components/landing-page/seniors-section";
import AboutSection from "@/components/landing-page/about-section";
import Footer from "@/components/footer";
import GradesSection from "@/components/landing-page/grades-section";
import { ChemistryFormulaStrip } from "@/components/landing-page/chemistry-graphics";

const StudentHomePage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <ChemistryFormulaStrip />
        <GradesSection />
      {/*  <ImportantLecturesSection />*/}
        <SeniorsSection />
        {/* <LatestLecturesSection /> */}
       <MemoriesSection/> 
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default StudentHomePage;
