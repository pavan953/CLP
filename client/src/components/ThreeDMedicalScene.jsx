import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDMedicalScene = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 420;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x0ea5e9, 3.5);
    keyLight.position.set(6, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x14b8a6, 4.0, 25);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x818cf8, 2.5, 20);
    rimLight.position.set(4, -6, -4);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const nodeMaterial1 = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      roughness: 0.15,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25
    });

    const nodeMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0d9488,
      emissiveIntensity: 0.25
    });

    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75
    });

    const helixGroup = new THREE.Group();
    const numPairs = 24;
    const helixRadius = 2.0;
    const helixHeight = 7.5;
    const sphereGeo = new THREE.SphereGeometry(0.22, 24, 24);

    for (let i = 0; i < numPairs; i++) {
      const t = i / numPairs;
      const angle = t * Math.PI * 4;
      const y = (t - 0.5) * helixHeight;

      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;

      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      const sphere1 = new THREE.Mesh(sphereGeo, nodeMaterial1);
      sphere1.position.set(x1, y, z1);
      helixGroup.add(sphere1);

      const sphere2 = new THREE.Mesh(sphereGeo, nodeMaterial2);
      sphere2.position.set(x2, y, z2);
      helixGroup.add(sphere2);

      const dist = 2 * helixRadius;
      const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, dist, 12);
      const bond = new THREE.Mesh(bondGeo, bondMaterial);
      bond.position.set(0, y, 0);
      bond.rotation.z = Math.PI / 2;
      bond.rotation.y = -angle;
      helixGroup.add(bond);
    }
    mainGroup.add(helixGroup);

    const coreGeo = new THREE.OctahedronGeometry(1.1, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.05,
      wireframe: false,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
    mainGroup.add(coreMesh);

    const shieldGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMaterial);
    mainGroup.add(shieldMesh);

    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePositions[p] = (Math.random() - 0.5) * 12;
      particlePositions[p + 1] = (Math.random() - 0.5) * 12;
      particlePositions[p + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.7
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    container.addEventListener('touchmove', onPointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      helixGroup.rotation.y = elapsedTime * 0.45;
      coreMesh.rotation.x = elapsedTime * 0.8;
      coreMesh.rotation.y = elapsedTime * 1.1;
      shieldMesh.rotation.y = -elapsedTime * 0.5;
      shieldMesh.rotation.z = elapsedTime * 0.3;

      const breath = Math.sin(elapsedTime * 1.5) * 0.08;
      mainGroup.position.y = breath;
      coreMesh.scale.setScalar(1 + breath * 0.5);

      targetRotationY = mouseX * 0.7;
      targetRotationX = mouseY * 0.5;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;

      particlePoints.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('touchmove', onPointerMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[340px] sm:min-h-[420px] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

