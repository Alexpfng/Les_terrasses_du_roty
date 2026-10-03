import { useEffect } from "react";
import { useLtdrStore, type Tier } from "@/terrasse/lib/store";

/** Heuristique simple : cœurs CPU + pointeur tactile + largeur d'écran. */
export const computeTier = (): Tier => {
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;
  if ((coarse && cores <= 4) || cores <= 2) return "low";
  if (coarse || narrow) return "mid";
  return "high";
};

/** Calcule le tier au montage et le pousse dans le store global. */
export const useResponsiveTier = (): Tier => {
  const tier = useLtdrStore((s) => s.tier);
  const setTier = useLtdrStore((s) => s.setTier);
  useEffect(() => {
    setTier(computeTier());
  }, [setTier]);
  return tier;
};
