/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
type CircleCutoutProps = {
  src: string;
  className?: string;
};

export function CircleCutout({ src, className = "" }: CircleCutoutProps) {
  return (
    <div
      className={`overflow-hidden rounded-full border-[4px] border-white bg-black/40 shadow-2xl ${className}`}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        crossOrigin="anonymous"
      />
    </div>
  );
}
