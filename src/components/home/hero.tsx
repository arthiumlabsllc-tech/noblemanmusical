"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";
import { heroSlides } from "@/lib/data/hero-slides";

const SLIDE_DURATION = 7000; // 7 seconds per slide
const RESUME_DELAY = 3000; // Resume auto-advance after 3s of inactivity
const KEN_BURNS_FROM = 1;
const KEN_BURNS_TO = 1.08;

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressStartRef = useRef<number>(Date.now());

  const totalSlides = heroSlides.length;
  const activeSlide = heroSlides[activeIndex];

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Auto-advance logic
  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setProgress(0);
      progressStartRef.current = Date.now();
    },
    []
  );

  const advanceSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % totalSlides;
      setProgress(0);
      progressStartRef.current = Date.now();
      return next;
    });
  }, [totalSlides]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || isHovering || reducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    progressStartRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - progressStartRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        advanceSlide();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovering, reducedMotion, advanceSlide, activeIndex]);

  // Pause on hover/touch
  const handlePause = useCallback(() => {
    setIsHovering(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const handleResume = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsHovering(false);
    }, RESUME_DELAY);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      setIsHovering(false);
      progressStartRef.current = Date.now();
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-navy-deep"
      style={{ minHeight: "90svh" }}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onTouchStart={handlePause}
      onTouchEnd={handleResume}
    >
      {/* ── Background Slides Layer ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === activeIndex ? 1 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0.5 : 1.2,
                ease: "easeInOut",
              }}
              aria-hidden={index !== activeIndex}
            >
              {/* Image with Ken Burns */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${slide.imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: slide.focalPoint,
                }}
                animate={
                  reducedMotion
                    ? { scale: 1 }
                    : {
                        scale:
                          index === activeIndex
                            ? [KEN_BURNS_FROM, KEN_BURNS_TO]
                            : KEN_BURNS_FROM,
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: SLIDE_DURATION / 1000,
                        ease: "linear",
                      }
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/40 to-navy-deep/85" />
      </div>

      {/* ── Fixed Content Layer ── */}
      <div className="relative z-10 flex min-h-[90svh] md:min-h-[85vh] flex-col items-center justify-center px-6 pt-chrome">
        <div className="mx-auto max-w-5xl text-center">
          {/* Main headline */}
          <motion.h1
            className="font-display text-5xl font-bold leading-tight text-cream sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Where Music
            <br />
            <span className="text-gold">Meets Majesty</span>
          </motion.h1>

          {/* Animated gold underline */}
          <motion.div
            className="mx-auto mt-6 h-0.5 bg-gold"
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeInOut" }}
          />

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-cream/70 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            Ghana&apos;s premier house of musical instruments — trusted by
            churches, radio stations, schools, and professional musicians across
            the nation. From Yamaha to traditional djembe, find your sound.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            <ShimmerButton size="lg" className="min-w-[220px]" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Explore the Collection
              </Link>
            </ShimmerButton>

            <ShimmerButton variant="outline" size="lg" className="min-w-[220px]" asChild>
              <a
                href={buildWhatsAppUrl({ message: "Hello Nobleman Musical Center, I'd like to inquire about your instruments." })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Order via WhatsApp
              </a>
            </ShimmerButton>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-kente-green" />
              Official Warranty
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Nationwide Delivery
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-kente-green" />
              Pay on Delivery in Accra
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Slide Tag (bottom-left) ── */}
      <div className="absolute bottom-8 left-6 z-10 md:bottom-12 md:left-8">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSlide.id}
            className="block text-xs font-medium uppercase tracking-[0.2em] text-cream/50"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            {activeSlide.tag}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Progress Bars (bottom-right) ── */}
      <div className="absolute bottom-8 right-6 z-10 flex items-center gap-2 md:bottom-12 md:right-8">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className="group relative h-0.5 w-8 overflow-hidden rounded-full bg-cream/20 transition-colors hover:bg-cream/40"
            aria-label={`Go to slide ${index + 1}: ${slide.tag}`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            {index === activeIndex && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            )}
            {index !== activeIndex && index < activeIndex && (
              <div className="absolute inset-y-0 left-0 w-full bg-gold/40" />
            )}
          </button>
        ))}
      </div>

      {/* ── Pause/Play Toggle (top-right, desktop only) ── */}
      <button
        onClick={togglePlay}
        className="absolute right-6 top-24 z-10 hidden rounded-full p-2 text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream md:block"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
    </section>
  );
}
