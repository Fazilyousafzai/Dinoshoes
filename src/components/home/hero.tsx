"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[calc(100dvh-68px)] overflow-hidden bg-cobalt text-[#f3f4f2]">
      {reduce ? (
        <Image
          src="/images/hero-boot.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-center"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-boot.png"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,17,39,0.97)_0%,rgba(7,25,54,0.88)_38%,rgba(7,21,43,0.5)_72%,rgba(5,13,27,0.42)_100%),linear-gradient(0deg,rgba(6,12,24,0.72)_0%,rgba(6,16,32,0.18)_56%,rgba(6,13,27,0.35)_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[calc(100dvh-68px)] max-w-[1400px] items-end px-4 pb-8 pt-12 sm:px-6 md:items-center md:pb-12 lg:px-8">
        <motion.div
          className="max-w-[42rem]"
          initial={reduce ? false : { opacity: 0, x: -32, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="display-type display-chalk max-w-[8ch] text-[clamp(4rem,16vw,6rem)] leading-[0.82] md:text-[6rem] lg:text-[7.5rem]">
            OWN THE NEXT TOUCH.
          </h1>
          <p className="mt-5 max-w-sm text-base font-semibold leading-7 text-[#e0e7ef] md:text-lg">
            Four positions in your kit. One clean route to match day.
          </p>
          <div className="mt-7 flex">
            <Link
              href="/shop"
              className="button-press inline-flex min-h-13 items-center justify-center gap-3 bg-action px-6 font-extrabold text-[#f7f7f4] hover:bg-action-hover"
            >
              Shop gear <ArrowRight size={20} weight="bold" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
