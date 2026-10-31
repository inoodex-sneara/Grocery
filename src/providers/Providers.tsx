"use client";

import { ReactNode, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { GsapProvider } from "./GsapProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    void Promise.resolve(useCartStore.persist.rehydrate()).catch((error: unknown) => {
      console.error("Failed to restore the cart.", error);
    });
    void Promise.resolve(useWishlistStore.persist.rehydrate()).catch(
      (error: unknown) => {
        console.error("Failed to restore the wishlist.", error);
      },
    );
  }, []);

  return (
    <GsapProvider>
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </GsapProvider>
  );
}
