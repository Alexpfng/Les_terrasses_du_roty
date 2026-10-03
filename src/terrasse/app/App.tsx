import { lazy, Suspense, useEffect } from "react";
import { initLenis, scrollLock } from "@/terrasse/lib/lenis";
import { ScrollTrigger } from "@/terrasse/lib/gsapSetup";
import { useLtdrStore } from "@/terrasse/lib/store";
import { useResponsiveTier } from "@/terrasse/hooks/useResponsiveTier";
import { useScrollVelocity } from "@/terrasse/hooks/useScrollVelocity";
import { AgeGate } from "@/terrasse/components/layout/AgeGate";
import { Preloader } from "@/terrasse/components/layout/Preloader";
import { Nav } from "@/terrasse/components/layout/Nav";
import { BurgerMenu } from "@/terrasse/components/layout/BurgerMenu";
import { ScrollProgress } from "@/terrasse/components/layout/ScrollProgress";
import { Cursor } from "@/terrasse/components/ui/Cursor";
import { Act1Hero } from "@/terrasse/components/sections/Act1Hero";
import { Act2Oubli } from "@/terrasse/components/sections/Act2Oubli";
import { Act3Mains } from "@/terrasse/components/sections/Act3Mains";
import { Act4Terre } from "@/terrasse/components/sections/Act4Terre";
import { Act5Vivant } from "@/terrasse/components/sections/Act5Vivant";
import { Act6Bouteille } from "@/terrasse/components/sections/Act6Bouteille";
import { Act7Boutique } from "@/terrasse/components/sections/Act7Boutique";

// La couche 3D (three.js) est chargée en différé : le récit reste lisible sans elle.
const SceneRoot = lazy(() => import("@/terrasse/components/three/SceneRoot"));

const App = () => {
  const ageOk = useLtdrStore((s) => s.ageOk);
  const ready = useLtdrStore((s) => s.ready);
  useResponsiveTier();
  useScrollVelocity();

  useEffect(() => {
    // récit one-page : l'expérience reprend toujours à l'Acte I
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initLenis();
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(t);
  }, []);

  // le scroll reste verrouillé tant que l'age-gate et le preloader ne sont pas passés
  useEffect(() => {
    scrollLock(!(ageOk && ready));
  }, [ageOk, ready]);

  return (
    <>
      <AgeGate />
      <Preloader />
      <Cursor />
      <div className="ltdr-grain" aria-hidden="true" />
      <div className="ltdr-vignette" aria-hidden="true" />
      <Nav />
      <BurgerMenu />
      <ScrollProgress />
      {ageOk && (
        <Suspense fallback={null}>
          <SceneRoot />
        </Suspense>
      )}
      <main>
        <Act1Hero />
        <Act2Oubli />
        <Act3Mains />
        <Act4Terre />
        <Act5Vivant />
        <Act6Bouteille />
        <Act7Boutique />
      </main>
    </>
  );
};

export default App;
