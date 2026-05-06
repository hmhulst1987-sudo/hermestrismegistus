"use client";

import { Stars as DreiStars } from "@react-three/drei";

export function Stars() {
  return <DreiStars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />;
}
