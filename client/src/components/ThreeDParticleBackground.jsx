import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDParticleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const particleCount = window.innerWidth < 768 ? 55 : 105;
    const maxDistance = 110;
    const bounds = { x: 500, y: 400, z: 300 };

    const particlesData = [];
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x0284c7),
      new THREE.Color(0x0d9488),
      new THREE.Color(0x2563eb),
      new THREE.Color(0x059669),
      new THREE.Color(0x4f46e5)
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * bounds.x * 2;
      const y = (Math.random() - 0.5) * bounds.y * 2;
      const z = (Math.random() - 0.5) * bounds.z * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const col = palette[i % palette.length];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      particlesData.push({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.4
        ),
        seed: Math.random() * Math.PI * 2
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
    grad.addColorStop(0, 'rgba(2, 132, 199, 1)');
    grad.addColorStop(0.35, 'rgba(13, 148, 136, 0.85)');
    grad.addColorStop(0.7, 'rgba(14, 165, 233, 0.35)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 48, 48);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 8.5,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(particleGeo, particleMat);
    particleGroup.add(pointCloud);

    const maxLineSegments = particleCount * 6;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    particleGroup.add(linesMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouseX = (clientX - width / 2) * 0.22;
      mouseY = (clientY - height / 2) * 0.22;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      particleGroup.rotation.y += 0.0014;
      particleGroup.rotation.x += 0.0007;

      const pos = pointCloud.geometry.attributes.position.array;
      let lineIndex = 0;
      let colorIndex = 0;
      let connectedLines = 0;

      const time = Date.now() * 0.0012;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const pData = particlesData[i];

        pos[i3] += pData.velocity.x;
        pos[i3 + 1] += pData.velocity.y + Math.sin(time + pData.seed) * 0.15;
        pos[i3 + 2] += pData.velocity.z;

        if (pos[i3] < -bounds.x || pos[i3] > bounds.x) pData.velocity.x = -pData.velocity.x;
        if (pos[i3 + 1] < -bounds.y || pos[i3 + 1] > bounds.y) pData.velocity.y = -pData.velocity.y;
        if (pos[i3 + 2] < -bounds.z || pos[i3 + 2] > bounds.z) pData.velocity.z = -pData.velocity.z;

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = pos[i3] - pos[j3];
          const dy = pos[i3 + 1] - pos[j3 + 1];
          const dz = pos[i3 + 2] - pos[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance && connectedLines < maxLineSegments) {
            const alpha = 1.0 - dist / maxDistance;

            linePositions[lineIndex++] = pos[i3];
            linePositions[lineIndex++] = pos[i3 + 1];
            linePositions[lineIndex++] = pos[i3 + 2];

            linePositions[lineIndex++] = pos[j3];
            linePositions[lineIndex++] = pos[j3 + 1];
            linePositions[lineIndex++] = pos[j3 + 2];

            const r = 0.02 * alpha;
            const g = 0.52 * alpha;
            const b = 0.78 * alpha;

            lineColors[colorIndex++] = r;
            lineColors[colorIndex++] = g;
            lineColors[colorIndex++] = b;

            lineColors[colorIndex++] = r;
            lineColors[colorIndex++] = g;
            lineColors[colorIndex++] = b;

            connectedLines++;
          }
        }
      }

      pointCloud.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
      linesMesh.geometry.setDrawRange(0, connectedLines * 2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
      style={{ willChange: 'transform' }}
    />
  );
};

