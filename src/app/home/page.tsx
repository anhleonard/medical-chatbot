"use client";
import FeaturesPage from "@/components/home/features";
import IntroPage from "@/components/home/intro";
import PricingPage from "@/components/home/pricing";
import QuestionsPage from "@/components/home/questions";
import Button from "@/libs/button";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function Home() {
  const introRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    window.scrollTo({
      top: ref.current?.offsetTop ? ref.current.offsetTop - navHeight : 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full h-full">
      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 flex justify-between items-center w-full bg-primary-c10 py-3 z-50 px-4 sm:px-10 md:px-20 lg:px-28 2xl:px-36"
      >
        <button className="flex items-center gap-2">
          <Image src="/logo/medical-logo.svg" alt="medical-logo" width={30} height={30} />
          <div className="font-righteous text-xl md:text-2xl">
            <span className="text-logo">Medical</span> <span className="text-grey-c900">Chatbot</span>
          </div>
        </button>
        <div className="flex justify-center sm:justify-end space-x-12">
          <button onClick={() => scrollToSection(featuresRef)} className="text-primary-c900 font-semibold text-sm">
            Tính năng
          </button>
          <button onClick={() => scrollToSection(pricingRef)} className="text-primary-c900 font-semibold text-sm">
            Nâng cấp
          </button>
          <button onClick={() => scrollToSection(faqRef)} className="text-primary-c900 font-semibold text-sm">
            Hỏi đáp
          </button>
          <Button onClick={() => scrollToSection(introRef)} label="Bắt đầu" className="px-6 py-2" />
        </div>
      </nav>
      {/* Sections */}
      <div style={{ paddingTop: navHeight }} className="space-y-12">
        <section ref={introRef} className="2xl:h-screen bg-white">
          <IntroPage />
        </section>
        <section ref={featuresRef} className="lg:h-screen">
          <FeaturesPage />
        </section>
        <section ref={pricingRef} className="lg:h-screen">
          <PricingPage />
        </section>
        <section ref={faqRef} className="h-screen">
          <QuestionsPage />
        </section>
      </div>
    </div>
  );
}
