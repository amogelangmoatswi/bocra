"use client";

import React from "react";
import dynamic from "next/dynamic";
import * as r3f from "@react-three/fiber";
import * as drei from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Dynamically import ShaderGradient components with SSR disabled
const ShaderGradientCanvas = dynamic(
  () => import("shadergradient").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false }
);

const ShaderGradient = dynamic(
  () => import("shadergradient").then((mod) => mod.ShaderGradient),
  { ssr: false }
);

export const AboutHeroGradient = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small timeout to allow the WebGL context to initialize and render its first frame
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Static Placeholder Background (BOCRA Blue) */}
      <div 
        className="absolute inset-0 bg-[#0055A4] transition-opacity duration-1000"
        style={{ opacity: isReady ? 0 : 1 }}
      />
      
      {/* Animated Shader Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <ShaderGradientCanvas
          importedFiber={{ ...r3f }}
          importedDrei={{ ...drei }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={3.1}
            cPolarAngle={90}
            cameraZoom={1}
            color1="#0055A4"
            color2="#00004f"
            color3="#000000"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={40}
            frameRate={10}
            gizmoHelper="hide"
            grain="on"
            lightType="3d"
            pixelDensity={1}
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={4}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </motion.div>
    </div>
  );
};
