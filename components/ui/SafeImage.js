"use client";
import { useState } from "react";

// <img> with a graceful gradient fallback if the remote image fails.
export default function SafeImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(!src);
  if (failed)
    return (
      <div role="img" aria-label={alt} className={`bg-gradient-to-br from-ocean to-navy ${className}`} />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
