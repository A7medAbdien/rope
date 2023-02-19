import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import {
  Vector3Array,
  RigidBodyTypeString,
  RigidBodyApi,
  RigidBody,
  RigidBodyApiRef,
  useSphericalJoint
} from "@react-three/rapier";
import { forwardRef, ReactNode, useRef, createRef } from "react";
import { Quaternion } from "three";

const RopeSegment = forwardRef<
  RigidBodyApi,
  {
    position: Vector3Array;
    component: ReactNode;
    type: RigidBodyTypeString;
  }
>(({ position, component, type }, ref) => {
  return (
    <RigidBody colliders="ball" ref={ref} type={type} position={position}>
      {component}
    </RigidBody>
  );
});

/**
 * We can wrap our hook in a component in order to initiate
 * them conditionally and dynamically
 */
const RopeJoint = ({ a, b }: { a: RigidBodyApiRef; b: RigidBodyApiRef }) => {
  useSphericalJoint(a, b, [
    [-0.6, 0, 0],
    [0.6, 0, 0]
  ]);
  return null;
};

const getCircleCoordinates = (angle: number, distance = 8) => {
  angle *= Math.PI / 180;
  let x = distance * Math.cos(angle),
    y = distance * Math.sin(angle);

  return { x, y, angle, distance };
};

export const Rope = (props: { length: number }) => {
  const refs = useRef(
    Array.from({ length: props.length }).map(() => createRef<RigidBodyApi>())
  );

  useFrame(() => {
    const now = performance.now();
    // refs.current[0].current!.setNextKinematicRotation(
    //   new Quaternion(0, Math.sin(now / 800) * 6, 0)
    // );
    refs.current[0].current!.addForce([0, 1, 0]);
  });

  const theta = 360 / 36;
  return (
    <group>
      {refs.current.map((ref, i) => {
        let { x, y } = getCircleCoordinates(i * theta);
        return (
          <RopeSegment
            ref={ref}
            key={i}
            position={[x, y, 0]}
            // position={i === 35 ? [0, 0, 0] : [i * 1, 0, 0]}
            component={
              <Sphere args={[0.6]}>
                <meshStandardMaterial />
              </Sphere>
            }
            type={i === 0 || i === 36 ? "kinematicPosition" : "dynamic"}
          />
        );
      })}
      {/**
       * Multiple joints can be initiated dynamically by
       * mapping out wrapped components containing the hooks
       */}
      {refs.current.map(
        (ref, i) =>
          i > 0 && (
            <RopeJoint a={refs.current[i]} b={refs.current[i - 1]} key={i} />
          )
      )}
    </group>
  );
};
