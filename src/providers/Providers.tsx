"use client";

import { ReactNode } from "react";
import { GsapProvider } from "./GsapProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <GsapProvider>
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </GsapProvider>
  );
}
