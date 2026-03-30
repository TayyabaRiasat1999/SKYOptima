import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF, Float, Line } from "@react-three/drei";
import * as THREE from "three";

function FlightPath({ curve }) {
    const points = useMemo(() => curve.getPoints(50), [curve]);

    return (
        <Line
            points={points}
            color="#38bdf8"
            lineWidth={1.5}
            dashed
            dashScale={5}
            dashSize={0.5}
            gapSize={0.5}
            transparent
            opacity={0.4}
        />
    );
}

function FlightPlaneModel({ curve }) {
    const moverRef = useRef();
    const modelRef = useRef();
    const { scene } = useGLTF("/models/aeroplane1.glb");

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);

        clone.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.metalness = 0.5;
                child.material.roughness = 0.2;
            }
        });

        return clone;
    }, [scene]);

    const pos = useMemo(() => new THREE.Vector3(), []);
    const target = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const progress = (t * 0.08) % 1;
        const lookAtAhead = Math.min(progress + 0.01, 0.99);

        curve.getPointAt(progress, pos);
        curve.getPointAt(lookAtAhead, target);

        if (moverRef.current) {
            moverRef.current.position.copy(pos);
            moverRef.current.lookAt(target);
        }

        if (modelRef.current) {
            modelRef.current.scale.setScalar(0.12);
            modelRef.current.rotation.set(0.15, Math.PI / 2, 0);
        }
    });

    return (
        <group ref={moverRef}>
            <group ref={modelRef}>
                <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
                    <primitive object={clonedScene} />
                </Float>
            </group>
        </group>
    );
}

useGLTF.preload("/models/aeroplane1.glb");

function HeroFlight3D() {
    const curve = useMemo(() => {
        return new THREE.CubicBezierCurve3(
            new THREE.Vector3(-9, -0.2, 0),
            new THREE.Vector3(-4, 4.6, 0),
            new THREE.Vector3(4, 4.6, 0),
            new THREE.Vector3(9, -0.2, 0)
        );
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full bg-transparent">
            <Canvas
                camera={{ position: [0, 2, 12], fov: 40 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 10]} intensity={2} />
                <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={1} />

                <Suspense
                    fallback={
                        <Html center>
                            <div className="text-sky-400">Loading SkyOptima...</div>
                        </Html>
                    }
                >
                    <FlightPath curve={curve} />
                    <FlightPlaneModel curve={curve} />
                </Suspense>
            </Canvas>
        </div>
    );
}

export default HeroFlight3D;