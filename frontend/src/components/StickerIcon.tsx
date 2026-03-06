interface StickerIconProps {
  index: number;
  className?: string;
  alt?: string;
}

export function StickerIcon({ index, className = '', alt = '' }: StickerIconProps) {
  const positions = [
    { x: 0, y: 0 },      // heart
    { x: 170, y: 0 },    // sparkle
    { x: 340, y: 0 },    // chat bubble
    { x: 512, y: 0 },    // rose
    { x: 682, y: 0 },    // star
    { x: 852, y: 0 },    // wink
  ];

  const pos = positions[index % 6];

  return (
    <div 
      className={`sticker-icon smooth-render ${className}`}
      style={{
        width: '64px',
        height: '64px',
        backgroundImage: 'url(/assets/generated/sticker-set.dim_1024x1024.png)',
        backgroundPosition: `-${pos.x}px -${pos.y}px`,
        backgroundSize: '1024px 1024px',
      }}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt || undefined}
    />
  );
}
