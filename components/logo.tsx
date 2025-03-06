"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Logo() {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href="/"
      className="flex items-center group transition-transform duration-300 hover:scale-105"
    >
      <div className="relative h-12 w-32 sm:h-16 sm:w-40 md:h-20 md:w-48">
        {imageError ? (
          <span className="text-dw-text font-bold text-lg sm:text-xl md:text-2xl group-hover:text-dw-blush transition-colors">
            DW Cycle
          </span>
        ) : (
          <Image
            src="/dw-logo.png"
            alt="DW."
            fill
            priority
            className="object-contain transition-opacity duration-300 group-hover:opacity-90"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </Link>
  );
}
