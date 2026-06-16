import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLtdrStore } from '@/terrasse/lib/store';
import { PARTICLES } from '@/terrasse/lib/animConfig';
import { ParticleField } from './ParticleField';
import { TerracesScene } from './TerracesScene';
import { BottleScene } from './BottleScene';
import { PostFX } from './PostFX';

/**
 * Un seul <Canvas> persistant, fixé derrière le contenu.
 * Les scènes sont montées/démontées selon la visibilité des sections,
 * et le rendu s'arrête (`frameloop="never"`) quand aucune n'est visible.
 */
const SceneRoot = () => {
  const showDust = useLtdrStore((s) => s.showDust);
  const showTerraces = useLtdrStore((s) => s.showTerraces);
  const showBottle = useLtdrStore((s) => s.showBottle);
  const tier = useLtdrStore((s) => s.tier);
  const ageOk = useLtdrStore((s) => s.ageOk);

  const anyScene = showDust || showTerraces || showBottle;
  // une seule scène pilote la caméra : la bouteille prime, puis les terrasses
  const driver = showBottle ? 'bottle' : showTerraces ? 'terraces' : 'dust';

  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        frameloop={anyScene && ageOk ? 'always' : 'never'}
        dpr={[1, tier === 'low' ? 1.25 : 1.6]}
        gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
        camera={{ fov: 45, near: 0.1, far: 300, position: [0, 0, 34] }}
      >
        <color attach="background" args={['#0A0908']} />
        <Suspense fallback={null}>
          {showDust && <ParticleField count={PARTICLES[tier]} mode="drift" opacity={0.55} driveCamera={driver === 'dust'} />}
          {showTerraces && <TerracesScene active={driver === 'terraces'} />}
          {showBottle && <BottleScene active={driver === 'bottle'} />}
          {tier === 'high' && (showTerraces || showBottle) && <PostFX />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneRoot;
