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
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe6cc, 1);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffb6c1, 1.2, 50);
    pointLight1.position.set(3, 5, 3);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x87ceeb, 0.8, 50);
    pointLight2.position.set(-3, 4, -3);
    scene.add(pointLight2);

    const rimLight = new THREE.HemisphereLight(0xfffaf0, 0x69607e, 0.3);
    scene.add(rimLight);

    // Gift box body with better materials
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4a5a5,
      shininess: 120,
      specular: 0x222222,
      reflectivity: 0.5,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    scene.add(box);

    // Enhanced ribbon with better geometry
    const ribbonHGeometry = new THREE.BoxGeometry(2.2, 0.15, 0.4);
    const ribbonMaterial = new THREE.MeshPhongMaterial({
      color: 0xc77d7e,
      shininess: 150,
      specular: 0x333333,
    });
    const ribbonH = new THREE.Mesh(ribbonHGeometry, ribbonMaterial);
    ribbonH.castShadow = true;
    scene.add(ribbonH);

    const ribbonVGeometry = new THREE.BoxGeometry(0.4, 2.2, 0.4);
    const ribbonV = new THREE.Mesh(ribbonVGeometry, ribbonMaterial);
    ribbonV.castShadow = true;
    scene.add(ribbonV);

    // Enhanced lid with beveled edges
    const lidGeometry = new THREE.BoxGeometry(2.3, 0.4, 2.3);
    const lidMaterial = new THREE.MeshPhongMaterial({
      color: 0xe6b8b8,
      shininess: 120,
      specular: 0x222222,
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lidRef.current = lid;
    lid.position.y = 1.2;
    lid.castShadow = true;
    scene.add(lid);

    // Realistic bow with multiple parts
    const createBow = () => {
      const bowGroup = new THREE.Group();

      // Bow center
      const bowCenterGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const bowCenter = new THREE.Mesh(bowCenterGeometry, ribbonMaterial);
      bowCenter.scale.set(1.2, 0.6, 1.2);
      bowGroup.add(bowCenter);

      // Bow loops
      const bowLoopGeometry = new THREE.TorusGeometry(0.6, 0.15, 16, 32);
      for (let i = 0; i < 2; i++) {
        const bowLoop = new THREE.Mesh(bowLoopGeometry, ribbonMaterial);
        bowLoop.rotation.x = Math.PI / 2;
        bowLoop.position.y = 0.1;
        bowLoop.position.z = i === 0 ? -0.3 : 0.3;
        bowLoop.scale.set(1, 1, 0.8);
        bowGroup.add(bowLoop);
      }

      // Bow tails
      const bowTailGeometry = new THREE.PlaneGeometry(0.8, 0.3);
      const bowTailMaterial = ribbonMaterial.clone();
      bowTailMaterial.side = THREE.DoubleSide;

      for (let i = 0; i < 2; i++) {
        const bowTail = new THREE.Mesh(bowTailGeometry, bowTailMaterial);
        bowTail.position.y = -0.8;
        bowTail.position.x = i === 0 ? -0.4 : 0.4;
        bowTail.rotation.z = (Math.PI / 8) * (i === 0 ? 1 : -1);
        bowGroup.add(bowTail);
      }

      return bowGroup;
    };

    const bow = createBow();
    bowRef.current = bow as any;
    bow.position.y = 1.7;
    scene.add(bow);

    // Sparkling particles system
    const createParticles = () => {
      const particlesCount = 300;
      const positions = new Float32Array(particlesCount * 3);
      const colors = new Float32Array(particlesCount * 3);
      const sizes = new Float32Array(particlesCount);

      const colorPalette = [
        new THREE.Color(0xffb6c1), // Light pink
        new THREE.Color(0x87ceeb), // Light blue
        new THREE.Color(0xffd700), // Gold
        new THREE.Color(0x98fb98), // Pale green
      ];

      for (let i = 0; i < particlesCount; i++) {
        // Positions in a sphere around the gift
        const i3 = i * 3;
        const radius = 3 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Random colors from palette
        const color =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color!.r;
        colors[i3 + 1] = color!.g;
        colors[i3 + 2] = color!.b;

        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.02;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      return new THREE.Points(geometry, material);
    };

    const particles = createParticles();
    particlesRef.current = particles;
    scene.add(particles);

    camera.position.z = 6;
    camera.position.y = 2;

    // Animation states
    let animationProgress = 0;
    let hoverPulse = 0;
    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      if (!isOpened) {
        // Gentle rotation
        box.rotation.y += 0.002;
        lid.rotation.y += 0.002;
        ribbonH.rotation.y += 0.002;
        ribbonV.rotation.y += 0.002;
        bow.rotation.y += 0.002;

        // Enhanced floating effect with easing
        const floatY = Math.sin(time) * 0.15;
        box.position.y = floatY;
        lid.position.y = 1.2 + floatY;
        bow.position.y = 1.7 + floatY;

        // Hover effect with pulse
        if (isHovered) {
          hoverPulse = Math.min(hoverPulse + 0.1, 1);
        } else {
          hoverPulse = Math.max(hoverPulse - 0.1, 0);
        }

        const hoverScale = 1 + Math.sin(time * 8) * 0.05 * hoverPulse;
        const baseScale = 1 + hoverPulse * 0.1;

        box.scale.lerp(
          new THREE.Vector3(
            baseScale * hoverScale,
            baseScale * hoverScale,
            baseScale * hoverScale
          ),
          0.1
        );
        lid.scale.lerp(
          new THREE.Vector3(
            baseScale * hoverScale,
            baseScale * hoverScale,
            baseScale * hoverScale
          ),
          0.1
        );
      } else {
        // Enhanced opening animation with bounce
        if (animationProgress < 1) {
          animationProgress += 0.03;
          const progress = animationProgress;

          // Lid flies up with rotation
          lid.position.y =
            1.2 + progress * 3 + Math.sin(progress * Math.PI) * 0.5;
          lid.rotation.x = progress * Math.PI * 0.5;

          // Bow jumps and follows lid
          bow.position.y =
            1.7 + progress * 3 + Math.sin(progress * Math.PI * 2) * 0.3;
          bow.rotation.x = progress * Math.PI * 0.3;

          // Box settles down
          box.position.y = -progress * 0.2;
        }
      }

      // Animate particles with sparkling effect
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      const positions = particles.geometry.attributes.position!
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Gentle particle movement
        positions[i]! += Math.sin(time + i) * 0.002;
        positions[i + 1]! += Math.cos(time + i * 0.5) * 0.002;
      }
      particles.geometry.attributes.position!.needsUpdate = true;

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.2) * 0.5;
      camera.position.z = 6 + Math.cos(time * 0.3) * 0.3;
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
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
      className="w-full h-screen cursor-pointer bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    />
  );
};
