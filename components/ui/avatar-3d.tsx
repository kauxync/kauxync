"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export function Avatar3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isWaving, setIsWaving] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);

  // References to animation triggers
  const waveActionRef = useRef<() => void>(() => {});
  const turboTypeActionRef = useRef<() => void>(() => {});
  const resetCameraRef = useRef<() => void>(() => {});
  const toggleWireframeRef = useRef<(wf: boolean) => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent background, no box/block
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    keyLight.position.set(3, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Neon Cyber Rim Lights (Purple & Cyan)
    const rimPurple = new THREE.DirectionalLight(0xa855f7, 3.8);
    rimPurple.position.set(-4, 2.5, -2);
    scene.add(rimPurple);

    const rimCyan = new THREE.DirectionalLight(0x06b6d4, 3.0);
    rimCyan.position.set(4, -1, -2);
    scene.add(rimCyan);

    // Monitor screen dynamic cast glow on avatar face
    const screenLight = new THREE.PointLight(0x38bdf8, 3.4, 3.5);
    screenLight.position.set(0, 0.1, 0.4);
    scene.add(screenLight);

    // Materials Store for Wireframe Toggle
    const allMaterials: THREE.MeshStandardMaterial[] = [];
    const makeMat = (params: THREE.MeshStandardMaterialParameters) => {
      const mat = new THREE.MeshStandardMaterial({
        roughness: 0.4,
        metalness: 0.1,
        ...params,
      });
      allMaterials.push(mat);
      return mat;
    };

    // Color Palette Materials
    const skinMat = makeMat({ color: 0xe0a97a, roughness: 0.55, metalness: 0.05 });
    const hairMat = makeMat({ color: 0x18181b, roughness: 0.8, metalness: 0.1 });
    const hoodieMat = makeMat({ color: 0x1e1b4b, roughness: 0.75, metalness: 0.05 });
    const hoodieAccentMat = makeMat({ color: 0xa855f7, roughness: 0.35, metalness: 0.2 });
    const techBlackMat = makeMat({ color: 0x09090b, roughness: 0.25, metalness: 0.8 });
    const deskMat = makeMat({ color: 0x18181b, roughness: 0.3, metalness: 0.4 });
    const chairMat = makeMat({ color: 0x27272a, roughness: 0.5, metalness: 0.3 });
    const plantGreenMat = makeMat({ color: 0x22c55e, roughness: 0.4, metalness: 0.1 });
    const potMat = makeMat({ color: 0xfbbf24, roughness: 0.3, metalness: 0.6 });
    const mugMat = makeMat({ color: 0xef4444, roughness: 0.3, metalness: 0.2 });

    const glowPurpleMat = makeMat({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const glowCyanMat = makeMat({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });

    const visorMat = makeMat({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88,
    });

    // ================= 3D PROCEDURAL CODE TEXTURE FOR MONITOR =================
    const codeCanvas = document.createElement("canvas");
    codeCanvas.width = 512;
    codeCanvas.height = 320;
    const ctx = codeCanvas.getContext("2d");
    const codeTexture = new THREE.CanvasTexture(codeCanvas);
    codeTexture.generateMipmaps = false;
    codeTexture.minFilter = THREE.LinearFilter;

    let codeLinesOffset = 0;
    const renderCodeScreen = () => {
      if (!ctx) return;
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, 512, 320);

      // Terminal Header
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(0, 0, 512, 32);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(18, 16, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(36, 16, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(54, 16, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px monospace";
      ctx.fillText("kauxync@dev-workstation: ~/portfolio", 75, 20);

      // Code content lines
      ctx.font = "12px monospace";
      const sampleCode = [
        { text: "const kauxync = new Developer({", color: "#c084fc" },
        { text: "  name: 'Kaushalendra Kumar',", color: "#38bdf8" },
        { text: "  role: 'Full-Stack & Systems',", color: "#4ade80" },
        { text: "  skills: ['TypeScript', 'Next.js', 'C'],", color: "#fbbf24" },
        { text: "  status: 'Ready to Build 🚀',", color: "#f472b6" },
        { text: "});", color: "#c084fc" },
        { text: "", color: "#ffffff" },
        { text: "export async function buildFuture() {", color: "#38bdf8" },
        { text: "  await kauxync.optimize({ fps: 60 });", color: "#4ade80" },
        { text: "  return kauxync.deploy();", color: "#fbbf24" },
        { text: "}", color: "#38bdf8" },
      ];

      sampleCode.forEach((line, idx) => {
        const yPos = 60 + idx * 22 - (codeLinesOffset % 22);
        if (yPos > 40 && yPos < 310) {
          ctx.fillStyle = "#475569";
          ctx.fillText(String(idx + 1).padStart(2, "0"), 15, yPos);
          ctx.fillStyle = line.color;
          ctx.fillText(line.text, 45, yPos);
        }
      });
      codeTexture.needsUpdate = true;
    };
    renderCodeScreen();

    const monitorScreenMat = new THREE.MeshBasicMaterial({
      map: codeTexture,
    });

    // 3. Construct 3D Developer & Workstation Scene
    const rootSceneGroup = new THREE.Group();
    scene.add(rootSceneGroup);
    rootSceneGroup.position.set(-0.12, -0.3, 0);

    // ================= ERGONOMIC GAMING / DEV CHAIR =================
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, -0.2, -0.25);
    rootSceneGroup.add(chairGroup);

    // Chair Backrest
    const backrestGeo = new THREE.BoxGeometry(0.72, 0.95, 0.12);
    const backrest = new THREE.Mesh(backrestGeo, chairMat);
    backrest.position.set(0, 0.35, -0.35);
    backrest.rotation.x = 0.08;
    chairGroup.add(backrest);

    // Chair Headrest
    const headrestGeo = new THREE.BoxGeometry(0.48, 0.22, 0.1);
    const headrest = new THREE.Mesh(headrestGeo, hoodieAccentMat);
    headrest.position.set(0, 0.9, -0.38);
    chairGroup.add(headrest);

    // Chair Seat Base
    const seatGeo = new THREE.BoxGeometry(0.75, 0.12, 0.7);
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.set(0, -0.15, -0.15);
    chairGroup.add(seat);

    // Chair Base Stem & Wheel Hub
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12);
    const stem = new THREE.Mesh(stemGeo, techBlackMat);
    stem.position.set(0, -0.42, -0.15);
    chairGroup.add(stem);

    // ================= DESK & ACCESSORIES =================
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 0.4);
    rootSceneGroup.add(deskGroup);

    // Desktop Surface
    const deskTopGeo = new THREE.BoxGeometry(2.2, 0.06, 0.95);
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, -0.2, 0);
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
    const legPositions = [
      [-1.0, -0.6, 0.4],
      [1.0, -0.6, 0.4],
      [-1.0, -0.6, -0.4],
      [1.0, -0.6, -0.4],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, techBlackMat);
      leg.position.set(lx, ly, lz);
      deskGroup.add(leg);
    });

    // Desk LED Underglow Bar
    const ledBarGeo = new THREE.BoxGeometry(2.1, 0.02, 0.02);
    const ledBar = new THREE.Mesh(ledBarGeo, glowPurpleMat);
    ledBar.position.set(0, -0.23, 0.46);
    deskGroup.add(ledBar);

    // ================= DUAL ULTRAWIDE MONITOR =================
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(0, 0.32, -0.15);
    deskGroup.add(monitorGroup);

    // Curved/Angled Monitor Display Frame
    const monitorFrameGeo = new THREE.BoxGeometry(1.4, 0.72, 0.04);
    const monitorFrame = new THREE.Mesh(monitorFrameGeo, techBlackMat);
    monitorGroup.add(monitorFrame);

    // Active Code Display Screen
    const monitorScreenGeo = new THREE.PlaneGeometry(1.34, 0.66);
    const monitorScreen = new THREE.Mesh(monitorScreenGeo, monitorScreenMat);
    monitorScreen.position.set(0, 0, 0.025);
    monitorGroup.add(monitorScreen);

    // Monitor Stand
    const standStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12);
    const standStem = new THREE.Mesh(standStemGeo, techBlackMat);
    standStem.position.set(0, -0.32, -0.08);
    monitorGroup.add(standStem);

    const standBaseGeo = new THREE.BoxGeometry(0.35, 0.02, 0.25);
    const standBase = new THREE.Mesh(standBaseGeo, techBlackMat);
    standBase.position.set(0, -0.52, -0.05);
    monitorGroup.add(standBase);

    // ================= MECHANICAL KEYBOARD & MOUSE =================
    const keyboardGroup = new THREE.Group();
    keyboardGroup.position.set(0, -0.16, 0.22);
    deskGroup.add(keyboardGroup);

    const keyBaseGeo = new THREE.BoxGeometry(0.65, 0.025, 0.24);
    const keyBase = new THREE.Mesh(keyBaseGeo, techBlackMat);
    keyboardGroup.add(keyBase);

    const keyCapGeo = new THREE.PlaneGeometry(0.62, 0.21);
    const keyCapMat = makeMat({
      color: 0x1e1b4b,
      emissive: 0xa855f7,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });
    const keyCaps = new THREE.Mesh(keyCapGeo, keyCapMat);
    keyCaps.rotation.x = -Math.PI / 2;
    keyCaps.position.set(0, 0.015, 0);
    keyboardGroup.add(keyCaps);

    // Mouse & Mousepad
    const mousepadGeo = new THREE.BoxGeometry(0.24, 0.005, 0.28);
    const mousepad = new THREE.Mesh(mousepadGeo, hoodieMat);
    mousepad.position.set(0.55, -0.165, 0.22);
    deskGroup.add(mousepad);

    const mouseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.12), techBlackMat);
    mouseMesh.position.set(0.55, -0.15, 0.22);
    deskGroup.add(mouseMesh);

    // Desk Coffee Mug
    const mugGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.12, 16);
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.65, -0.13, 0.2);
    deskGroup.add(mug);

    // Desk Potted Succulent Plant
    const potGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.1, 8);
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0.85, -0.14, -0.05);
    deskGroup.add(pot);

    const plantGeo = new THREE.DodecahedronGeometry(0.07);
    const plant = new THREE.Mesh(plantGeo, plantGreenMat);
    plant.position.set(0.85, -0.06, -0.05);
    deskGroup.add(plant);

    // ================= 3D DEVELOPER AVATAR (PERSON) =================
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, 0, 0);
    rootSceneGroup.add(avatarGroup);

    // Torso / Developer Hoodie
    const bodyGroup = new THREE.Group();
    avatarGroup.add(bodyGroup);

    const torsoGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.85, 20);
    const torso = new THREE.Mesh(torsoGeo, hoodieMat);
    torso.position.set(0, -0.12, -0.22);
    torso.castShadow = true;
    bodyGroup.add(torso);

    // Hoodie Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.32, 0.09, 16, 24);
    const collar = new THREE.Mesh(collarGeo, hoodieMat);
    collar.rotation.x = Math.PI / 2.3;
    collar.position.set(0, 0.28, -0.18);
    bodyGroup.add(collar);

    // Zipper
    const zipperGeo = new THREE.BoxGeometry(0.035, 0.78, 0.03);
    const zipper = new THREE.Mesh(zipperGeo, hoodieAccentMat);
    zipper.position.set(0, -0.12, 0.23);
    zipper.position.z = -0.22 + 0.45;
    bodyGroup.add(zipper);

    // Shoulders
    const leftShoulderGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const leftShoulder = new THREE.Mesh(leftShoulderGeo, hoodieMat);
    leftShoulder.position.set(-0.52, 0.16, -0.22);
    bodyGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(leftShoulderGeo, hoodieMat);
    rightShoulder.position.set(0.52, 0.16, -0.22);
    bodyGroup.add(rightShoulder);

    // Left Arm (Typing at Keyboard)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.52, 0.16, -0.22);
    bodyGroup.add(leftArmGroup);

    const leftUpperArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.48, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, hoodieMat);
    leftUpperArm.position.set(0, -0.22, 0.12);
    leftUpperArm.rotation.set(0.5, 0, 0.15);
    leftArmGroup.add(leftUpperArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.48, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeo, hoodieMat);
    leftForearm.position.set(0.16, -0.32, 0.38);
    leftForearm.rotation.set(1.4, 0.25, -0.35);
    leftArmGroup.add(leftForearm);

    const leftHandGeo = new THREE.SphereGeometry(0.075, 12, 12);
    const leftHand = new THREE.Mesh(leftHandGeo, skinMat);
    leftHand.position.set(0.26, -0.32, 0.62);
    leftArmGroup.add(leftHand);

    // Right Arm (Typing / Waving Hierarchy)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.52, 0.16, -0.22);
    bodyGroup.add(rightArmGroup);

    const rightUpperArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.48, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, hoodieMat);
    rightUpperArm.position.set(0, -0.22, 0.12);
    rightUpperArm.rotation.set(0.5, 0, -0.15);
    rightArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.38, 0.22);
    rightArmGroup.add(rightForearmGroup);

    const rightForearm = new THREE.Mesh(leftForearmGeo, hoodieMat);
    rightForearm.position.set(-0.16, 0.06, 0.16);
    rightForearm.rotation.set(1.4, -0.25, 0.35);
    rightForearmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(leftHandGeo, skinMat);
    rightHand.position.set(-0.26, 0.06, 0.4);
    rightForearmGroup.add(rightHand);

    // ================= HEAD & FACE & ACCESSORIES =================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.55, -0.22);
    avatarGroup.add(headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.28, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, -0.14, 0);
    headGroup.add(neck);

    // Head Base
    const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.scale.set(0.92, 1.05, 0.98);
    head.position.set(0, 0.18, 0);
    head.castShadow = true;
    headGroup.add(head);

    // Nose
    const noseGeo = new THREE.ConeGeometry(0.05, 0.1, 12);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.rotation.x = Math.PI / 2.2;
    nose.position.set(0, 0.16, 0.38);
    headGroup.add(nose);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const leftEar = new THREE.Mesh(earGeo, skinMat);
    leftEar.scale.set(0.5, 1, 0.8);
    leftEar.position.set(-0.36, 0.18, 0.02);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, skinMat);
    rightEar.scale.set(0.5, 1, 0.8);
    rightEar.position.set(0.36, 0.18, 0.02);
    headGroup.add(rightEar);

    // Stylized Layered Hair
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    const hairMainGeo = new THREE.SphereGeometry(0.41, 20, 20);
    const hairMain = new THREE.Mesh(hairMainGeo, hairMat);
    hairMain.scale.set(0.96, 0.9, 1.04);
    hairMain.position.set(0, 0.28, -0.03);
    hairGroup.add(hairMain);

    // Modern Hair Tufts
    const hairTuftGeo = new THREE.ConeGeometry(0.1, 0.26, 8);
    for (let i = -3; i <= 3; i++) {
      const tuft = new THREE.Mesh(hairTuftGeo, hairMat);
      tuft.rotation.set(-0.35, 0, (i * Math.PI) / 14);
      tuft.position.set(i * 0.08, 0.46, 0.3);
      hairGroup.add(tuft);
    }

    // ================= SMART DEVELOPER VISOR / GLASSES =================
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.2, 0.32);
    headGroup.add(glassesGroup);

    const frameGeo = new THREE.BoxGeometry(0.62, 0.16, 0.06);
    const frame = new THREE.Mesh(frameGeo, techBlackMat);
    glassesGroup.add(frame);

    const leftLensGeo = new THREE.BoxGeometry(0.24, 0.12, 0.02);
    const leftLens = new THREE.Mesh(leftLensGeo, visorMat);
    leftLens.position.set(-0.14, 0, 0.035);
    glassesGroup.add(leftLens);

    const rightLens = new THREE.Mesh(leftLensGeo, visorMat);
    rightLens.position.set(0.14, 0, 0.035);
    glassesGroup.add(rightLens);

    // ================= STUDIO HEADPHONES WITH RGB =================
    const hpGroup = new THREE.Group();
    headGroup.add(hpGroup);

    const headbandGeo = new THREE.TorusGeometry(0.42, 0.04, 16, 28, Math.PI);
    const headband = new THREE.Mesh(headbandGeo, techBlackMat);
    headband.rotation.z = -Math.PI / 2;
    headband.rotation.y = Math.PI / 2;
    headband.position.set(0, 0.32, 0.02);
    hpGroup.add(headband);

    const cupGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.07, 20);
    const leftCup = new THREE.Mesh(cupGeo, techBlackMat);
    leftCup.rotation.z = Math.PI / 2;
    leftCup.position.set(-0.41, 0.18, 0.02);
    hpGroup.add(leftCup);

    const leftGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16),
      glowPurpleMat
    );
    leftGlow.rotation.z = Math.PI / 2;
    leftGlow.position.set(-0.42, 0.18, 0.02);
    hpGroup.add(leftGlow);

    const rightCup = new THREE.Mesh(cupGeo, techBlackMat);
    rightCup.rotation.z = Math.PI / 2;
    rightCup.position.set(0.41, 0.18, 0.02);
    hpGroup.add(rightCup);

    const rightGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16),
      glowPurpleMat
    );
    rightGlow.rotation.z = Math.PI / 2;
    rightGlow.position.set(0.42, 0.18, 0.02);
    hpGroup.add(rightGlow);

    // ================= FLOATING 3D TECH ICONS & PARTICLES =================
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // Orbiting TypeScript `TS` / Code Cubes
    const cubeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const tsCube = new THREE.Mesh(cubeGeo, glowCyanMat);
    const pyCube = new THREE.Mesh(cubeGeo, potMat);
    const cCube = new THREE.Mesh(cubeGeo, glowPurpleMat);
    floatingGroup.add(tsCube, pyCube, cCube);

    // Ambient floating dust particles
    const particleCount = 55;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    floatingGroup.add(particles);

    // 4. Mouse / Touch & Dynamic Orbit System
    const targetOrbit = { x: 0, y: 0 };
    const currentOrbit = { x: 0, y: 0 };
    const headTarget = { x: 0, y: 0 };
    const headCurrent = { x: 0, y: 0 };

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let waveProgress = 0;
    let isWavingActive = false;
    let typingSpeedMultiplier = 1;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      headTarget.y = normX * 0.5;
      headTarget.x = -normY * 0.3;

      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        targetOrbit.y += deltaX * 0.012;
        targetOrbit.x += deltaY * 0.008;
        targetOrbit.x = Math.max(-0.4, Math.min(0.35, targetOrbit.x));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = container.getBoundingClientRect();
        const normX = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((t.clientY - rect.top) / rect.height) * 2 - 1);
        headTarget.y = normX * 0.45;
        headTarget.x = -normY * 0.25;

        if (isDragging) {
          const deltaX = t.clientX - prevMouse.x;
          const deltaY = t.clientY - prevMouse.y;
          targetOrbit.y += deltaX * 0.012;
          targetOrbit.x += deltaY * 0.008;
          prevMouse = { x: t.clientX, y: t.clientY };
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Actions
    const triggerWave = () => {
      isWavingActive = true;
      setIsWaving(true);
      waveProgress = 0;
      setTimeout(() => {
        isWavingActive = false;
        setIsWaving(false);
      }, 2400);
    };
    waveActionRef.current = triggerWave;

    const triggerTurbo = () => {
      typingSpeedMultiplier = 3.5;
      setTimeout(() => {
        typingSpeedMultiplier = 1;
      }, 2500);
    };
    turboTypeActionRef.current = triggerTurbo;

    const resetCamera = () => {
      targetOrbit.x = 0;
      targetOrbit.y = 0;
      headTarget.x = 0;
      headTarget.y = 0;
    };
    resetCameraRef.current = resetCamera;

    const toggleWireframe = (wf: boolean) => {
      allMaterials.forEach((m) => {
        m.wireframe = wf;
      });
      monitorScreenMat.wireframe = wf;
    };
    toggleWireframeRef.current = toggleWireframe;

    // 5. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastCodeRender = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Orbit Interpolation
      currentOrbit.x += (targetOrbit.x - currentOrbit.x) * 0.08;
      currentOrbit.y += (targetOrbit.y - currentOrbit.y) * 0.08;
      rootSceneGroup.rotation.x = currentOrbit.x;
      rootSceneGroup.rotation.y = currentOrbit.y;

      headCurrent.x += (headTarget.x - headCurrent.x) * 0.1;
      headCurrent.y += (headTarget.y - headCurrent.y) * 0.1;

      // Breathing rhythm
      const breath = Math.sin(elapsed * 2.2) * 0.02;
      bodyGroup.position.y = breath;
      torso.scale.set(1 + breath * 0.4, 1, 1 + breath * 0.4);

      // Typing simulation on left arm & hands
      const typeFreq = elapsed * 12 * typingSpeedMultiplier;
      leftHand.position.y = -0.32 + Math.sin(typeFreq) * 0.015;
      leftHand.position.x = 0.26 + Math.cos(typeFreq * 0.8) * 0.02;

      // Right arm animation: Waving vs. Typing
      if (isWavingActive) {
        waveProgress += 0.05;
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, -1.2, 0.15);
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, -0.6, 0.15);
        rightForearmGroup.rotation.z = Math.sin(waveProgress * 8) * 0.35;
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.1);
        headGroup.rotation.x = Math.sin(waveProgress * 4) * 0.12;
      } else {
        rightArmGroup.rotation.z = THREE.MathUtils.lerp(rightArmGroup.rotation.z, 0, 0.1);
        rightArmGroup.rotation.x = THREE.MathUtils.lerp(rightArmGroup.rotation.x, 0, 0.1);
        rightForearmGroup.rotation.z = 0;
        rightHand.position.y = 0.06 + Math.cos(typeFreq * 1.1) * 0.015;
        rightHand.position.x = -0.26 + Math.sin(typeFreq * 0.7) * 0.02;

        headGroup.rotation.x = headCurrent.x + Math.sin(elapsed * 1.5) * 0.015;
        headGroup.rotation.y = headCurrent.y;
        headGroup.position.y = 0.55 + breath * 0.5;
      }

      // Dynamic Terminal Code Screen refresh
      if (elapsed - lastCodeRender > 0.08) {
        codeLinesOffset += 0.4 * typingSpeedMultiplier;
        renderCodeScreen();
        lastCodeRender = elapsed;
      }

      // Screen glow flicker
      screenLight.intensity = 2.8 + Math.sin(elapsed * 6) * 0.4;

      // Orbiting 3D Floating Tech Cubes
      tsCube.position.set(
        Math.cos(elapsed * 0.9) * 1.4,
        0.3 + Math.sin(elapsed * 1.8) * 0.25,
        Math.sin(elapsed * 0.9) * 1.4
      );
      tsCube.rotation.x = elapsed;
      tsCube.rotation.y = elapsed;

      pyCube.position.set(
        Math.cos(-elapsed * 1.1 + 2) * 1.25,
        -0.1 + Math.cos(elapsed * 2.1) * 0.2,
        Math.sin(-elapsed * 1.1 + 2) * 1.25
      );
      pyCube.rotation.y = -elapsed * 1.2;

      cCube.position.set(
        Math.sin(elapsed * 0.75 + 4) * 1.5,
        0.5 + Math.cos(elapsed * 1.4) * 0.22,
        Math.cos(elapsed * 0.75 + 4) * 1.1
      );
      cCube.rotation.z = elapsed * 0.8;

      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer for fluid responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width || 450;
        const newHeight = entry.contentRect.height || 500;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      allMaterials.forEach((m) => m.dispose());
      monitorScreenMat.dispose();
      codeTexture.dispose();
    };
  }, []);

  const handleWireframeToggle = useCallback(() => {
    const next = !isWireframe;
    setIsWireframe(next);
    toggleWireframeRef.current(next);
  }, [isWireframe]);

  const handleWave = useCallback(() => {
    waveActionRef.current();
  }, []);

  const handleTurbo = useCallback(() => {
    turboTypeActionRef.current();
  }, []);

  const handleReset = useCallback(() => {
    resetCameraRef.current();
  }, []);

  return (
    <div className="relative mx-auto w-full h-[380px] sm:h-[460px] lg:h-[520px] max-w-[480px] lg:max-w-[560px] flex flex-col items-center justify-center select-none">
      {/* 3D WebGL Canvas - Pure Floating, Transparent, No Enclosure Box */}
      <div
        ref={mountRef}
        role="img"
        aria-label="Interactive 3D Avatar of Kaushalendra Kumar coding on workstation with dual monitor, headphones, and cyber lighting"
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Sleek Floating Pill Controls (Minimal & Transparent) */}
      <div className="absolute bottom-2 flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-3 py-1 backdrop-blur-md text-[0.6875rem] font-mono shadow-sm">
        <button
          type="button"
          onClick={handleWave}
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold transition-all ${
            isWaving ? "bg-[#22c55e] text-white" : "hover:text-accent"
          }`}
          title="Wave greeting"
        >
          <span>👋</span> Wave
        </button>
        <span className="text-muted/40">|</span>
        <button
          type="button"
          onClick={handleTurbo}
          className="flex items-center gap-1 px-2.5 py-0.5 font-bold hover:text-accent transition-colors"
          title="Speed coding mode"
        >
          <span>⚡</span> Code
        </button>
        <span className="text-muted/40">|</span>
        <button
          type="button"
          onClick={handleWireframeToggle}
          className="flex items-center gap-1 px-2.5 py-0.5 font-bold hover:text-accent transition-colors"
          title="Toggle wireframe"
        >
          <span>📐</span> {isWireframe ? "Solid" : "Wire"}
        </button>
        <span className="text-muted/40">|</span>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-0.5 font-bold hover:text-accent transition-colors"
          title="Reset camera"
        >
          <span>🎯</span>
        </button>
      </div>
    </div>
  );
}
