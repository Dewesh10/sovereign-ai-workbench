import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Eye, Layers, RotateCcw, Zap, Flame, Thermometer, ShieldAlert, Activity } from 'lucide-react';

interface ThreeDAssemblyViewerProps {
  onSelectPin?: (pinId: string) => void;
}

export const ThreeDAssemblyViewer: React.FC<ThreeDAssemblyViewerProps> = ({ onSelectPin }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState<number>(0);
  const [thermalMode, setThermalMode] = useState<boolean>(false);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [activeComponent, setActiveComponent] = useState<string | null>('High-Pressure Rotor (HPR-01)');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const componentsRef = useRef<{ [key: string]: THREE.Mesh | THREE.Group }>({});
  const initialPositionsRef = useRef<{ [key: string]: THREE.Vector3 }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070b);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 6, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.0);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x3b82f6, 2, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 3D Assembly Models Construction (Industrial Gas Turbine Assembly)
    const assemblyGroup = new THREE.Group();

    // Materials
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });

    const rotorMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });

    const thermalMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
    });

    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.7,
      roughness: 0.2,
    });

    // 1. Main Casing (Outer Cylinder)
    const casingGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 32, 1, true);
    const casingMesh = new THREE.Mesh(casingGeo, metalMat);
    casingMesh.rotation.z = Math.PI / 2;
    assemblyGroup.add(casingMesh);
    componentsRef.current['Outer Casing'] = casingMesh;
    initialPositionsRef.current['Outer Casing'] = new THREE.Vector3(0, 2, 0);

    // 2. Central Shaft / Rotor (HPR-01)
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, rotorMat);
    shaftMesh.rotation.z = Math.PI / 2;
    assemblyGroup.add(shaftMesh);
    componentsRef.current['High-Pressure Rotor (HPR-01)'] = shaftMesh;
    initialPositionsRef.current['High-Pressure Rotor (HPR-01)'] = new THREE.Vector3(0, 0, 0);

    // 3. Compressor Blade Disks (3 Disks)
    const diskGroup = new THREE.Group();
    for (let i = -2; i <= 0; i++) {
      const diskGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.3, 24);
      const disk = new THREE.Mesh(diskGeo, bladeMat);
      disk.position.x = i * 1.2;
      disk.rotation.z = Math.PI / 2;
      diskGroup.add(disk);
    }
    assemblyGroup.add(diskGroup);
    componentsRef.current['Compressor Stage Disks'] = diskGroup;
    initialPositionsRef.current['Compressor Stage Disks'] = new THREE.Vector3(-1.5, 0, 0);

    // 4. Combustion Chamber Ring (Thermal hotspot)
    const ringGeo = new THREE.TorusGeometry(2.0, 0.4, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, thermalMat);
    ringMesh.rotation.y = Math.PI / 2;
    assemblyGroup.add(ringMesh);
    componentsRef.current['Combustion Ring (CR-9)'] = ringMesh;
    initialPositionsRef.current['Combustion Ring (CR-9)'] = new THREE.Vector3(1.2, 0, 0);

    // 5. Exhaust Nozzle Cone
    const coneGeo = new THREE.ConeGeometry(2.2, 3, 32, 1, true);
    const coneMesh = new THREE.Mesh(coneGeo, metalMat);
    coneMesh.position.x = 4.5;
    coneMesh.rotation.z = -Math.PI / 2;
    assemblyGroup.add(coneMesh);
    componentsRef.current['Exhaust Nozzle'] = coneMesh;
    initialPositionsRef.current['Exhaust Nozzle'] = new THREE.Vector3(4.5, 0, 0);

    scene.add(assemblyGroup);

    // Grid Helper & Orbit simulation
    const grid = new THREE.GridHelper(20, 20, 0x00f2fe, 0x1e293b);
    grid.position.y = -4;
    scene.add(grid);

    // Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        angle += 0.005;
        assemblyGroup.rotation.y = angle;
        assemblyGroup.rotation.x = Math.sin(angle * 0.5) * 0.15;
      }

      // Continuous rotor spin inside assembly
      shaftMesh.rotation.x += 0.05;
      diskGroup.rotation.x += 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Handle Explode Slider
  useEffect(() => {
    if (!sceneRef.current) return;
    const factor = exploded / 100;

    if (componentsRef.current['Outer Casing']) {
      componentsRef.current['Outer Casing'].position.y = factor * 3.5;
    }
    if (componentsRef.current['Compressor Stage Disks']) {
      componentsRef.current['Compressor Stage Disks'].position.x = -1.5 - factor * 2.5;
    }
    if (componentsRef.current['Combustion Ring (CR-9)']) {
      componentsRef.current['Combustion Ring (CR-9)'].position.x = 1.2 + factor * 2.0;
    }
    if (componentsRef.current['Exhaust Nozzle']) {
      componentsRef.current['Exhaust Nozzle'].position.x = 4.5 + factor * 3.5;
    }
  }, [exploded]);

  // Handle Thermal Mode Toggle
  useEffect(() => {
    const ring = componentsRef.current['Combustion Ring (CR-9)'] as THREE.Mesh;
    if (ring && ring.material) {
      const mat = ring.material as THREE.MeshStandardMaterial;
      if (thermalMode) {
        mat.color.setHex(0xff0000);
        mat.emissive.setHex(0xff2200);
        mat.emissiveIntensity = 0.9;
      } else {
        mat.color.setHex(0xef4444);
        mat.emissive.setHex(0xd97706);
        mat.emissiveIntensity = 0.4;
      }
    }
  }, [thermalMode]);

  // Handle Wireframe Toggle
  useEffect(() => {
    Object.values(componentsRef.current).forEach((obj) => {
      if (obj instanceof THREE.Mesh) {
        (obj.material as THREE.MeshStandardMaterial).wireframe = wireframe;
      } else if (obj instanceof THREE.Group) {
        obj.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            (child.material as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        });
      }
    });
  }, [wireframe]);

  return (
    <div className="relative w-full h-[520px] bg-[#05070b] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* 3D WebGL Header Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-[#0b0f17]/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/20 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Box size={18} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-cyan-200 tracking-wide uppercase">Interactive 3D WebGL CAD Assembly</h3>
            <p className="text-[10px] text-gray-400 font-mono">Model: Industrial Gas Turbine (GT-7000X) • Double-Precision Mesh</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
              thermalMode
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-gray-300 hover:border-slate-500'
            }`}
          >
            <Flame size={14} className={thermalMode ? 'animate-pulse text-rose-400' : ''} />
            Thermal Infrared
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
              wireframe
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-gray-300 hover:border-slate-500'
            }`}
          >
            <Layers size={14} />
            Wireframe
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
              autoRotate
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-800/60 border-slate-700 text-gray-300 hover:border-slate-500'
            }`}
          >
            <RotateCcw size={14} className={autoRotate ? 'animate-spin' : ''} />
            {autoRotate ? 'Orbit Active' : 'Orbit Paused'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mounting Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Exploding View Slider Overlay Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#0b0f17]/90 backdrop-blur-md p-3.5 rounded-lg border border-cyan-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <span className="text-xs font-mono text-cyan-300 uppercase flex items-center gap-1.5">
            <Zap size={14} className="text-cyan-400" />
            Exploded View Factor:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={exploded}
            onChange={(e) => setExploded(Number(e.target.value))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-cyan-400 font-bold w-12 text-right">{exploded}%</span>
        </div>

        {/* Telemetry Pin Callout Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-md">
          <Thermometer size={14} className="text-amber-400 animate-pulse" />
          <span>Combustion Ring Temp: <strong className="text-amber-200">1,240°C (CR-9)</strong></span>
          <button
            onClick={() => onSelectPin && onSelectPin('pin-1')}
            className="ml-2 px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded text-[10px] text-amber-200 transition-colors"
          >
            Inspect Asset
          </button>
        </div>
      </div>
    </div>
  );
};
