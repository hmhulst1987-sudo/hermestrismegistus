"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Egyptian sky dome — Giza plateau palette, day → dusk → night.
 *
 * What makes an Egyptian sky distinct from a generic "blue sky":
 *
 * 1. Zenith: Deep ultramarine cobalt — almost violet-blue. Egypt has
 *    some of the clearest, deepest blue sky in the world. No grey, no
 *    pale washed-out European blue.
 *
 * 2. Horizon dust band: The Sahara keeps fine sand perpetually suspended.
 *    This creates a very characteristic pale yellow-white scattering band
 *    just above the horizon — NOT sandy/orange, but almost bleached white
 *    with a slight warm tint. Sky blue transitions abruptly to this pale
 *    haze layer, then to the ground.
 *
 * 3. Sun: Positioned high (Egypt is 30° latitude, midday sun is 80°+
 *    above horizon in summer). Very harsh, white-hot center with a
 *    wide diffuse corona rather than a warm glow.
 *
 * 4. Dusk: Egypte has spectacular sunsets due to dust — deep amber/orange
 *    at horizon, transitioning to rose-magenta higher up, then to the
 *    darkening cobalt zenith. Famous Nile sunset palette.
 *
 * 5. Night: Pre-light-pollution blackness. Ancient Egyptians built
 *    their entire mythology around the night sky. Zenith is almost
 *    pure black-navy, stars extremely bright.
 */

const VERT = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vWorldPos;

  uniform float uDayNight;   // 0=noon, 1=night (smoothstep driven)
  uniform float uDusk;       // 0=day, 1=peak dusk, 0=night (bell curve)
  uniform vec3  uSunDir;

  // ---- palette ----
  // Day
  const vec3 DAY_ZENITH   = vec3(0.08, 0.26, 0.72);  // deep Egyptian cobalt
  const vec3 DAY_MID      = vec3(0.28, 0.55, 0.88);  // clear blue
  const vec3 DAY_HORIZON  = vec3(0.72, 0.76, 0.80);  // pale dusty blue-grey
  const vec3 DUST_HAZE    = vec3(0.90, 0.86, 0.74);  // sand dust bleach at y=0

  // Dusk
  const vec3 DUSK_ZENITH  = vec3(0.06, 0.09, 0.25);  // dark cobalt
  const vec3 DUSK_MID     = vec3(0.45, 0.18, 0.35);  // deep rose-violet
  const vec3 DUSK_HORIZON = vec3(0.96, 0.40, 0.06);  // burnt orange
  const vec3 DUSK_LOW     = vec3(0.98, 0.62, 0.14);  // golden amber

  // Night
  const vec3 NIGHT_ZENITH  = vec3(0.010, 0.015, 0.055); // near-black navy
  const vec3 NIGHT_HORIZON = vec3(0.038, 0.050, 0.110); // dark indigo

  void main() {
    vec3 dir = normalize(vWorldPos);
    float h = clamp(dir.y, -0.02, 1.0);

    // Non-linear height mapping — makes horizon transition sharper,
    // zenith colour deeper, matching Egyptian atmospheric perspective
    float tMid  = smoothstep(0.0, 0.35, h);           // 0 at horizon, 1 above 35°
    float tHigh = pow(smoothstep(0.15, 0.80, h), 1.4); // transitions to zenith

    // ---- BUILD DAY COLOUR ----
    // Start from dust haze at horizon, transition to pale horizon blue,
    // then to the deep cobalt zenith
    vec3 dayCol = mix(DUST_HAZE, DAY_HORIZON, smoothstep(0.0, 0.06, h));
    dayCol = mix(dayCol, DAY_MID, tMid);
    dayCol = mix(dayCol, DAY_ZENITH, tHigh);

    // ---- BUILD DUSK COLOUR ----
    vec3 duskCol = mix(DUSK_LOW, DUSK_HORIZON, smoothstep(0.0, 0.05, h));
    duskCol = mix(duskCol, DUSK_MID, smoothstep(0.0, 0.35, h));
    duskCol = mix(duskCol, DUSK_ZENITH, smoothstep(0.25, 0.85, h));

    // ---- BUILD NIGHT COLOUR ----
    vec3 nightCol = mix(NIGHT_HORIZON, NIGHT_ZENITH, smoothstep(0.0, 0.55, h));

    // ---- BLEND PHASES ----
    // Day → Dusk → Night
    vec3 col = mix(dayCol, duskCol, uDusk);
    col = mix(col, nightCol, uDayNight);

    // ---- SUN ----
    float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
    float sunFade = 1.0 - smoothstep(0.55, 0.92, uDayNight);
    // White-hot core disc, wide diffuse corona (Egyptian high-altitude sun)
    float sunDisc  = pow(sunDot, 2400.0) * 10.0;
    float sunCrona = pow(sunDot,   18.0) * 0.45;
    float sunHaze  = pow(sunDot,    4.0) * 0.10;
    // Slightly chromatic: core is white, outer glow warms
    vec3 sunCore  = vec3(1.05, 1.00, 0.92) * sunDisc;
    vec3 sunOuter = vec3(0.98, 0.80, 0.45) * (sunCrona + sunHaze);
    col += (sunCore + sunOuter) * sunFade;

    // ---- DUST HAZE BRIGHTENING at horizon ----
    // Even in daytime, the horizon smears light outward from sun
    float horizonGlow = exp(-pow(h * 18.0, 2.0));
    float dustDay = (1.0 - uDayNight) * (1.0 - uDusk * 0.6);
    col += vec3(0.92, 0.85, 0.65) * horizonGlow * 0.18 * dustDay;

    // ---- DUSK HORIZON BLOOM ----
    // During dusk, the horizon ignites — spread it upward more dramatically
    float duskBloom = smoothstep(0.0, 0.22, h) * (1.0 - smoothstep(0.22, 0.55, h));
    col += vec3(0.8, 0.25, 0.0) * duskBloom * uDusk * 0.6;

    // Subtle vignette toward zenith — Egyptian sky IS darker overhead
    col = mix(col, col * 0.88, smoothstep(0.6, 1.0, h) * (1.0 - uDayNight));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function DesertSky({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uDayNight: { value: 0 },
      uDusk:     { value: 0 },
      // High-altitude Egyptian sun: 60° above horizon, south-east
      uSunDir: { value: new THREE.Vector3(6, 16, 5).normalize() },
    }),
    []
  );

  useFrame(() => {
    if (!matRef.current) return;
    const p = progressRef.current ?? 0;

    // Day → full night across p=0.45..0.92
    const night = THREE.MathUtils.smoothstep(p, 0.50, 0.92);
    matRef.current.uniforms.uDayNight.value = night;

    // Dusk peaks at p≈0.62, bell curve
    const duskRamp = THREE.MathUtils.smoothstep(p, 0.42, 0.62);
    const duskFall = 1.0 - THREE.MathUtils.smoothstep(p, 0.62, 0.85);
    matRef.current.uniforms.uDusk.value = duskRamp * duskFall;
  });

  return (
    <mesh renderOrder={-10}>
      <sphereGeometry args={[450, 48, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
