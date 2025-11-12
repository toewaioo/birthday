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
      430,
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffb6c1, 1.5, 20);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffd700, 1.2, 20);
    pointLight2.position.set(5, 5, -5);
    scene.add(pointLight2);

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

    scene.add(cakeGroup);
    //

    //
    // =============================================
    // CREATE GIFT BOX
    // =============================================
    // Add this function definition alongside your other create... functions
    const createGiftBox = (
      position: [number, number, number],
      boxColor: number,
      ribbonColor: number
    ) => {
      const giftGroup = new THREE.Group();

      const boxSize = 0.8;
      const ribbonWidth = 0.2; // Width of the ribbon straps

      // Box
      const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: boxColor,
        roughness: 0.6,
        metalness: 0.2,
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.castShadow = true;
      box.receiveShadow = true;
      giftGroup.add(box);

      // Ribbon Material
      const ribbonMaterial = new THREE.MeshStandardMaterial({
        color: ribbonColor,
        roughness: 0.4,
        metalness: 0.1,
      });

      // Ribbon - X axis (wraps around Y and Z)
      const ribbonXGeometry = new THREE.BoxGeometry(
        boxSize + 0.02,
        ribbonWidth,
        boxSize + 0.02
      );
      const ribbonX = new THREE.Mesh(ribbonXGeometry, ribbonMaterial);
      ribbonX.position.y = 0; // Centered on the box
      giftGroup.add(ribbonX);

      // Ribbon - Z axis (wraps around Y and X)
      const ribbonZGeometry = new THREE.BoxGeometry(
        ribbonWidth,
        boxSize + 0.02,
        boxSize + 0.02
      );
      const ribbonZ = new THREE.Mesh(ribbonZGeometry, ribbonMaterial);
      ribbonZ.position.y = 0; // Centered on the box
      giftGroup.add(ribbonZ);

      // --- Bow ---
      const bowGroup = new THREE.Group();

      // Bow Loop 1
      // Using a Torus segment (Math.PI) is a simple way to get a loop
      const loopGeometry = new THREE.TorusGeometry(0.1, 0.03, 16, 16, Math.PI);

      const loop1 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop1.position.set(-0.08, 0.05, 0);
      // Rotate it to stand up and angle out
      loop1.rotation.set(Math.PI / 2, 0, Math.PI / 4 + 0.2);
      bowGroup.add(loop1);

      // Bow Loop 2
      const loop2 = new THREE.Mesh(loopGeometry, ribbonMaterial);
      loop2.position.set(0.08, 0.05, 0);
      // Rotate it to stand up and angle out the other way
      loop2.rotation.set(Math.PI / 2, 0, -Math.PI / 4 - 0.2);
      bowGroup.add(loop2);

      // Bow Knot
      const knotGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const knot = new THREE.Mesh(knotGeometry, ribbonMaterial);
      knot.position.y = 0.03; // Slightly above the loops' center
      bowGroup.add(knot);

      // Position the bow on top of the box
      bowGroup.position.y = boxSize / 2;
      giftGroup.add(bowGroup);

      // --- End Bow ---

      // Set the final position of the entire gift
      giftGroup.position.set(...position);

      // Tilt the gift box slightly for a more natural look
      giftGroup.rotation.y = Math.random() * Math.PI;
      giftGroup.rotation.x = THREE.MathUtils.degToRad(Math.random() * 10 - 5);

      return giftGroup;
    };
    //
    // ... This is after 'scene.add(cakeGroup);' around line 398

    // =============================================
    // ADD GIFT BOXES
    // =============================================
    // Table top surface is at y = 0.2
    // Gift box (size 0.8) center should be at y = 0.2 + (0.8 / 2) = 0.6
    const giftBox1 = createGiftBox(
      [-2.5, 0.6, 3.0], // x, y, z position on table
      0xff6347, // Tomato red box
      0xffd700 // Gold ribbon
    );
    scene.add(giftBox1);

    // Add a second, smaller gift
    // Scaled gift box (size 0.8 * 0.8 = 0.64)
    // Center should be at y = 0.2 + (0.64 / 2) = 0.2 + 0.32 = 0.52
    const giftBox2 = createGiftBox(
      [3.0, 0.52, -2.5], // x, y, z
      0x4682b4, // Steel blue box
      0xffffff // White ribbon
    );
    giftBox2.scale.set(0.8, 0.8, 0.8); // Make this one 80% of the size
    scene.add(giftBox2);

    // ... The rest of your code continues here (e.g., scene.add(createText(...)))
    // =============================================
    // CREATE PARTY HAT
    // =============================================
    const createPartyHat = (
      position: [number, number, number],
      color: number,
      stripeColor: number
    ) => {
      const hatGroup = new THREE.Group();

      // Hat Cone
      const hatGeometry = new THREE.ConeGeometry(0.5, 1.2, 32);
      const hatMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.1,
      });
      const hat = new THREE.Mesh(hatGeometry, hatMaterial);
      hat.position.y = 0.6; // Base of the cone is at y=0, move up
      hat.castShadow = true;
      hatGroup.add(hat);

      // Stripes
      const stripeMaterial = new THREE.MeshStandardMaterial({
        color: stripeColor,
        roughness: 0.3,
        metalness: 0.2,
      });
      const stripeCount = 5;
      for (let i = 0; i < stripeCount; i++) {
        const angle = (i / stripeCount) * Math.PI * 2;
        const stripeGeometry = new THREE.PlaneGeometry(0.15, 1.2);
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(Math.sin(angle) * 0.3, 0.6, Math.cos(angle) * 0.3);
        stripe.rotation.y = angle;
        stripe.rotation.z = Math.PI / 10; // Slight tilt
        hatGroup.add(stripe);
      }

      // Pom-pom on top
      const pompomGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const pompomMaterial = new THREE.MeshStandardMaterial({
        color: stripeColor, // Match stripe color or choose another
        roughness: 0.8,
        metalness: 0.05,
      });
      const pompom = new THREE.Mesh(pompomGeometry, pompomMaterial);
      pompom.position.y = 1.3; // On top of the cone
      pompom.castShadow = true;
      hatGroup.add(pompom);

      // Position the entire hat
      hatGroup.position.set(...position);
      hatGroup.rotation.y = Math.random() * Math.PI * 2; // Random rotation
      hatGroup.rotation.z = THREE.MathUtils.degToRad(Math.random() * 10 - 5); // Slight tilt

      return hatGroup;
    };
    // =============================================
    // ADD PARTY HATS
    // =============================================
    // Place a hat on the table near the cake
    const partyHat1 = createPartyHat(
      [4.5, 0.2, 1.0], // x, y, z (y=0.2 is table top + a small lift to sit on it)
      0xee82ee, // Violet hat
      0xffffff // White stripes
    );
    scene.add(partyHat1);

    const partyHat2 = createPartyHat(
      [-4.0, 0.2, -3.0], // Another hat
      0xadd8e6, // Light blue hat
      0xffa500 // Orange stripes
    );
    partyHat2.scale.set(0.9, 0.9, 0.9); // Slightly smaller
    scene.add(partyHat2);

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

    // Store candle states
    const candleStates = {
      lit: [true, true, true, true], // All candles start lit
      flames: [] as THREE.Mesh[],
      lights: [] as THREE.PointLight[],
      glows: [] as THREE.Mesh[],
    };

    candlePositions.forEach(([x, y, z], index) => {
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
      flame.userData = { index, isLit: true };
      candleGroup.add(flame);
      candleStates.flames[index] = flame;

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
      candleStates.glows[index] = glow;

      // Point light
      const candleLight = new THREE.PointLight(0xffa500, 1, 2);
      candleLight.position.set(0, 0.9, 0);
      candleGroup.add(candleLight);
      candleStates.lights[index] = candleLight;

      candleGroup.position.set(x, y, z);
      candleGroup.userData = { index, isLit: true };
      scene.add(candleGroup);
      candles.push(candleGroup);
    });

    // Improved Photo Frames with better placement
    const photoFrames: THREE.Group[] = [];

    if (photos.length > 0) {
      const numPhotos = Math.min(photos.length, 8);
      const radius = 6;

      for (let i = 0; i < numPhotos; i++) {
        const angle = (i / numPhotos) * Math.PI * -1;
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
        loader.load(photos[i]!, (texture) => {
          // Photo border
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          texture.needsUpdate = true;
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
            roughness: 0.4,
            metalness: 0.0, // disable reflection if not needed
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
        frameGroup.rotation.y = 0; // Face inward
        const tiltAngle = THREE.MathUtils.degToRad(20); // 10° backward
        frameGroup.rotation.x = -tiltAngle;

        scene.add(frameGroup);
        photoFrames.push(frameGroup);
      }
    }

    // =============================================
    // MEMORY WALL GALLERY WITH BEAUTIFUL DECORATIONS
    // =============================================

    // Function to create decorative photo frames for the wall
    // const createWallMemoryFrame = (
    //   photoUrl: string,
    //   position: [number, number, number],
    //   rotation: [number, number, number],
    //   frameColor: number = 0xd4af37,
    //   frameStyle: string = "classic"
    // ) => {
    //   const frameGroup = new THREE.Group();

    //   // Different frame styles
    //   let frameGeometry: THREE.BufferGeometry;
    //   let frameWidth: number, frameHeight: number;

    //   switch (frameStyle) {
    //     case "ornate":
    //       frameWidth = 2.5;
    //       frameHeight = 3.0;
    //       frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.1);
    //       break;
    //     case "modern":
    //       frameWidth = 2.2;
    //       frameHeight = 2.7;
    //       frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.05);
    //       break;
    //     case "vintage":
    //       frameWidth = 2.8;
    //       frameHeight = 3.3;
    //       frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.15);
    //       break;
    //     default: // classic
    //       frameWidth = 2.4;
    //       frameHeight = 2.9;
    //       frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, 0.08);
    //   }

    //   // Frame material with different colors based on style
    //   const frameMaterial = new THREE.MeshStandardMaterial({
    //     color: frameColor,
    //     roughness: frameStyle === "vintage" ? 0.8 : 0.4,
    //     metalness: frameStyle === "modern" ? 0.9 : 0.7,
    //   });

    //   const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    //   frame.castShadow = true;
    //   frame.receiveShadow = true;
    //   frameGroup.add(frame);

    //   // Load and add photo
    //   const loader = new THREE.TextureLoader();
    //   loader.load(photoUrl, (texture) => {
    //     // Photo matte/border
    //     const matteWidth = frameWidth - 0.2;
    //     const matteHeight = frameHeight - 0.2;
    //     const matteGeometry = new THREE.PlaneGeometry(matteWidth, matteHeight);
    //     const matteMaterial = new THREE.MeshStandardMaterial({
    //       color: frameStyle === "vintage" ? 0x2a2a2a : 0x1a1a1a,
    //       roughness: 0.9,
    //     });
    //     const matte = new THREE.Mesh(matteGeometry, matteMaterial);
    //     matte.position.z = 0.06;
    //     frameGroup.add(matte);

    //     // Actual photo
    //     const photoWidth = frameWidth - 0.4;
    //     const photoHeight = frameHeight - 0.4;
    //     const photoGeometry = new THREE.PlaneGeometry(photoWidth, photoHeight);
    //     const photoMaterial = new THREE.MeshStandardMaterial({
    //       map: texture,
    //       roughness: 0.5,
    //     });

    //     const photo = new THREE.Mesh(photoGeometry, photoMaterial);
    //     photo.position.z = 0.07;
    //     frameGroup.add(photo);
    //   });

    //   // Add decorative elements based on frame style
    //   if (frameStyle === "ornate") {
    //     // Corner decorations for ornate frames
    //     const cornerGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    //     const cornerMaterial = new THREE.MeshStandardMaterial({
    //       color: 0xffd700,
    //       roughness: 0.3,
    //       metalness: 0.9,
    //     });

    //     const corners = [
    //       [frameWidth / 2 - 0.1, frameHeight / 2 - 0.1, 0.06],
    //       [-frameWidth / 2 + 0.1, frameHeight / 2 - 0.1, 0.06],
    //       [frameWidth / 2 - 0.1, -frameHeight / 2 + 0.1, 0.06],
    //       [-frameWidth / 2 + 0.1, -frameHeight / 2 + 0.1, 0.06],
    //     ];

    //     corners.forEach(([x, y, z]) => {
    //       const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
    //       corner.position.set(x, y, z);
    //       frameGroup.add(corner);
    //     });
    //   }

    //   if (frameStyle === "vintage") {
    //     // Add a subtle vintage texture overlay
    //     const vintageCanvas = document.createElement("canvas");
    //     vintageCanvas.width = 256;
    //     vintageCanvas.height = 256;
    //     const vintageCtx = vintageCanvas.getContext("2d")!;

    //     vintageCtx.fillStyle = "rgba(200, 180, 120, 0.1)";
    //     for (let i = 0; i < 50; i++) {
    //       vintageCtx.beginPath();
    //       vintageCtx.arc(
    //         Math.random() * 256,
    //         Math.random() * 256,
    //         Math.random() * 3,
    //         0,
    //         Math.PI * 2
    //       );
    //       vintageCtx.fill();
    //     }

    //     const vintageTexture = new THREE.CanvasTexture(vintageCanvas);
    //     const vintageGeometry = new THREE.PlaneGeometry(frameWidth - 0.3, frameHeight - 0.3);
    //     const vintageMaterial = new THREE.MeshBasicMaterial({
    //       map: vintageTexture,
    //       transparent: true,
    //       opacity: 0.3,
    //     });
    //     const vintageOverlay = new THREE.Mesh(vintageGeometry, vintageMaterial);
    //     vintageOverlay.position.z = 0.08;
    //     frameGroup.add(vintageOverlay);
    //   }

    //   frameGroup.position.set(...position);
    //   frameGroup.rotation.set(...rotation);

    //   return frameGroup;
    // };

    // Create wall decorations
    // const createWallDecoration = (type: string, position: [number, number, number], rotation: [number, number, number]) => {
    //   const decorationGroup = new THREE.Group();

    //   switch (type) {
    //     case "flower":
    //       // Simple flower decoration
    //       const flowerGeometry = new THREE.CircleGeometry(0.3, 8);
    //       const flowerMaterial = new THREE.MeshStandardMaterial({
    //         color: 0xff6b9d,
    //         roughness: 0.4,
    //       });
    //       const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
    //       decorationGroup.add(flower);

    //       // Flower center
    //       const centerGeometry = new THREE.CircleGeometry(0.1, 6);
    //       const centerMaterial = new THREE.MeshStandardMaterial({
    //         color: 0xffd700,
    //       });
    //       const center = new THREE.Mesh(centerGeometry, centerMaterial);
    //       center.position.z = 0.01;
    //       decorationGroup.add(center);
    //       break;

    //     case "heart":
    //       // Heart shape
    //       const heartShape = new THREE.Shape();
    //       heartShape.moveTo(0, 0.2);
    //       heartShape.bezierCurveTo(0.3, 0.3, 0.5, 0, 0, -0.5);
    //       heartShape.bezierCurveTo(-0.5, 0, -0.3, 0.3, 0, 0.2);

    //       const heartGeometry = new THREE.ShapeGeometry(heartShape);
    //       const heartMaterial = new THREE.MeshStandardMaterial({
    //         color: 0xff4444,
    //         roughness: 0.3,
    //       });
    //       const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    //       heart.scale.set(0.4, 0.4, 0.4);
    //       decorationGroup.add(heart);
    //       break;

    //     case "star":
    //       // Star decoration
    //       const starGeometry = new THREE.SphereGeometry(0.2, 6, 6);
    //       const starMaterial = new THREE.MeshStandardMaterial({
    //         color: 0xffd700,
    //         roughness: 0.2,
    //         metalness: 0.8,
    //       });
    //       const star = new THREE.Mesh(starGeometry, starMaterial);
    //       decorationGroup.add(star);
    //       break;
    //   }

    //   decorationGroup.position.set(...position);
    //   decorationGroup.rotation.set(...rotation);
    //   return decorationGroup;
    // };

    // // Create memory wall gallery on back wall
    // if (photos.length > 0) {
    //   const wallFrames: THREE.Group[] = [];
    //   const frameStyles = ["classic", "ornate", "modern", "vintage"];
    //   const frameColors = [0xd4af37, 0x8B4513, 0xCD7F32, 0xB8860B, 0xDAA520];

    //   // Position memory frames on back wall in a grid
    //   const gridRows = 3;
    //   const gridCols = 4;
    //   const startX = -15;
    //   const startY = 2;
    //   const spacingX = 7;
    //   const spacingY = 4;

    //   let photoIndex = 0;

    //   for (let row = 0; row < gridRows; row++) {
    //     for (let col = 0; col < gridCols; col++) {
    //       if (photoIndex >= photos.length) break;

    //       const x = startX + col * spacingX;
    //       const y = startY + row * spacingY;
    //       const z = -19.9;

    //       const frameStyle = frameStyles[Math.floor(Math.random() * frameStyles.length)];
    //       const frameColor = frameColors[Math.floor(Math.random() * frameColors.length)];

    //       const memoryFrame = createWallMemoryFrame(
    //         photos[photoIndex],
    //         [x, y, z],
    //         [0, 0, 0],
    //         frameColor,
    //         frameStyle
    //       );

    //       scene.add(memoryFrame);
    //       wallFrames.push(memoryFrame);
    //       photoIndex++;
    //     }
    //   }

    //   // Add decorative elements around the memory wall
    //   const decorations = [
    //     { type: "flower", position: [-17, 13, -19.8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    //     { type: "heart", position: [17, 13, -19.8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    //     { type: "star", position: [-17, 1, -19.8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    //     { type: "star", position: [17, 1, -19.8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    //     { type: "flower", position: [0, 14, -19.8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    //   ];

    //   decorations.forEach(decoration => {
    //     const decor = createWallDecoration(decoration.type, decoration.position, decoration.rotation);
    //     scene.add(decor);
    //   });

    //   // Add decorative string lights between frames
    //   const createStringLight = (start: [number, number, number], end: [number, number, number]) => {
    //     const lightGroup = new THREE.Group();

    //     // String
    //     const stringGeometry = new THREE.BufferGeometry().setFromPoints([
    //       new THREE.Vector3(...start),
    //       new THREE.Vector3(...end),
    //     ]);
    //     const stringMaterial = new THREE.LineBasicMaterial({
    //       color: 0xffd700,
    //       transparent: true,
    //       opacity: 0.6
    //     });
    //     const string = new THREE.Line(stringGeometry, stringMaterial);
    //     lightGroup.add(string);

    //     // Light bulbs along the string
    //     const segments = 5;
    //     for (let i = 0; i <= segments; i++) {
    //       const t = i / segments;
    //       const bulbX = start[0] + (end[0] - start[0]) * t;
    //       const bulbY = start[1] + (end[1] - start[1]) * t;
    //       const bulbZ = start[2] + 0.1;

    //       const bulbGeometry = new THREE.SphereGeometry(0.08, 8, 6);
    //       const bulbMaterial = new THREE.MeshBasicMaterial({
    //         color: 0xffff00,
    //         transparent: true,
    //         opacity: 0.8,
    //       });
    //       const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    //       bulb.position.set(bulbX, bulbY, bulbZ);
    //       lightGroup.add(bulb);

    //       // Add point light for glow effect
    //       const bulbLight = new THREE.PointLight(0xffff00, 0.3, 2);
    //       bulbLight.position.set(bulbX, bulbY, bulbZ);
    //       lightGroup.add(bulbLight);
    //     }

    //     return lightGroup;
    //   };

    //   // Add string lights around the memory wall
    //   const stringLights = [
    //     { start: [-18, 13.5, -19.8] as [number, number, number], end: [18, 13.5, -19.8] as [number, number, number] },
    //     { start: [-18, 1.5, -19.8] as [number, number, number], end: [18, 1.5, -19.8] as [number, number, number] },
    //     { start: [-18, 13.5, -19.8] as [number, number, number], end: [-18, 1.5, -19.8] as [number, number, number] },
    //     { start: [18, 13.5, -19.8] as [number, number, number], end: [18, 1.5, -19.8] as [number, number, number] },
    //   ];

    //   stringLights.forEach(light => {
    //     const stringLight = createStringLight(light.start, light.end);
    //     scene.add(stringLight);
    //   });
    // }

    // Enhanced Particles with different colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
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
      "HAPPY BIRTHDAY",
      "HAPPY BIRTHDAY",
      "HAPPY BIRTHDAY",
      "HAPPY BIRTHDAY",
      "HAPPY BIRTHDAY",
      "HAPPY BIRTHDAY",
    ];

    for (let i = 0; i < 12; i++) {
      const color = balloonColors[i % balloonColors.length];
      const text = balloonTexts[i % balloonTexts.length];

      const balloon = createBalloonWithText(
        (Math.random() - 0.5) * 25,
        Math.random() * 8 + 4,
        (Math.random() - 0.5) * 25,
        color!,
        text!
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
      birthdayName.split(" ")[0]! // Use first word to fit on balloon
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
      const balloon = createBalloonWithText(x, y, z, color!, "🎉");
      scene.add(balloon);
      wallBalloons.push(balloon);
    });

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
    envelope.position.set(3, 0.5, 3);
    envelope.rotation.y = Math.PI / 3;
    scene.add(envelope);

    // Confetti System - Improved with cleanup
    const confettiParticles: THREE.Mesh[] = [];
    const confettiColors = [
      0xff6b6b, 0x4ecdc4, 0xfeca57, 0xff9ff3, 0x54a0ff, 0x5f27cd, 0x00d2d3,
      0xff9ff3,
    ];

    const createConfetti = () => {
      const confettiGroup = new THREE.Group();

      for (let i = 0; i < 200; i++) {
        const size = Math.random() * 0.3 + 0.09;
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
          x: (Math.random() - 0.5) * 0.2,
          y: -0.05 - Math.random() * 0.5,
          z: (Math.random() - 0.5) * 0.2,
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

    // Function to remove confetti after animation
    const cleanupConfetti = () => {
      confettiParticles.forEach((confetti) => {
        confetti.visible = false;
      });
      confettiActive = false;
    };
    const reBuildConfetti = () => {
      const confettiSystem = createConfetti();
      scene.add(confettiSystem);

      let confettiActive = false;
      let confettiStartTime = 0;
    };

    // Function to blow out candle
    const blowOutCandle = (candleIndex: number) => {
      if (!candleStates.lit[candleIndex]) return; // Already blown out

      // Mark candle as blown out
      candleStates.lit[candleIndex] = false;

      // Hide flame and glow
      candleStates.flames[candleIndex]!.visible = false;
      candleStates.glows[candleIndex]!.visible = false;

      // Turn off light
      candleStates.lights[candleIndex]!.intensity = 0;

      // Start confetti when candle is blown out
      startConfetti();
    };

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

    // Touch events for mobile
    let touchStartDistance = 0;
    let initialTouchPosition = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      autoRotation = false;

      if (e.touches.length === 1) {
        // Single touch for rotation
        const touch = e.touches[0]!;
        initialTouchPosition = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        // Two touches for pinch-to-zoom
        const touch1 = e.touches[0]!;
        const touch2 = e.touches[1]!;
        touchStartDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        // Single touch rotation
        const touch = e.touches[0]!;
        const deltaX = touch.clientX - initialTouchPosition.x;
        const deltaY = touch.clientY - initialTouchPosition.y;

        scene.rotation.y += deltaX * 0.005;
        scene.rotation.x = Math.max(
          -Math.PI / 6,
          Math.min(Math.PI / 6, scene.rotation.x + deltaY * 0.005)
        );

        initialTouchPosition = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2) {
        // Pinch-to-zoom
        const touch1 = e.touches[0]!;
        const touch2 = e.touches[1]!;
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        const zoomDelta = (currentDistance - touchStartDistance) * 0.01;
        camera.position.z = Math.max(
          8,
          Math.min(25, camera.position.z - zoomDelta)
        );

        touchStartDistance = currentDistance;
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => (autoRotation = true), 3000);
    };

    // Raycaster for interactions
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
      const envelopeIntersects = raycaster.intersectObject(envelope, true);
      if (envelopeIntersects.length > 0) {
        setWishText(`မွေးနေ့ပျော်ပါစေ！ မင်းအတွက် ဆုသုံးခုတောင်းပေးမယ်။
၁။ မင်းရဲ့ Phone Battery ကိုယ့်ဟာကိုယ် ၁% ကနေ ၁၀၀% ပြန်တက်သွားပါစေ။ (ငါ့အတွက်လည်း ဒီလိုပါပဲနော် 😌)
၂. မင်းရဲ့ 'Who is this?' မေးခွန်းက ငါ့အမှတ်နံပါတ်အောက်မှာ အမြဲတမ်းပျောက်နေပါစေ။
၃. ငါ့ရဲ့ 'Good Morning' Message ကို နေ့တိုင်း မြင်ရပါစေ။
ဆုတွေကတော့ နည်းနည်းများသွားပြီမလား？ 😂 ပျော်ရွှင်ပါစေကွာ！`);
        setIsModalOpen(true);

        return;
      }

      // Check for intersection with candles
      candles.forEach((candle, index) => {
        const candleIntersects = raycaster.intersectObject(candle, true);
        if (candleIntersects.length > 0 && candleStates.lit[index]) {
          blowOutCandle(index);
        }
      });
      reBuildConfetti();
      startConfetti();
    };

    // Touch event for mobile click
    const handleTouchEndClick = (event: TouchEvent) => {
      if (event.touches.length > 0) return; // Only handle when all touches end

      const rect = renderer.domElement.getBoundingClientRect();
      const touch = event.changedTouches[0]!;
      mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check for intersection with envelope
      const envelopeIntersects = raycaster.intersectObject(envelope, true);
      if (envelopeIntersects.length > 0) {
        setWishText(`မွေးနေ့ပျော်ပါစေ！ မင်းအတွက် ဆုသုံးခုတောင်းပေးမယ်။
၁။ မင်းရဲ့ Phone Battery ကိုယ့်ဟာကိုယ် ၁% ကနေ ၁၀၀% ပြန်တက်သွားပါစေ။ (ငါ့အတွက်လည်း ဒီလိုပါပဲနော် 😌)
၂. မင်းရဲ့ 'Who is this?' မေးခွန်းက ငါ့အမှတ်နံပါတ်အောက်မှာ အမြဲတမ်းပျောက်နေပါစေ။
၃. ငါ့ရဲ့ 'Good Morning' Message ကို နေ့တိုင်း မြင်ရပါစေ။
ဆုတွေကတော့ နည်းနည်းများသွားပြီမလား？ 😂 ပျော်ရွှင်ပါစေကွာ！`);
        setIsModalOpen(true);

        return;
      }

      // Check for intersection with candles
      candles.forEach((candle, index) => {
        const candleIntersects = raycaster.intersectObject(candle, true);
        if (candleIntersects.length > 0 && candleStates.lit[index]) {
          blowOutCandle(index);
        }
      });
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    renderer.domElement.addEventListener("click", handleClick);

    // Mobile touch events
    renderer.domElement.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleTouchEnd);
    renderer.domElement.addEventListener("touchend", handleTouchEndClick);

    // Animation
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();

      // Auto rotation when not dragging
      // if (autoRotation && !isDragging) {
      //   scene.rotation.y += 0.001;
      // }

      // Animate flames for lit candles only
      candles.forEach((candle, index) => {
        if (candleStates.lit[index]) {
          const time = Date.now() * 0.002 + index;
          const flame = candleStates.flames[index]!;
          const glow = candleStates.glows[index]!;

          flame.scale.y = 1.3 + Math.sin(time * 3) * 0.2;
          flame.position.y = 0.9 + Math.sin(time * 2) * 0.05;
          glow.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
        }
      });

      // Animate balloons
      balloons.forEach((balloon, index) => {
        const time = Date.now() * 0.001 + index;
        balloon.position.y += Math.sin(time + index) * 0.008;
        balloon.rotation.y += 0.005;
        balloon.rotation.x = Math.sin(time * 0.5 + index) * 0.1;
      });

      // Animate envelope (gentle floating)
      const envelopeTime = Date.now() * 0.001;
      envelope.position.y = 0.5 + Math.sin(envelopeTime) * 0.05;
      envelope.rotation.y = Math.PI / 6 + Math.sin(envelopeTime * 0.5) * 0.1;

      // Animate confetti - FIXED: Properly update confetti particles
      if (confettiActive) {
        let allConfettiStopped = true;

        confettiParticles.forEach((confetti) => {
          // Update position
          confetti.position.x += (confetti as any).velocity.x;
          confetti.position.y += (confetti as any).velocity.y;
          confetti.position.z += (confetti as any).velocity.z;

          // Update rotation
          confetti.rotation.x += (confetti as any).rotationSpeed.x;
          confetti.rotation.y += (confetti as any).rotationSpeed.y;
          confetti.rotation.z += (confetti as any).rotationSpeed.z;

          // Add gravity
          (confetti as any).velocity.y -= 0.001;

          // Check if confetti is still moving
          if (confetti.position.y > -2) {
            allConfettiStopped = false;
          }

          // Reset if below floor
          if (confetti.position.y < -3) {
            confetti.position.y = -3;
            (confetti as any).velocity.y = 0;
            (confetti as any).velocity.x = 0;
            (confetti as any).velocity.z = 0;
          }
        });

        // Clean up confetti after all particles have settled
        if (Date.now() - confettiStartTime > 6000 && allConfettiStopped) {
          cleanupConfetti();
        }
      }

      // Animate particles
      particlesMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    startConfetti();

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

      // Remove touch events
      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);
      renderer.domElement.removeEventListener("touchend", handleTouchEndClick);

      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [photos, birthdayName]);

  return (
    <>
      <div
        ref={mountRef}
        className="w-full h-screen cursor-grab active:cursor-grabbing bg-gradient-to-br from-pink-50 to-rose-100 touch-none"
        style={{ touchAction: "none" }} // Important for mobile touch control
      />

      {/* Wish Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <BirthdayMessage />
        </div>
      )}
    </>
  );
};
