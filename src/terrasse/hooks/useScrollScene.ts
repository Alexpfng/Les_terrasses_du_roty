import { type RefObject } from 'react';
import { ScrollTrigger, useGSAP } from '@/terrasse/lib/gsapSetup';
import { useLtdrStore } from '@/terrasse/lib/store';

/**
 * Relie une section à l'indicateur Terrasse I→VII et, optionnellement,
 * au montage d'une scène 3D quand la section approche du viewport.
 * useGSAP révoque les ScrollTriggers automatiquement au démontage.
 */
export const useScrollScene = (
  ref: RefObject<HTMLElement>,
  act: number,
  scene?: 'showDust' | 'showTerraces' | 'showBottle',
  /**
   * Fenêtre de montage de la scène 3D, en % de viewport depuis l'entrée
   * de la section. DOIT couvrir toute la durée du pin (sinon la scène se
   * démonte en plein pin et le rendu gèle). Inclure approche + pin + marge.
   */
  sceneSpanPercent = 200,
): void => {
  const setActiveAct = useLtdrStore((s) => s.setActiveAct);
  const setScene = useLtdrStore((s) => s.setScene);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActiveAct(act);
        },
      });
      if (scene) {
        ScrollTrigger.create({
          trigger: el,
          // monte la scène dès l'approche, la garde montée pendant tout le pin
          start: 'top 130%',
          end: `top+=${sceneSpanPercent}% top`,
          onToggle: (self) => setScene(scene, self.isActive),
        });
      }
    },
    { dependencies: [act, scene, sceneSpanPercent] },
  );
};
