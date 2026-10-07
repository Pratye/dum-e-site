"use client";

import dynamic from "next/dynamic";

const RobotViewer = dynamic(() => import("./RobotViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{ height: "min(70vh,640px)" }}
    >
      <div className="loader-ring" />
      <p
        className="text-[13px]"
        style={{ color: "var(--color-mist)" }}
      >
        Loading the model…
      </p>
    </div>
  ),
});

export default function RobotViewerClient({ src }: { src?: string }) {
  return <RobotViewer src={src} />;
}
