import {
  Box,
  ContactShadows,
  Environment,
  OrbitControls,
  Sphere
} from "@react-three/drei";
import { Canvas, GroupProps } from "@react-three/fiber";
import {
  CuboidCollider,
  Debug,
  MeshCollider,
  Physics,
  RigidBody,
  useSphericalJoint
} from "@react-three/rapier";
import { R3RapierBranding } from "r3-rapier-branding";
import { Suspense, useRef } from "react";
import Spinner from "./Spinner";
import "./styles.scss";
import { Rope } from "./Rope";

function Scene() {
  return (
    <group>
      {/* <HangingThing position={[2, 3.5, 0]} />
      <HangingThing position={[5, 3.5, 0]} />
      <HangingThing position={[7, 3.5, 0]} /> */}

      <Rope length={37} />

      {/* Floor */}
      {/* <CuboidCollider position={[0, -2.5, 0]} args={[5, 1, 5]} /> */}

      <ContactShadows
        scale={20}
        blur={0.4}
        opacity={0.2}
        position={[-0, -1.5, 0]}
      />

      <OrbitControls />
    </group>
  );
}

export default function App() {
  return (
    <div className="App">
      <R3RapierBranding title="Joints" version="0.11.0">
        <Suspense fallback={<Spinner />}>
          <Canvas
            shadows
            camera={{
              position: [-8, 4, 8]
            }}
          >
            <Environment preset="studio" />
            <fog attach="fog" args={["#000", 2, 100]} />

            <Physics>
              <Scene />
              <Debug />
            </Physics>
          </Canvas>
        </Suspense>
      </R3RapierBranding>
    </div>
  );
}
