import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useState } from "react";
import { BirthdayMessage } from "./BirthdayMessage";
interface BirthdayScene3DProps {
  photos: string[];
  birthdayName?: string;
}

export const BirthdayScene3D = ({
  photos,
  birthdayName = "Happy Birthday",
}: BirthdayScene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishText, setWishText] = useState("");

  // Predefined wish messages
  const wishMessages = [
    "Wishing you a day filled with happiness and a year filled with joy. Happy birthday! 🎉",
    "May your birthday be as special as you are! Enjoy your day to the fullest! 🎂",
    "Another year older, another year wiser! Hope your birthday is amazing! ✨",
    "Sending you smiles for every moment of your special day! Have a wonderful birthday! 🌟",
    "May all your dreams and wishes come true today and always! Happy birthday! 🎈",
  ];

  const getRandomWish = () => {
    return wishMessages[Math.floor(Math.random() * wishMessages.length)];
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with more appealing background
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Gradient background
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, 0, 32);
    gradient.addColorStop(0, "#ffebf3");
    gradient.addColorStop(1, "#ffe4ec");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    scene.background = new THREE.CanvasTexture(canvas);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5f5, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfffaf0, 0.8);
    directionalLight.position.set(8, 12, 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Decorative colored lights
    const colors = [0xffb6c1, 0xffd700, 0x87ceeb, 0x98fb98];
    colors.forEach((color, i) => {
      const angle = (i / colors.length) * Math.PI * 2;
      const pointLight = new THREE.PointLight(color, 0.8, 15);
      pointLight.position.set(Math.cos(angle) * 8, 6, Math.sin(angle) * 8);
      scene.add(pointLight);
    });

    // Improved Floor with subtle pattern
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f0f0,
      roughness: 0.7,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create Walls
    const createWall = (
      width: number,
      height: number,
      position: [number, number, number],
      rotation: [number, number, number]
    ) => {
      const wallGeometry = new THREE.PlaneGeometry(width, height);
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff5f5,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(...position);
      wall.rotation.set(...rotation);
      wall.receiveShadow = true;
      return wall;
    };

    // Back wall
    const backWall = createWall(40, 20, [0, 7.5, -20], [0, 0, 0]);
    scene.add(backWall);

    // Side walls
    const leftWall = createWall(40, 20, [-20, 7.5, 0], [0, Math.PI / 2, 0]);
    scene.add(leftWall);

    const rightWall = createWall(40, 20, [20, 7.5, 0], [0, -Math.PI / 2, 0]);
    scene.add(rightWall);

    // Enhanced Table with better wood texture
    const tableGroup = new THREE.Group();

    // Table top with rounded edges
    const tableTopGeometry = new THREE.BoxGeometry(15, 0.4, 15);
    const tableMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 1.8,
      metalness: 0.1,
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.position.y = 0.5;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Ornate table legs
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.25, 3.2, 12);
    const legPositions: [number, number, number][] = [
      [-4.5, -1.1, -4.5],
      [4.5, -1.1, -4.5],
      [-4.5, -1.1, 4.5],
      [4.5, -1.1, 4.5],
    ];

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeometry, tableMaterial);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });

    tableGroup.position.y = -0.5;
    scene.add(tableGroup);

    // Improved Cake with better geometry and materials
    const cakeGroup = new THREE.Group();

    // Cake layers with smoother geometry
    const createCakeLayer = (
      radius: number,
      height: number,
      y: number,
      color: number
    ) => {
      const geometry = new THREE.CylinderGeometry(
        radius,
        radius * 1.05,
        height,
        32
      );
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.1,
      });
      const layer = new THREE.Mesh(geometry, material);
      layer.position.y = y;
      layer.castShadow = true;
      return layer;
    };

    // Bottom layer
    const bottomLayer = createCakeLayer(2.2, 1.5, 0.75, 0xfff8dc);
    cakeGroup.add(bottomLayer);

    // Middle layer
    const middleLayer = createCakeLayer(1.7, 1.2, 2.1, 0xfff5ee);
    cakeGroup.add(middleLayer);

    // Top layer
    const topLayer = createCakeLayer(1.2, 0.9, 3.15, 0xfff0f5);
    cakeGroup.add(topLayer);

    // Improved frosting with wave effect
    const createFrosting = (radius: number, y: number) => {
      const frostingGeometry = new THREE.TorusGeometry(radius, 0.15, 16, 32);
      const frostingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffb6c1,
        roughness: 0.2,
        metalness: 0.3,
      });
      const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial);
      frosting.position.y = y;
      frosting.rotation.x = Math.PI / 2;
      frosting.castShadow = true;
      return frosting;
    };

    cakeGroup.add(createFrosting(2.25, 1.5));
    cakeGroup.add(createFrosting(1.75, 2.7));
    cakeGroup.add(createFrosting(1.25, 3.6));

    // Enhanced Strawberry function
    const createStrawberry = (x: number, y: number, z: number, scale = 1) => {
      const group = new THREE.Group();

      // Strawberry body
      const berryGeometry = new THREE.SphereGeometry(0.15 * scale, 16, 16);
      const berryMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        roughness: 0.4,
      });
      const berry = new THREE.Mesh(berryGeometry, berryMaterial);
      berry.scale.set(1, 1.3, 1);
      berry.castShadow = true;
      group.add(berry);

      // Seeds
      const seedGeometry = new THREE.SphereGeometry(0.01 * scale, 6, 6);
      const seedMaterial = new THREE.MeshStandardMaterial({ color: 0xffeb3b });

      for (let i = 0; i < 12; i++) {
        const seed = new THREE.Mesh(seedGeometry, seedMaterial);
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.12 * scale;
        seed.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          Math.sin(angle) * radius
        );
        group.add(seed);
      }

      // Leaf
      const leafGeometry = new THREE.ConeGeometry(0.08 * scale, 0.1 * scale, 6);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x32cd32,
        roughness: 0.7,
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.y = 0.18 * scale;
      leaf.rotation.x = Math.PI;
      group.add(leaf);

      group.position.set(x, y, z);
      return group;
    };

    // Add strawberries to each cake layer
    // Helper function to generate circular strawberry positions
    function generateCirclePositions(
      count: number,
      radius: number,
      height: number
    ): [number, number, number][] {
      const positions: [number, number, number][] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const jitter = () => (Math.random() - 0.5) * 0.2; // small random offset
        const x = Math.cos(angle) * (radius + jitter());
        const z = Math.sin(angle) * (radius + jitter());
        positions.push([x, height, z]);
      }
      return positions;
    }

    // --- Bottom layer strawberries (larger) ---
    const bottomStrawberryPositions = generateCirclePositions(20, 1.9, 1.5);
    bottomStrawberryPositions.forEach(([x, y, z]) => {
      cakeGroup.add(createStrawberry(x, y, z, 1.2));
    });

    // --- Middle layer strawberries (medium) ---
    const middleStrawberryPositions = generateCirclePositions(15, 1.5, 2.7);
    middleStrawberryPositions.forEach(([x, y, z]) => {
      cakeGroup.add(createStrawberry(x, y, z, 1.0));
    });

    // --- Top layer strawberries (smaller) ---

    const topStrawberryPositions = generateCirclePositions(8, 1, 3.6);
    topStrawberryPositions.forEach(([x, y, z]) => {
      cakeGroup.add(createStrawberry(x, y, z, 0.8));
    });

    // Decorative sprinkles
    // const sprinkleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    // const sprinkleMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xff69b4,
    //   roughness: 0.3,
    // });

    // for (let i = 0; i < 50; i++) {
    //   const angle = Math.random() * Math.PI * 2;
    //   const radius = 1.5 + Math.random() * 0.7;
    //   const height = 1.5 + Math.random() * 2.2;

    //   const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
    //   sprinkle.position.set(
    //     Math.cos(angle) * radius,
    //     height,
    //     Math.sin(angle) * radius
    //   );
    //   sprinkle.castShadow = true;
    //   cakeGroup.add(sprinkle);
    // }

    scene.add(cakeGroup);

    // Enhanced Birthday Text on Cake
   const createText = (text: string, y: number, size: number) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 1024;
      canvas.height = 256;
      
      // Gradient text
      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#ff6b9d");
      gradient.addColorStop(0.5, "#ff8eb4");
      gradient.addColorStop(1, "#ff6b9d");
      
      context.fillStyle = gradient;
      context.font = `bold ${size}px 'Comic Sans MS', cursive`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const textGeometry = new THREE.PlaneGeometry(3, 1.1);
      const textMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.2,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, y, 2.3);
      textMesh.castShadow = true;
      return textMesh;
    };
 scene.add(createText(birthdayName, 2.3, 80));
    scene.add(createText("Happy birthday", 1.0, 150));

    // Enhanced Candles with better flames
    const candles: THREE.Group[] = [];
    const candlePositions: [number, number, number][] = [
      [0.3, 3.5, 0.3],
      [-0.3, 3.5, 0.3],
      [0.3, 3.5, -0.3],
      [-0.3, 3.5, -0.3],
    ];

    candlePositions.forEach(([x, y, z]) => {
      const candleGroup = new THREE.Group();

      // Candle
      const candleGeometry = new THREE.CylinderGeometry(0.06, 0.07, 0.8, 16);
      const candleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.position.y = 0.4;
      candle.castShadow = true;
      candleGroup.add(candle);

      // Flame with animation
      const flameGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xffa500,
        transparent: true,
        opacity: 0.9,
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.scale.set(0.7, 1.3, 0.7);
      flame.position.y = 0.9;
      candleGroup.add(flame);

      // Glow
      const glowGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.y = 0.9;
      candleGroup.add(glow);

      // Point light
      const candleLight = new THREE.PointLight(0xffa500, 1, 2);
      candleLight.position.set(0, 0.9, 0);
      candleGroup.add(candleLight);

      candleGroup.position.set(x, y, z);
      scene.add(candleGroup);
      candles.push(candleGroup);
    });

    // Improved Photo Frames with better placement
    const photoFrames: THREE.Group[] = [];

    if (photos.length > 0) {
      const numPhotos = Math.min(photos.length, 8);
      const radius = 6;

      for (let i = 0; i < numPhotos; i++) {
        const angle = (i / numPhotos) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const frameGroup = new THREE.Group();

        // Frame dimensions
        const frameWidth = 1.6;
        const frameHeight = 2.0;
        const frameDepth = 0.08;

        // Main frame
        const frameGeometry = new THREE.BoxGeometry(
          frameWidth,
          frameHeight,
          frameDepth
        );
        const frameMaterial = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          roughness: 0.4,
          metalness: 0.9,
        });

        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.castShadow = true;
        frame.receiveShadow = true;
        frameGroup.add(frame);

        // Photo
        const loader = new THREE.TextureLoader();
        loader.load(photos[i], (texture) => {
          // Photo border
          const borderGeometry = new THREE.PlaneGeometry(1.5, 1.9);
          const borderMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
          });
          const border = new THREE.Mesh(borderGeometry, borderMaterial);
          border.position.z = frameDepth / 2 + 0.001;
          frameGroup.add(border);

          // Actual photo
          const photoGeometry = new THREE.PlaneGeometry(1.4, 1.8);
          const photoMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.6,
          });

          const photo = new THREE.Mesh(photoGeometry, photoMaterial);
          photo.position.z = frameDepth / 2 + 0.002;
          frameGroup.add(photo);
        });

        // CORRECTED STAND - Center of photo, angled backward
        const standGroup = new THREE.Group();

        // Main stand leg
        const standGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.5, 12);
        const standMaterial = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          roughness: 0.5,
          metalness: 0.8,
        });

        const stand = new THREE.Mesh(standGeometry, standMaterial);
        // Position at center bottom (y = -frameHeight/2) and angled backward
        stand.position.set(0, -frameHeight / 2, 0);
        stand.rotation.x = -Math.PI / 3; // Angle backward 60 degrees

        // Cross support for stability
        const supportGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 12);
        const support = new THREE.Mesh(supportGeometry, standMaterial);
        support.position.set(0, -frameHeight / 2 + 0.3, -0.2);
        support.rotation.z = Math.PI / 2;

        standGroup.add(stand);
        standGroup.add(support);
        frameGroup.add(standGroup);

        // Position the entire frame group
        frameGroup.position.set(x, 1.0, z);
        frameGroup.lookAt(0, 1.0, 0);
        frameGroup.rotation.y += Math.PI; // Face inward

        scene.add(frameGroup);
        photoFrames.push(frameGroup);
      }
    }

    // Enhanced Particles with different colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 30;

      // Random colors
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.9, 0.8, 0.7);
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Function to create balloons with text
    const createBalloonWithText = (
      x: number,
      y: number,
      z: number,
      color: number,
      text: string
    ) => {
      const balloonGroup = new THREE.Group();

      // Balloon
      const balloonGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const balloonMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.1,
      });
      const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
      balloon.scale.set(1, 1.2, 1);
      balloon.castShadow = true;
      balloonGroup.add(balloon);

      // String
      const stringGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, -3, 0),
      ]);
      const stringMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
      const string = new THREE.Line(stringGeometry, stringMaterial);
      balloonGroup.add(string);

      // Create text for balloon
      const textCanvas = document.createElement("canvas");
      const textContext = textCanvas.getContext("2d")!;
      textCanvas.width = 256;
      textCanvas.height = 128;

      textContext.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      textContext.font = "bold 24px 'Comic Sans MS', cursive";
      textContext.textAlign = "center";
      textContext.textBaseline = "middle";
      textContext.strokeStyle = "#ffffff";
      textContext.lineWidth = 3;
      textContext.strokeText(text, textCanvas.width / 2, textCanvas.height / 2);
      textContext.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

      const textTexture = new THREE.CanvasTexture(textCanvas);
      const textGeometry = new THREE.PlaneGeometry(0.8, 0.4);
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 0, 0.52);
      balloonGroup.add(textMesh);

      // Add a second text on the opposite side
      const textMesh2 = new THREE.Mesh(textGeometry, textMaterial);
      textMesh2.position.set(0, 0, -0.52);
      textMesh2.rotation.y = Math.PI;
      balloonGroup.add(textMesh2);

      balloonGroup.position.set(x, y, z);
      return balloonGroup;
    };

    // Floating balloons with "Happy Birthday" text
    const balloons: THREE.Group[] = [];
    const balloonColors = [
      0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3, 0x54a0ff,
      0x5f27cd,
    ];
    const balloonTexts = [
      "H",
      "A",
      "P",
      "P",
      "Y",
      "B",
      "I",
      "R",
      "T",
      "H",
      "D",
      "A",
      "Y",
    ];

    for (let i = 0; i < 12; i++) {
      const color = balloonColors[i % balloonColors.length];
      const text = balloonTexts[i % balloonTexts.length];

      const balloon = createBalloonWithText(
        (Math.random() - 0.5) * 25,
        Math.random() * 8 + 4,
        (Math.random() - 0.5) * 25,
        color,
        text
      );

      scene.add(balloon);
      balloons.push(balloon);
    }

    // Add one special balloon with full "Happy Birthday" text
    const specialBalloon = createBalloonWithText(
      0,
      12,
      -8,
      0xff6b9d,
      birthdayName.split(" ")[0] // Use first word to fit on balloon
    );
    scene.add(specialBalloon);
    balloons.push(specialBalloon);

    // Create Wall Decorations
    const createWallText = (
      text: string,
      position: [number, number, number],
      size: [number, number],
      fontSize: number
    ) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 1024;
      canvas.height = 256;

      // Gradient background for text
      const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#ff6b9d");
      gradient.addColorStop(0.3, "#ff8eb4");
      gradient.addColorStop(0.7, "#ff6b9d");
      gradient.addColorStop(1, "#ff8eb4");

      context.fillStyle = gradient;
      context.font = `bold ${fontSize}px 'Comic Sans MS', cursive`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowColor = "rgba(0, 0, 0, 0.3)";
      context.shadowBlur = 10;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const textGeometry = new THREE.PlaneGeometry(size[0], size[1]);
      const textMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.3,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(...position);
      return textMesh;
    };

    // Add "Happy Birthday Mg Mg" text to the back wall
    const wallText = createWallText(
      "Happy Birthday Yadanar Oo!",
      [0, 10, -19.9],
      [15, 3],
      80
    );
    scene.add(wallText);

    // Add decorative balloons attached to the wall
    const wallBalloons: THREE.Group[] = [];
    const wallBalloonPositions: [number, number, number][] = [
      [-12, 8, -19.9],
      [-8, 12, -19.9],
      [-4, 7, -19.9],
      [4, 11, -19.9],
      [8, 6, -19.9],
      [12, 9, -19.9],
    ];

    wallBalloonPositions.forEach(([x, y, z], index) => {
      const color = balloonColors[index % balloonColors.length];
      const balloon = createBalloonWithText(x, y, z, color, "🎉");
      scene.add(balloon);
      wallBalloons.push(balloon);
    });

    // Add streamers or banners on the walls
    const createStreamer = (
      start: [number, number, number],
      end: [number, number, number],
      color: number
    ) => {
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        linewidth: 3,
      });
      const streamer = new THREE.Line(geometry, material);
      return streamer;
    };
    //
    // Create Wish Envelope
    const createEnvelope = () => {
      const envelopeGroup = new THREE.Group();

      // Envelope base (rectangle)
      const baseGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.8);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b9d,
        roughness: 0.3,
        metalness: 0.2,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.castShadow = true;
      base.receiveShadow = true;
      envelopeGroup.add(base);

      // Envelope flap (triangle)
      const flapGeometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -0.6, 0, -0.4, 0.6, 0, -0.4, 0, 0, 0.4,
      ]);
      flapGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      flapGeometry.computeVertexNormals();

      const flapMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8eb4,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });
      const flap = new THREE.Mesh(flapGeometry, flapMaterial);
      flap.position.y = 0.03;
      flap.rotation.x = Math.PI;
      flap.castShadow = true;
      envelopeGroup.add(flap);

      // Heart on envelope
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0, 0);
      heartShape.bezierCurveTo(0.2, 0.2, 0.4, 0.1, 0, 0.4);
      heartShape.bezierCurveTo(-0.4, 0.1, -0.2, 0.2, 0, 0);

      const heartGeometry = new THREE.ShapeGeometry(heartShape);
      const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.5,
      });
      const heart = new THREE.Mesh(heartGeometry, heartMaterial);
      heart.scale.set(0.3, 0.3, 0.3);
      heart.position.set(0, 0.1, 0);
      heart.rotation.x = -Math.PI / 2;
      envelopeGroup.add(heart);

      // Add some glow effect
      const envelopeLight = new THREE.PointLight(0xff6b9d, 0.5, 2);
      envelopeLight.position.set(0, 0.5, 0);
      envelopeGroup.add(envelopeLight);

      return envelopeGroup;
    };

    // Add envelope to the table
    const envelope = createEnvelope();
    envelope.position.set(3,3,3);
    envelope.rotation.y = Math.PI / 3;
    scene.add(envelope);

    // Confetti System
    const confettiParticles: THREE.Mesh[] = [];
    const confettiColors = [
      0xff6b6b, 0x4ecdc4, 0xfeca57, 0xff9ff3, 0x54a0ff, 0x5f27cd, 0x00d2d3,
      0xff9ff3,
    ];

    const createConfetti = () => {
      const confettiGroup = new THREE.Group();

      for (let i = 0; i < 200; i++) {
        const size = Math.random() * 0.1 + 0.05;
        const geometry = new THREE.PlaneGeometry(size, size * 0.3);
        const material = new THREE.MeshStandardMaterial({
          color:
            confettiColors[Math.floor(Math.random() * confettiColors.length)],
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.2,
        });

        const confetti = new THREE.Mesh(geometry, material);

        // Random starting position above the scene
        confetti.position.set(
          (Math.random() - 0.5) * 20,
          15 + Math.random() * 10,
          (Math.random() - 0.5) * 20
        );

        // Random rotation
        confetti.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        // Store velocity and rotation speed
        (confetti as any).velocity = {
          x: (Math.random() - 0.5) * 0.02,
          y: -0.05 - Math.random() * 0.05,
          z: (Math.random() - 0.5) * 0.02,
        };

        (confetti as any).rotationSpeed = {
          x: (Math.random() - 0.5) * 0.05,
          y: (Math.random() - 0.5) * 0.05,
          z: (Math.random() - 0.5) * 0.05,
        };

        confettiGroup.add(confetti);
        confettiParticles.push(confetti);
      }

      return confettiGroup;
    };

    const confettiSystem = createConfetti();
    scene.add(confettiSystem);

    let confettiActive = false;
    let confettiStartTime = 0;

    // Function to start confetti
    const startConfetti = () => {
      confettiActive = true;
      confettiStartTime = Date.now();

      // Reset confetti positions
      confettiParticles.forEach((confetti) => {
        confetti.position.set(
          (Math.random() - 0.5) * 20,
          15 + Math.random() * 10,
          (Math.random() - 0.5) * 20
        );

        (confetti as any).velocity = {
          x: (Math.random() - 0.5) * 0.02,
          y: -0.05 - Math.random() * 0.05,
          z: (Math.random() - 0.5) * 0.02,
        };
      });
    };

    // Start confetti automatically after 2 seconds
    setTimeout(startConfetti, 2000);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let autoRotation = true;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      autoRotation = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      scene.rotation.y += deltaX * 0.005;
      scene.rotation.x = Math.max(
        -Math.PI / 6,
        Math.min(Math.PI / 6, scene.rotation.x + deltaY * 0.005)
      );

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      setTimeout(() => (autoRotation = true), 3000);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(
        8,
        Math.min(25, camera.position.z + e.deltaY * 0.01)
      );
    };
    // Raycaster for envelope interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersection with envelope
      const intersects = raycaster.intersectObject(envelope, true);

      if (intersects.length > 0) {
        setWishText(`မွေးနေ့ပျော်ပါစေ！ မင်းအတွက် ဆုသုံးခုတောင်းပေးမယ်။
၁။ မင်းရဲ့ Phone Battery ကိုယ့်ဟာကိုယ် ၁% ကနေ ၁၀၀% ပြန်တက်သွားပါစေ။ (ငါ့အတွက်လည်း ဒီလိုပါပဲနော် 😌)
၂. မင်းရဲ့ 'Who is this?' မေးခွန်းက ငါ့အမှတ်နံပါတ်အောက်မှာ အမြဲတမ်းပျောက်နေပါစေ။
၃. ငါ့ရဲ့ 'Good Morning' Message ကို နေ့တိုင်း မြင်ရပါစေ။
ဆုတွေကတော့ နည်းနည်းများသွားပြီမလား？ 😂 ပျော်ရွှင်ပါစေကွာ！`);
        setIsModalOpen(true);
        startConfetti();
      }
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    renderer.domElement.addEventListener("click", handleClick);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto rotation when not dragging
      if (autoRotation && !isDragging) {
        //  scene.rotation.y += 0.001;
      }

      // Animate flames
      candles.forEach((candle, index) => {
        const time = Date.now() * 0.002 + index;
        const flame = candle.children[1] as THREE.Mesh;
        const glow = candle.children[2] as THREE.Mesh;

        flame.scale.y = 1.3 + Math.sin(time * 3) * 0.2;
        flame.position.y = 0.9 + Math.sin(time * 2) * 0.05;
        glow.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
      });

      // Animate balloons
      balloons.forEach((balloon, index) => {
        const time = Date.now() * 0.001 + index;
        balloon.position.y += Math.sin(time + index) * 0.008;
        balloon.rotation.y += 0.005;
        balloon.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
      });

      // Animate wall balloons slightly
      // wallBalloons.forEach((balloon, index) => {
      //   const time = Date.now() * 0.001 + index;
      //   balloon.position.y += Math.sin(time + index) * 0.003;
      //   balloon.rotation.z = Math.sin(time * 0.8 + index) * 0.1;
      // });
      // Animate envelope (gentle floating)
      const envelopeTime = Date.now() * 0.001;
      envelope.position.y = 0.3 + Math.sin(envelopeTime) * 0.05;
      envelope.rotation.y = Math.PI / 6 + Math.sin(envelopeTime * 0.5) * 0.1;

      // Animate confetti
      if (confettiActive) {
        confettiParticles.forEach((confetti) => {
          // Update position
          confetti.position.x += (confetti as any).velocity.x;
          confetti.position.y += (confetti as any).velocity.y;
          confetti.position.z += (confetti as any).velocity.z;

          // Update rotation
          confetti.rotation.x += (confetti as any).rotationSpeed.x;
          confetti.rotation.y += (confetti as any).rotationSpeed.y;
          confetti.rotation.z += (confetti as any).rotationSpeed.z;

          // Add some air resistance
          (confetti as any).velocity.y += 0.001;

          // Reset if below floor
          if (confetti.position.y < -2) {
            confetti.position.y = 15 + Math.random() * 10;
            confetti.position.x = (Math.random() - 0.5) * 20;
            confetti.position.z = (Math.random() - 0.5) * 20;
            (confetti as any).velocity.y = -0.05 - Math.random() * 0.05;
          }
        });

        // Stop confetti after 5 seconds
        if (Date.now() - confettiStartTime > 5000) {
          confettiActive = false;
        }
      }

      // Animate particles
      particlesMesh.rotation.y += 0.001;

      // Gentle cake rotation
     // cakeGroup.rotation.y += 0.001;

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
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("click", handleClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [photos, birthdayName]);

  return (
    <>
      <div
        ref={mountRef}
        className="w-full h-screen cursor-grab active:cursor-grabbing bg-gradient-to-br from-pink-50 to-rose-100"
      />

      {/* Wish Modal */}
      {isModalOpen && (
        <div   onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <BirthdayMessage/>

        </div>
      )}
    </>
  );
};
