function tornClipPath(teeth: number, jag: number, vertical: boolean): string {
  const pts: string[] = vertical ? ["0% 0%", "0% 100%"] : ["0% 0%", "100% 0%"];
  for (let i = teeth; i >= 0; i--) {
    const p = (i / teeth) * 100;
    const inset = i % 2 === 0 ? 100 : 100 - jag;
    pts.push(vertical ? `${inset}% ${p}%` : `${p}% ${inset}%`);
  }
  return `polygon(${pts.join(",")})`;
}

const CLIP_TOP = tornClipPath(18, 55, false);
const CLIP_LEFT = tornClipPath(24, 55, true);

export default function TornEdge({
  orientation = "top",
}: {
  orientation?: "top" | "left";
}) {
  if (orientation === "left") {
    return (
      <div className="relative w-3.5 shrink-0 self-stretch" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-0 w-6 bg-ink/10 blur-[2px]"
          style={{ clipPath: CLIP_LEFT }}
        />
        <div
          className="absolute inset-y-0 left-0 w-5 bg-paper shadow-[2px_0_3px_rgba(28,26,22,0.15)]"
          style={{ clipPath: CLIP_LEFT }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-3.5 shrink-0" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-6 bg-ink/10 blur-[2px]"
        style={{ clipPath: CLIP_TOP }}
      />
      <div
        className="absolute inset-x-0 top-0 h-5 bg-paper shadow-[0_2px_3px_rgba(28,26,22,0.15)]"
        style={{ clipPath: CLIP_TOP }}
      />
    </div>
  );
}
