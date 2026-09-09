import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";

/**
 * Post-processing léger : seuil de bloom haut pour que seuls les reflets
 * or saturés blooment — jamais de halo sur le texte (qui est en DOM, au-dessus).
 */
export const PostFX = () => (
  <EffectComposer multisampling={0}>
    <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.2} intensity={0.4} mipmapBlur />
    <Noise opacity={0.03} />
    <Vignette offset={0.2} darkness={0.35} eskil={false} />
  </EffectComposer>
);
