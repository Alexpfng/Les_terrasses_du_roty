import { create } from 'zustand';

export type Tier = 'high' | 'mid' | 'low';

const AGE_KEY = 'ltdr-age-ok';
const AGE_TTL = 30 * 24 * 3600 * 1000; // 30 jours

const readAge = (): boolean => {
  try {
    const raw = localStorage.getItem(AGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (Number.isNaN(ts) || Date.now() - ts > AGE_TTL) {
      localStorage.removeItem(AGE_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

interface LtdrState {
  /** age-gate validé */
  ageOk: boolean;
  confirmAge: () => void;
  /** préchargement terminé */
  ready: boolean;
  setReady: (v: boolean) => void;
  /** menu plein écran */
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  /** acte actif (1..7) pour l'indicateur Terrasse I→VII */
  activeAct: number;
  setActiveAct: (n: number) => void;
  /** scènes 3D montées (pilotées par la visibilité des sections) */
  showDust: boolean;
  showTerraces: boolean;
  showBottle: boolean;
  setScene: (k: 'showDust' | 'showTerraces' | 'showBottle', v: boolean) => void;
  /** tier de performance */
  tier: Tier;
  setTier: (t: Tier) => void;
}

export const useLtdrStore = create<LtdrState>((set) => ({
  ageOk: readAge(),
  confirmAge: () => {
    try {
      localStorage.setItem(AGE_KEY, String(Date.now()));
    } catch {
      /* stockage indisponible : la validation vaut pour la session */
    }
    set({ ageOk: true });
  },
  ready: false,
  setReady: (ready) => set({ ready }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  activeAct: 1,
  setActiveAct: (activeAct) => set({ activeAct }),
  showDust: true,
  showTerraces: false,
  showBottle: false,
  setScene: (k, v) => set({ [k]: v }),
  tier: 'high',
  setTier: (tier) => set({ tier }),
}));
