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
        className="text-[0.72rem] uppercase tracking-[0.18em]"
        style={{ color: "rgba(75,158,255,0.6)" }}
      >
        Loading prototype…
      </p>
    </div>
  ),
});

export default function RobotViewerClient() {
  return <RobotViewer />;
}
