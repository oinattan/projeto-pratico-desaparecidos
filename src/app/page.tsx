"use client";
import React from "react";
import { ThemeBackground } from "../components/ui/backgrounds";
import { Hero, EmergencyContact } from "../components/layout/sections";
import { PessoaListHomePaginated } from "@/components/features/pessoa";

export default function Home() {
  return (
  <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
  <ThemeBackground />
  <Hero />
  <section id="pessoas" className="w-full px-4 lg:px-8 -mt-20">
    <PessoaListHomePaginated />
  </section>
  <div id="contato" className="w-full">
    <EmergencyContact />
  </div>
  </div>);

}