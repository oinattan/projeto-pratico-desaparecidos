"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
  <Link href="/" className="flex items-center space-x-2">
  <span className="text-xl font-bold text-gray-900 dark:text-white">
    <Image
      src="/pjc_logo.svg"
      alt="Logo"
      width={40}
      height={40}
      priority
      className="w-10 h-10"
    />
  </span>
  </Link>
  );

}