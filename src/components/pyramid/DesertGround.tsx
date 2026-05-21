"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PYRAMID_APEX_Y } from "./Pyramid";

const SIZE = 180; // slightly larger
const SEGMENTS = 256; // higher res for sharp ridges
const FLAT_RADIUS = 7.5;
const FLAT_RAMP = 6;

// hash-based value noise
function hash2(ix: number, iy: number): number {
  const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise2(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

// Ridged noise for sharp dunes
function ridgedNoise(x: number, y: number): number {
  let n = valueNoise2(x, y);
  n = 1.0 - Math.abs(n - 0.5) * 2.0; // fold up
  return n * n; // sharpen the crests
}

export function DesertGround() {
  const nearGeom = useMemo(() => {
    const g = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = g.attributes.position as THREE.BufferAttribute;

    // Giza plateau — mostly flat limestone, gentle undulations only far out.
    // Max dune amplitude kept well below the pyramid base so early build
    // blocks are fully visible and the chamber isn't buried in sand.
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.hypot(x, y);

      // Wide flat zone — pyramid sits on level plateau, not in a dune field
      const mask = THREE.MathUtils.smoothstep(dist, FLAT_RADIUS, FLAT_RADIUS + 18);
      // Amplitudes scale up gently with distance so far horizon has visible dunes
      const farFactor = THREE.MathUtils.smoothstep(dist, 20, 70);

      // Gentle rolling dunes — amplitude max ~1.8 near, ~2.5 far
      const dune1 = Math.sin(x * 0.02) * Math.cos(y * 0.015) * 1.8;
      const dune2 = Math.sin(x * 0.05 + 2) * Math.cos(y * 0.04 + 1) * 0.6;

      const h = (dune1 + dune2) * mask * (0.3 + 0.7 * farFactor);

      pos.setZ(i, h);
    }

    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  const dunes = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: [number, number, number];
      rotY: number;
    }[] = [];
    const count = 30;
    const radius = 70;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.2;
      const r = radius + (Math.random() - 0.5) * 15;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const w = 30 + Math.random() * 25;
      const d = 12 + Math.random() * 10;
      const h = 2.0 + Math.random() * 2.5; // Visible but not massive
      items.push({
        position: [x, -PYRAMID_APEX_Y / 2 - 2.8, z],
        scale: [w, h, d],
        rotY: Math.random() * Math.PI,
      });
    }
    return items;
  }, []);

  const duneGeom = useMemo(() => {
    return new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  }, []);

  // Procedural sand micro-bump — no external asset, gives realistic grain detail
  const sandBump = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      // soft grain + occasional brighter sand crystal
      const base = 110 + Math.random() * 80;
      const speckle = Math.random() < 0.02 ? 220 : 0;
      const v = Math.min(255, base + speckle);
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    tex.anisotropy = 8;
    return tex;
  }, []);

  // Warm Giza plateau limestone, with the HDR environment doing the heavy lifting for tone
  const sandProps = {
    color: "#c8b07a",
    roughness: 0.95,
    metalness: 0.02,
    bumpMap: sandBump ?? undefined,
    bumpScale: 0.04,
    envMapIntensity: 0.55,
  };

  return (
    <group>
      {/* Near Ground */}
      <mesh
        geometry={nearGeom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -PYRAMID_APEX_Y / 2 - 2.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial {...sandProps} />
      </mesh>

      {/* Distant horizon dune ring */}
      {dunes.map((d, i) => (
        <mesh
          key={i}
          geometry={duneGeom}
          position={d.position}
          scale={d.scale}
          rotation={[0, d.rotY, 0]}
          receiveShadow
        >
          <meshStandardMaterial {...sandProps} color="#bca46a" bumpScale={0.07} />
        </mesh>
      ))}

    </group>
  );
}

