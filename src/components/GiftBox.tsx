import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GiftBoxProps {
  onOpen: () => void;
  isOpened: boolean;
}

export const GiftBox = ({ onOpen, isOpened }: GiftBoxProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const lidRef = useRef<THREE.Mesh | null>(null);
  const bowRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff0dd, 1.5);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xff69b4, 2, 50);
    pointLight1.position.set(3, 5, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4b0082, 1.5, 50);
    pointLight2.position.set(-3, 4, -3);
    scene.add(pointLight2);

    const rimLight = new THREE.SpotLight(0xffd700, 5, 20, Math.PI / 4, 0.5, 1);
    rimLight.position.set(0, 5, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Premium Materials
    const boxMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd41c6a, // Deep pink
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });

    const ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffd700, // Gold
      roughness: 0.3,
      metalness: 0.8,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      emissive: 0xffd700,
      emissiveIntensity: 0.1,
    });

    // Gift box body
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    // Ribbon
    const ribbonHGeometry = new THREE.BoxGeometry(2.05, 0.2, 2.05);
    const ribbonH = new THREE.Mesh(ribbonHGeometry, ribbonMaterial);
    ribbonH.castShadow = true;
    scene.add(ribbonH);

    const ribbonVGeometry = new THREE.BoxGeometry(0.2, 2.05, 2.05);
    const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonMaterial);
    ribbonV.castShadow = true;
    scene.add(ribbonV);

    // Lid
    const lidGeometry = new THREE.BoxGeometry(2.1, 0.3, 2.1);
    const lid = new THREE.Mesh(lidGeometry, boxMaterial);
    lidRef.current = lid;
    lid.position.y = 1.15;
    lid.castShadow = true;
    scene.add(lid);

    // Lid Ribbon
    const lidRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 0.32, 0.2),
      ribbonMaterial
    );
    lid.add(lidRibbonH);

    const lidRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.32, 2.15),
      ribbonMaterial
    );
    lid.add(lidRibbonV);

    // Realistic Bow
    const createBow = () => {
      const bowGroup = new THREE.Group();

      // Knot
      const knotGeometry = new THREE.SphereGeometry(0.25, 32, 32);
      const knot = new THREE.Mesh(knotGeometry, ribbonMaterial);
      knot.scale.set(1, 0.6, 1);
      bowGroup.add(knot);

      // Loops
      const loopGeometry = new THREE.TorusGeometry(0.4, 0.15, 16, 32);

      const loop1 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop1.position.set(0.35, 0.1, 0);
      loop1.rotation.set(Math.PI / 2, 0, -Math.PI / 6);
      loop1.scale.set(1, 1, 0.6);
      bowGroup.add(loop1);

      const loop2 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop2.position.set(-0.35, 0.1, 0);
      loop2.rotation.set(Math.PI / 2, 0, Math.PI / 6);
      loop2.scale.set(1, 1, 0.6);
      bowGroup.add(loop2);

      const loop3 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop3.position.set(0, 0.1, 0.35);
      loop3.rotation.set(Math.PI / 3, Math.PI / 2, 0);
      loop3.scale.set(0.8, 0.8, 0.6);
      bowGroup.add(loop3);

      const loop4 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop4.position.set(0, 0.1, -0.35);
      loop4.rotation.set(-Math.PI / 3, Math.PI / 2, 0);
      loop4.scale.set(0.8, 0.8, 0.6);
      bowGroup.add(loop4);

      return bowGroup;
    };

    const bow = createBow();
    bowRef.current = bow as any;
    bow.position.y = 1.45;
    scene.add(bow);

    // Magical Particles
    const createParticles = () => {
      const particlesCount = 500;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);
      const sizes = new Float32Array(particlesCount);
      const speeds = new Float32Array(particlesCount);

      const colorPalette = [
        new THREE.Color(0xff69b4), // Hot pink
        new THREE.Color(0xffd700), // Gold
        new THREE.Color(0x00ffff), // Cyan
        new THREE.Color(0xffffff), // White
      ];

      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const r = 3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color!.r;
        colors[i3 + 1] = color!.g;
        colors[i3 + 2] = color!.b;

        sizes[i] = Math.random() * 0.15;
        speeds[i] = 0.2 + Math.random() * 0.5;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));

      const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        map: new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/spark1.png"),
        depthWrite: false,
      });

      return new THREE.Points(geometry, material);
    };

    const particles = createParticles();
    particlesRef.current = particles;
    scene.add(particles);

    camera.position.z = 6;
    camera.position.y = 2;

    // Animation loop
    let time = 0;
    let animationProgress = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      if (!isOpened) {
        // Idle animation
        const floatY = Math.sin(time * 2) * 0.1;
        const rotateY = Math.sin(time * 0.5) * 0.1;

        box.position.y = floatY;
        box.rotation.y = rotateY;

        ribbonH.position.y = floatY;
        ribbonH.rotation.y = rotateY;

        ribbonV.position.y = floatY;
        ribbonV.rotation.y = rotateY;

        lid.position.y = 1.15 + floatY;
        lid.rotation.y = rotateY;

        bow.position.y = 1.45 + floatY;
        bow.rotation.y = rotateY;

        // Hover effect
        if (isHovered) {
          const scale = 1 + Math.sin(time * 10) * 0.02;
          box.scale.setScalar(scale);
          ribbonH.scale.setScalar(scale);
          ribbonV.scale.setScalar(scale);
          lid.scale.setScalar(scale);
          bow.scale.setScalar(scale);
        } else {
          box.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          ribbonH.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          ribbonV.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          lid.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          bow.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
      } else {
        // Opening animation
        if (animationProgress < 1) {
          animationProgress += 0.02;
          const ease = 1 - Math.pow(1 - animationProgress, 3); // Cubic ease out

          lid.position.y = 1.15 + ease * 5;
          lid.rotation.x = ease * Math.PI * 0.5;
          lid.rotation.z = ease * Math.PI * 0.1;

          bow.position.y = 1.45 + ease * 6;
          bow.rotation.x = ease * Math.PI * 0.8;

          box.position.y = -ease * 0.5;
          box.scale.setScalar(1 - ease * 0.1);
        }
      }

      // Particle animation
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.1;
        const positions = particlesRef.current.geometry.attributes.position!.array as Float32Array;
        const speeds = particlesRef.current.geometry.attributes.speed!.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1]! += Math.sin(time * speeds[i / 3]!) * 0.02;
        }
        particlesRef.current.geometry.attributes.position!.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpened, isHovered]);

  return (
    <div
      ref={mountRef}
      className="w-full h-screen cursor-pointer"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};
