import type { CSSProperties } from 'react';
import { photoSources, type PhotoAsset } from '@/terrasse/lib/assets';

interface PicProps {
  photo: PhotoAsset;
  sizes: string;
  style?: CSSProperties;
  id?: string;
  loading?: 'lazy' | 'eager';
}

/** AVIF → WebP → JPEG, dimensions explicites, lazy par défaut. */
export const Pic = ({ photo, sizes, style, id, loading = 'lazy' }: PicProps) => {
  const s = photoSources(photo);
  return (
    <picture>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <source type="image/webp" srcSet={s.webp} sizes={sizes} />
      <img
        id={id}
        src={s.fallback}
        srcSet={s.jpg}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={loading}
        decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto', ...style }}
      />
    </picture>
  );
};
