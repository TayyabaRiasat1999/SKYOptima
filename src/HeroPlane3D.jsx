import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";

function PlaneModel() {
    const groupRef = useRef();
    const { scene } = useGLTF("/models/plane.glb");

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.position.x = Math.sin(t * 0.35) * 1.2;
            groupRef.current.position.y = Math.sin(t * 0.9) * 0.18;
            groupRef.current.position.z = Math.cos(t * 0.35) * 0.35;

            groupRef.current.rotation.z = -0.18 + Math.sin(t * 0.8) * 0.05;
            groupRef.current.rotation.x = 0.18 + Math.sin(t * 0.6) * 0.04;
            groupRef.current.rotation.y = -0.9 + Math.cos(t * 0.5) * 0.12;
        }
    });

    return (
        <group ref={groupRef} scale={1.2}>
            <primitive object={scene} />
        </group>
    );
}

export default function HeroPlane3D() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 38 }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={1.8} />
                <directionalLight position={[4, 4, 4]} intensity={2.2} />
                <directionalLight position={[-3, 2, -2]} intensity={0.8} />
                <spotLight position={[0, 5, 5]} intensity={1.4} angle={0.35} penumbra={1} />

                <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
                    <PlaneModel />
                </Float>

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
}

useGLTF.preload("/models/plane.glb");