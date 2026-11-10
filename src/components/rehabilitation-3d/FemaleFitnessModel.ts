import * as THREE from "three";
import { AffectedSide, TargetArea } from "./types";

export interface FitnessModelController {
  group: THREE.Group;
  applyPose: (
    exerciseKey: string,
    progress: number, // 0 to 1 within single rep
    side: AffectedSide,
    phase: string,
  ) => void;
  setTargetArea: (area: TargetArea, side: AffectedSide) => void;
  updateTargetPulse: (time: number) => void;
  resetPose: () => void;
  dispose: () => void;
}

export function createFemaleFitnessModel(): FitnessModelController {
  const rootGroup = new THREE.Group();
  rootGroup.name = "female_fitness_model_root";

  // ==================== MATERIALS ====================
  // 1. Natural warm feminine skin
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5cfb8,
    roughness: 0.52,
    metalness: 0.03,
  });

  // 2. Hot pink / magenta athletic sports top (matching reference image)
  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xdb2777, // vibrant magenta pink
    roughness: 0.38,
    metalness: 0.12,
  });

  // 3. High-waisted deep magenta / royal purple leggings (matching reference image)
  const leggingsMaterial = new THREE.MeshStandardMaterial({
    color: 0x86198f, // deep fuchsia purple
    roughness: 0.42,
    metalness: 0.12,
  });

  // 4. Waistband and seam trim
  const waistbandMaterial = new THREE.MeshStandardMaterial({
    color: 0x701a75,
    roughness: 0.4,
    metalness: 0.15,
  });

  // 5. Pink Ribbon Badge (Awareness Ribbon) Material
  const ribbonPinkMaterial = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.3,
    metalness: 0.2,
    emissive: 0xf472b6,
    emissiveIntensity: 0.15,
  });

  const ribbonWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.1,
  });

  // 6. Hair & Top Bun (warm rich brunette)
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e1810,
    roughness: 0.65,
    metalness: 0.05,
  });

  // 7. Hair tie (hot pink)
  const hairTieMaterial = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    roughness: 0.3,
    metalness: 0.15,
  });

  // 8. Athletic sneakers
  const sneakerUpperMaterial = new THREE.MeshStandardMaterial({
    color: 0xf472b6, // hot pink upper
    roughness: 0.35,
    metalness: 0.1,
  });

  const sneakerSoleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, // clean white sole
    roughness: 0.25,
    metalness: 0.05,
  });

  // 9. Facial features materials
  const lipMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9777f, // soft feminine rose
    roughness: 0.4,
    metalness: 0.05,
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f1412,
    roughness: 0.2,
    metalness: 0.2,
  });

  // 10. Golden joint target highlight (pulsing rotator cuff target)
  const goldTargetMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.3,
  });

  const goldRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.85,
    wireframe: true,
  });

  // 11. Mobility wand (for assisted exercises)
  const wandMaterial = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.25,
    metalness: 0.3,
  });

  // ==================== SKELETON HIERARCHY ====================
  // Pelvis / Hips (Root of body)
  const pelvisBone = new THREE.Group();
  pelvisBone.position.set(0, 0.95, 0);
  rootGroup.add(pelvisBone);

  // Pelvis mesh (Leggings upper - high waist athletic cut)
  const pelvisGeom = new THREE.CylinderGeometry(0.165, 0.145, 0.2, 24);
  const pelvisMesh = new THREE.Mesh(pelvisGeom, leggingsMaterial);
  pelvisMesh.castShadow = true;
  pelvisBone.add(pelvisMesh);

  // High waistband accent
  const waistbandGeom = new THREE.CylinderGeometry(0.168, 0.166, 0.05, 24);
  const waistbandMesh = new THREE.Mesh(waistbandGeom, waistbandMaterial);
  waistbandMesh.position.y = 0.085;
  pelvisBone.add(waistbandMesh);

  // Awareness ribbon badge on upper left thigh
  const thighRibbon = createAwarenessRibbon(ribbonPinkMaterial, 0.035);
  thighRibbon.position.set(0.11, -0.02, 0.14);
  thighRibbon.rotation.set(0.1, 0.25, -0.15);
  pelvisBone.add(thighRibbon);

  // Lower spine / Exposed athletic midriff
  const spineBone = new THREE.Group();
  spineBone.position.set(0, 0.13, 0);
  pelvisBone.add(spineBone);

  // Toned midriff skin
  const spineGeom = new THREE.CylinderGeometry(0.135, 0.15, 0.12, 20);
  const spineMesh = new THREE.Mesh(spineGeom, skinMaterial);
  spineMesh.position.set(0, 0.06, 0);
  spineMesh.castShadow = true;
  spineBone.add(spineMesh);

  // Navel detail
  const navelGeom = new THREE.SphereGeometry(0.005, 8, 8);
  const navelMesh = new THREE.Mesh(navelGeom, new THREE.MeshBasicMaterial({ color: 0xd4a58e }));
  navelMesh.position.set(0, 0.04, 0.138);
  spineBone.add(navelMesh);

  // Chest / Thorax (Sports bra crop top)
  const chestBone = new THREE.Group();
  chestBone.position.set(0, 0.14, 0);
  spineBone.add(chestBone);

  const chestGeom = new THREE.CylinderGeometry(0.17, 0.135, 0.22, 24);
  const chestMesh = new THREE.Mesh(chestGeom, topMaterial);
  chestMesh.position.set(0, 0.11, 0);
  chestMesh.castShadow = true;
  chestBone.add(chestMesh);

  // Bust contour (athletic sports bra support)
  const bustL = new THREE.Mesh(new THREE.SphereGeometry(0.078, 20, 20), topMaterial);
  bustL.scale.set(1.0, 1.05, 1.1);
  bustL.position.set(0.068, 0.12, 0.095);
  chestBone.add(bustL);

  const bustR = new THREE.Mesh(new THREE.SphereGeometry(0.078, 20, 20), topMaterial);
  bustR.scale.set(1.0, 1.05, 1.1);
  bustR.position.set(-0.068, 0.12, 0.095);
  chestBone.add(bustR);

  // Breast Cancer Awareness Ribbon Badge on left chest (matching reference image!)
  const chestRibbon = createAwarenessRibbon(ribbonWhiteMaterial, 0.038);
  chestRibbon.position.set(0.075, 0.14, 0.165);
  chestRibbon.rotation.set(0.05, 0.2, -0.1);
  chestBone.add(chestRibbon);

  // Delicate clavicle collarbones (skin upper chest)
  const upperChestGeom = new THREE.CylinderGeometry(0.145, 0.168, 0.08, 20);
  const upperChestMesh = new THREE.Mesh(upperChestGeom, skinMaterial);
  upperChestMesh.position.set(0, 0.24, 0);
  upperChestMesh.castShadow = true;
  chestBone.add(upperChestMesh);

  // Sports top straps over shoulders
  const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1, 0.03), topMaterial);
  strapL.position.set(0.09, 0.22, 0);
  chestBone.add(strapL);

  const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.1, 0.03), topMaterial);
  strapR.position.set(-0.09, 0.22, 0);
  chestBone.add(strapR);

  // Neck
  const neckBone = new THREE.Group();
  neckBone.position.set(0, 0.28, 0);
  chestBone.add(neckBone);

  const neckGeom = new THREE.CylinderGeometry(0.055, 0.07, 0.1, 16);
  const neckMesh = new THREE.Mesh(neckGeom, skinMaterial);
  neckMesh.position.set(0, 0.05, 0);
  neckMesh.castShadow = true;
  neckBone.add(neckMesh);

  // Head & Refined Face
  const headBone = new THREE.Group();
  headBone.position.set(0, 0.1, 0);
  neckBone.add(headBone);

  const headGeom = new THREE.SphereGeometry(0.11, 24, 24);
  headGeom.scale(0.88, 1.15, 0.94);
  const headMesh = new THREE.Mesh(headGeom, skinMaterial);
  headMesh.position.set(0, 0.09, 0);
  headMesh.castShadow = true;
  headBone.add(headMesh);

  // Refined facial features:
  // Eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), eyeMaterial);
  eyeL.position.set(0.035, 0.1, 0.09);
  headBone.add(eyeL);

  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), eyeMaterial);
  eyeR.position.set(-0.035, 0.1, 0.09);
  headBone.add(eyeR);

  // Eyebrows
  const browGeom = new THREE.BoxGeometry(0.025, 0.005, 0.005);
  const browL = new THREE.Mesh(browGeom, hairMaterial);
  browL.position.set(0.035, 0.118, 0.092);
  browL.rotation.z = -0.1;
  headBone.add(browL);

  const browR = new THREE.Mesh(browGeom, hairMaterial);
  browR.position.set(-0.035, 0.118, 0.092);
  browR.rotation.z = 0.1;
  headBone.add(browR);

  // Nose bridge
  const noseGeom = new THREE.ConeGeometry(0.012, 0.03, 8);
  noseGeom.rotateX(Math.PI / 2);
  const noseMesh = new THREE.Mesh(noseGeom, skinMaterial);
  noseMesh.position.set(0, 0.088, 0.104);
  headBone.add(noseMesh);

  // Soft feminine lips
  const lipsGeom = new THREE.SphereGeometry(0.018, 12, 8);
  lipsGeom.scale(1.2, 0.5, 0.6);
  const lipsMesh = new THREE.Mesh(lipsGeom, lipMaterial);
  lipsMesh.position.set(0, 0.062, 0.095);
  headBone.add(lipsMesh);

  // Hair Base (Crown & Back)
  const hairBaseGeom = new THREE.SphereGeometry(0.118, 24, 24);
  hairBaseGeom.scale(0.93, 1.12, 1.05);
  const hairBaseMesh = new THREE.Mesh(hairBaseGeom, hairMaterial);
  hairBaseMesh.position.set(0, 0.115, -0.02);
  headBone.add(hairBaseMesh);

  // High Top Bun (styled on crown - matching reference image updo!)
  const bunGroup = new THREE.Group();
  bunGroup.position.set(0, 0.22, -0.01);
  headBone.add(bunGroup);

  const bunGeom = new THREE.SphereGeometry(0.065, 18, 18);
  bunGeom.scale(1.1, 0.95, 1.1);
  const bunMesh = new THREE.Mesh(bunGeom, hairMaterial);
  bunMesh.castShadow = true;
  bunGroup.add(bunMesh);

  // Pink Ribbon Tie around top bun
  const bunTieGeom = new THREE.TorusGeometry(0.052, 0.012, 12, 24);
  const bunTieMesh = new THREE.Mesh(bunTieGeom, hairTieMaterial);
  bunTieMesh.rotation.x = Math.PI / 2;
  bunTieMesh.position.y = -0.02;
  bunGroup.add(bunTieMesh);

  // Delicate hair wisps framing face
  const wispL = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.002, 0.08, 8), hairMaterial);
  wispL.position.set(0.085, 0.08, 0.04);
  wispL.rotation.z = -0.2;
  headBone.add(wispL);

  const wispR = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.002, 0.08, 8), hairMaterial);
  wispR.position.set(-0.085, 0.08, 0.04);
  wispR.rotation.z = 0.2;
  headBone.add(wispR);

  // ==================== LEFT ARM & SHOULDER ====================
  const leftClavicle = new THREE.Group();
  leftClavicle.position.set(0.12, 0.22, 0);
  chestBone.add(leftClavicle);

  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(0.08, 0, 0);
  leftClavicle.add(leftShoulder);

  const leftShoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 18, 18), skinMaterial);
  leftShoulderMesh.castShadow = true;
  leftShoulder.add(leftShoulderMesh);

  const leftUpperArm = new THREE.Group();
  leftUpperArm.position.set(0, 0, 0);
  leftShoulder.add(leftUpperArm);

  const leftArmGeom = new THREE.CylinderGeometry(0.044, 0.038, 0.25, 16);
  const leftArmMesh = new THREE.Mesh(leftArmGeom, skinMaterial);
  leftArmMesh.position.set(0, -0.125, 0);
  leftArmMesh.castShadow = true;
  leftUpperArm.add(leftArmMesh);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.25, 0);
  leftUpperArm.add(leftElbow);

  const leftElbowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), skinMaterial);
  leftElbow.add(leftElbowMesh);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, 0, 0);
  leftElbow.add(leftForearm);

  const leftForearmGeom = new THREE.CylinderGeometry(0.038, 0.03, 0.23, 16);
  const leftForearmMesh = new THREE.Mesh(leftForearmGeom, skinMaterial);
  leftForearmMesh.position.set(0, -0.115, 0);
  leftForearmMesh.castShadow = true;
  leftForearm.add(leftForearmMesh);

  const leftHand = new THREE.Group();
  leftHand.position.set(0, -0.23, 0);
  leftForearm.add(leftHand);

  const leftHandGeom = new THREE.BoxGeometry(0.032, 0.07, 0.045);
  const leftHandMesh = new THREE.Mesh(leftHandGeom, skinMaterial);
  leftHandMesh.position.set(0, -0.035, 0);
  leftHand.add(leftHandMesh);

  // ==================== RIGHT ARM & SHOULDER ====================
  const rightClavicle = new THREE.Group();
  rightClavicle.position.set(-0.12, 0.22, 0);
  chestBone.add(rightClavicle);

  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(-0.08, 0, 0);
  rightClavicle.add(rightShoulder);

  const rightShoulderMesh = new THREE.Mesh(new THREE.SphereGeometry(0.055, 18, 18), skinMaterial);
  rightShoulderMesh.castShadow = true;
  rightShoulder.add(rightShoulderMesh);

  const rightUpperArm = new THREE.Group();
  rightUpperArm.position.set(0, 0, 0);
  rightShoulder.add(rightUpperArm);

  const rightArmGeom = new THREE.CylinderGeometry(0.044, 0.038, 0.25, 16);
  const rightArmMesh = new THREE.Mesh(rightArmGeom, skinMaterial);
  rightArmMesh.position.set(0, -0.125, 0);
  rightArmMesh.castShadow = true;
  rightUpperArm.add(rightArmMesh);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.25, 0);
  rightUpperArm.add(rightElbow);

  const rightElbowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 14), skinMaterial);
  rightElbow.add(rightElbowMesh);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, 0, 0);
  rightElbow.add(rightForearm);

  const rightForearmGeom = new THREE.CylinderGeometry(0.038, 0.03, 0.23, 16);
  const rightForearmMesh = new THREE.Mesh(rightForearmGeom, skinMaterial);
  rightForearmMesh.position.set(0, -0.115, 0);
  rightForearmMesh.castShadow = true;
  rightForearm.add(rightForearmMesh);

  const rightHand = new THREE.Group();
  rightHand.position.set(0, -0.23, 0);
  rightForearm.add(rightHand);

  const rightHandGeom = new THREE.BoxGeometry(0.032, 0.07, 0.045);
  const rightHandMesh = new THREE.Mesh(rightHandGeom, skinMaterial);
  rightHandMesh.position.set(0, -0.035, 0);
  rightHand.add(rightHandMesh);

  // ==================== RIGHT SHOULDER ROTATOR CUFF TARGET HIGHLIGHT ====================
  // (Matching the glowing golden/orange spherical highlight in reference image!)
  const targetHighlightGroup = new THREE.Group();
  targetHighlightGroup.position.set(-0.02, 0.02, 0.04);
  rightShoulder.add(targetHighlightGroup);

  // Glowing center sphere
  const targetSphere = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), goldTargetMaterial);
  targetHighlightGroup.add(targetSphere);

  // Concentric pulsing outer golden ring 1
  const targetRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.005, 12, 32),
    goldRingMaterial,
  );
  targetRing1.rotation.y = Math.PI / 4;
  targetHighlightGroup.add(targetRing1);

  // Concentric pulsing outer golden ring 2
  const targetRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(0.095, 0.004, 12, 32),
    goldRingMaterial,
  );
  targetRing2.rotation.x = Math.PI / 3;
  targetHighlightGroup.add(targetRing2);

  // Mobility wand (for assisted wand exercises)
  const wandGeom = new THREE.CylinderGeometry(0.013, 0.013, 0.68, 16);
  const wandMesh = new THREE.Mesh(wandGeom, wandMaterial);
  wandMesh.rotation.z = Math.PI / 2;
  wandMesh.visible = false;
  chestBone.add(wandMesh);

  // ==================== LEGS & ATHLETIC SNEAKERS ====================
  // Left leg
  const leftHip = new THREE.Group();
  leftHip.position.set(0.095, -0.08, 0);
  pelvisBone.add(leftHip);

  const leftThighGeom = new THREE.CylinderGeometry(0.075, 0.052, 0.44, 20);
  const leftThighMesh = new THREE.Mesh(leftThighGeom, leggingsMaterial);
  leftThighMesh.position.set(0, -0.22, 0);
  leftThighMesh.castShadow = true;
  leftHip.add(leftThighMesh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.44, 0);
  leftHip.add(leftKnee);

  const leftShinGeom = new THREE.CylinderGeometry(0.05, 0.038, 0.4, 20);
  const leftShinMesh = new THREE.Mesh(leftShinGeom, leggingsMaterial);
  leftShinMesh.position.set(0, -0.2, 0);
  leftShinMesh.castShadow = true;
  leftKnee.add(leftShinMesh);

  // Left sneaker
  const leftFoot = new THREE.Group();
  leftFoot.position.set(0, -0.4, 0.04);
  leftKnee.add(leftFoot);

  const leftShoeUpper = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.055, 0.16),
    sneakerUpperMaterial,
  );
  leftShoeUpper.position.set(0, -0.02, 0.02);
  leftShoeUpper.castShadow = true;
  leftFoot.add(leftShoeUpper);

  const leftShoeSole = new THREE.Mesh(
    new THREE.BoxGeometry(0.082, 0.022, 0.175),
    sneakerSoleMaterial,
  );
  leftShoeSole.position.set(0, -0.05, 0.02);
  leftShoeSole.castShadow = true;
  leftFoot.add(leftShoeSole);

  // Right leg
  const rightHip = new THREE.Group();
  rightHip.position.set(-0.095, -0.08, 0);
  pelvisBone.add(rightHip);

  const rightThighGeom = new THREE.CylinderGeometry(0.075, 0.052, 0.44, 20);
  const rightThighMesh = new THREE.Mesh(rightThighGeom, leggingsMaterial);
  rightThighMesh.position.set(0, -0.22, 0);
  rightThighMesh.castShadow = true;
  rightHip.add(rightThighMesh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.44, 0);
  rightHip.add(rightKnee);

  const rightShinGeom = new THREE.CylinderGeometry(0.05, 0.038, 0.4, 20);
  const rightShinMesh = new THREE.Mesh(rightShinGeom, leggingsMaterial);
  rightShinMesh.position.set(0, -0.2, 0);
  rightShinMesh.castShadow = true;
  rightKnee.add(rightShinMesh);

  // Right sneaker
  const rightFoot = new THREE.Group();
  rightFoot.position.set(0, -0.4, 0.04);
  rightKnee.add(rightFoot);

  const rightShoeUpper = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.055, 0.16),
    sneakerUpperMaterial,
  );
  rightShoeUpper.position.set(0, -0.02, 0.02);
  rightShoeUpper.castShadow = true;
  rightFoot.add(rightShoeUpper);

  const rightShoeSole = new THREE.Mesh(
    new THREE.BoxGeometry(0.082, 0.022, 0.175),
    sneakerSoleMaterial,
  );
  rightShoeSole.position.set(0, -0.05, 0.02);
  rightShoeSole.castShadow = true;
  rightFoot.add(rightShoeSole);

  // Standing athletic posture (slightly wider, confident stance)
  leftHip.rotation.z = -0.06;
  rightHip.rotation.z = 0.06;
  leftKnee.rotation.z = 0.03;
  rightKnee.rotation.z = -0.03;

  // ==================== KINEMATICS & POSE LOGIC ====================
  const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

  const resetPose = () => {
    // Left arm default
    leftClavicle.position.set(0.12, 0.22, 0);
    leftClavicle.rotation.set(0, 0, 0);
    leftShoulder.rotation.set(0, 0, 0);
    leftUpperArm.rotation.set(0, 0, -0.08);
    leftElbow.rotation.set(0, 0, 0);
    leftForearm.rotation.set(0, 0, 0);
    leftHand.rotation.set(0, 0, 0);

    // Right arm default
    rightClavicle.position.set(-0.12, 0.22, 0);
    rightClavicle.rotation.set(0, 0, 0);
    rightShoulder.rotation.set(0, 0, 0);
    rightUpperArm.rotation.set(0, 0, 0.08);
    rightElbow.rotation.set(0, 0, 0);
    rightForearm.rotation.set(0, 0, 0);
    rightHand.rotation.set(0, 0, 0);

    // Torso default
    pelvisBone.position.set(0, 0.95, 0);
    pelvisBone.rotation.set(0, 0, 0);
    spineBone.rotation.set(0, 0, 0);
    chestBone.rotation.set(0, 0, 0);
    chestBone.scale.set(1, 1, 1);
    neckBone.rotation.set(0, 0, 0);
    headBone.rotation.set(0, 0, 0);

    wandMesh.visible = false;
  };

  /**
   * Sets the authentic Cross-Body Shoulder Stretch pose
   * (The exact signature pose from the reference image!)
   */
  const applyCrossBodyStretchPose = (motionAlpha: number, side: AffectedSide) => {
    const isRightStretched = side !== "left";

    if (isRightStretched) {
      // Right arm stretches across the chest to the left
      rightClavicle.rotation.y = -0.15 * motionAlpha;
      rightShoulder.rotation.set(0.15 * motionAlpha, -0.78 * motionAlpha, 1.35 * motionAlpha + 0.1);
      rightElbow.rotation.x = 0.12 * motionAlpha;
      rightForearm.rotation.y = -0.2 * motionAlpha;

      // Left arm bends up to cradle and support the right elbow/triceps
      leftShoulder.rotation.set(-0.35 * motionAlpha, 0.35 * motionAlpha, -0.55 * motionAlpha - 0.1);
      leftElbow.rotation.x = -1.55 * motionAlpha;
      leftForearm.rotation.y = 0.65 * motionAlpha;
      leftHand.rotation.z = -0.25 * motionAlpha;

      // Slight head turn towards the stretched arm
      headBone.rotation.y = -0.15 * motionAlpha;
      headBone.rotation.z = 0.05 * motionAlpha;
    } else {
      // Mirrored for left arm stretch
      leftClavicle.rotation.y = 0.15 * motionAlpha;
      leftShoulder.rotation.set(0.15 * motionAlpha, 0.78 * motionAlpha, -1.35 * motionAlpha - 0.1);
      leftElbow.rotation.x = 0.12 * motionAlpha;
      leftForearm.rotation.y = 0.2 * motionAlpha;

      rightShoulder.rotation.set(
        -0.35 * motionAlpha,
        -0.35 * motionAlpha,
        0.55 * motionAlpha + 0.1,
      );
      rightElbow.rotation.x = -1.55 * motionAlpha;
      rightForearm.rotation.y = -0.65 * motionAlpha;
      rightHand.rotation.z = 0.25 * motionAlpha;

      headBone.rotation.y = 0.15 * motionAlpha;
      headBone.rotation.z = -0.05 * motionAlpha;
    }
  };

  const applyPose = (
    exerciseKey: string,
    progress: number, // 0 to 1 within rep
    side: AffectedSide,
  ) => {
    resetPose();

    const doLeft = side === "left" || side === "both";
    const doRight = side === "right" || side === "both";

    // Progress curve: 0-0.4 move to peak, 0.4-0.7 hold gently, 0.7-1.0 return
    let motionAlpha = 0;
    if (progress <= 0.4) {
      motionAlpha = easeInOutSine(progress / 0.4);
    } else if (progress <= 0.7) {
      motionAlpha = 1.0;
    } else {
      motionAlpha = 1.0 - easeInOutSine((progress - 0.7) / 0.3);
    }

    switch (exerciseKey) {
      case "gentle_arm_elevation": {
        // High-precision cross-body elevation stretch (matching reference image!)
        applyCrossBodyStretchPose(0.65 + motionAlpha * 0.35, side);
        break;
      }

      case "shoulder_mobility_rolls": {
        const cycle = progress * Math.PI * 2;
        const rollY = Math.sin(cycle) * 0.03;
        const rollZ = -Math.cos(cycle) * 0.035;

        if (doLeft) {
          leftClavicle.position.y = 0.22 + rollY;
          leftClavicle.position.z = rollZ;
          leftShoulder.rotation.x = -Math.sin(cycle) * 0.3;
        }
        if (doRight) {
          rightClavicle.position.y = 0.22 + rollY;
          rightClavicle.position.z = rollZ;
          rightShoulder.rotation.x = -Math.sin(cycle) * 0.3;
        }
        break;
      }

      case "side_arm_movement": {
        // Safe frontal abduction
        const angle = motionAlpha * (60 * (Math.PI / 180));
        if (doLeft) {
          leftShoulder.rotation.z = angle;
          leftForearm.rotation.y = motionAlpha * 0.25;
        }
        if (doRight) {
          rightShoulder.rotation.z = -angle;
          rightForearm.rotation.y = -motionAlpha * 0.25;
        }
        break;
      }

      case "gentle_shoulder_rotation": {
        // 90 deg elbow, external rotation
        const rot = motionAlpha * (45 * (Math.PI / 180));
        if (doLeft) {
          leftElbow.rotation.x = -Math.PI / 2;
          leftShoulder.rotation.y = rot;
        }
        if (doRight) {
          rightElbow.rotation.x = -Math.PI / 2;
          rightShoulder.rotation.y = -rot;
        }
        break;
      }

      case "chest_stretching_posture": {
        chestBone.rotation.x = -motionAlpha * 0.12;
        chestBone.scale.set(1 + motionAlpha * 0.07, 1 + motionAlpha * 0.04, 1 + motionAlpha * 0.08);
        leftShoulder.rotation.x = motionAlpha * 0.25;
        leftShoulder.rotation.y = -motionAlpha * 0.22;
        rightShoulder.rotation.x = motionAlpha * 0.25;
        rightShoulder.rotation.y = motionAlpha * 0.22;
        break;
      }

      case "breathing_relaxation_lymph": {
        let breath = 0;
        if (progress <= 0.35) {
          breath = easeInOutSine(progress / 0.35);
        } else if (progress <= 0.6) {
          breath = 1.0;
        } else {
          breath = 1.0 - easeInOutSine((progress - 0.6) / 0.4);
        }
        chestBone.scale.set(1 + breath * 0.09, 1 + breath * 0.06, 1 + breath * 0.12);
        chestBone.position.y = breath * 0.018;
        headBone.rotation.x = -breath * 0.05;
        break;
      }

      case "wand_assisted_mobility": {
        wandMesh.visible = true;
        const wandAngle = motionAlpha * (70 * (Math.PI / 180));
        leftShoulder.rotation.x = -wandAngle;
        rightShoulder.rotation.x = -wandAngle;
        leftElbow.rotation.x = 0.2;
        rightElbow.rotation.x = 0.2;
        wandMesh.position.set(0, 0.06 + motionAlpha * 0.32, 0.24 + motionAlpha * 0.15);
        break;
      }

      case "scapular_squeeze_retraction": {
        leftElbow.rotation.x = -Math.PI / 2.2;
        rightElbow.rotation.x = -Math.PI / 2.2;
        leftShoulder.rotation.y = -motionAlpha * 0.45;
        rightShoulder.rotation.y = motionAlpha * 0.45;
        chestBone.scale.set(1 + motionAlpha * 0.05, 1, 1 + motionAlpha * 0.06);
        break;
      }

      default:
        applyCrossBodyStretchPose(0.85, side);
        break;
    }
  };

  const updateTargetPulse = (time: number) => {
    // Gentle pulsation of golden rotator cuff target
    const pulse = 1 + Math.sin(time * 3.5) * 0.12;
    targetSphere.scale.set(pulse, pulse, pulse);
    targetRing1.rotation.z += 0.02;
    targetRing2.rotation.z -= 0.015;
    const ringScale = 1 + Math.sin(time * 2.8) * 0.08;
    targetRing1.scale.set(ringScale, ringScale, ringScale);
    targetRing2.scale.set(ringScale, ringScale, ringScale);
  };

  const setTargetArea = (area: TargetArea, side: AffectedSide) => {
    // Show/hide golden target based on side & area
    const isRight = side === "right" || side === "both";
    const isLeft = side === "left";

    targetHighlightGroup.visible = area === "shoulder" || area === "arm";
    if (isLeft) {
      targetHighlightGroup.position.set(0.02, 0.02, 0.04);
      leftShoulder.add(targetHighlightGroup);
    } else {
      targetHighlightGroup.position.set(-0.02, 0.02, 0.04);
      rightShoulder.add(targetHighlightGroup);
    }
  };

  // Initialize with reference image cross-body pose
  applyCrossBodyStretchPose(0.9, "right");

  const dispose = () => {
    rootGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });
  };

  return {
    group: rootGroup,
    applyPose,
    setTargetArea,
    updateTargetPulse,
    resetPose,
    dispose,
  };
}

/**
 * Creates a 3D Pink Cancer Awareness Ribbon shape mesh
 */
function createAwarenessRibbon(material: THREE.Material, scale = 0.04): THREE.Group {
  const ribbonGroup = new THREE.Group();

  // Left loop arm
  const curveLeft = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-scale * 0.5, -scale * 1.1, 0),
    new THREE.Vector3(-scale * 0.8, scale * 0.2, 0.005),
    new THREE.Vector3(scale * 0.4, scale * 1.2, 0.01),
    new THREE.Vector3(0, scale * 0.3, 0.012),
  );
  const geomL = new THREE.TubeGeometry(curveLeft, 24, scale * 0.12, 8, false);
  const meshL = new THREE.Mesh(geomL, material);
  ribbonGroup.add(meshL);

  // Right loop arm
  const curveRight = new THREE.CubicBezierCurve3(
    new THREE.Vector3(scale * 0.5, -scale * 1.1, 0),
    new THREE.Vector3(scale * 0.8, scale * 0.2, 0.005),
    new THREE.Vector3(-scale * 0.4, scale * 1.2, 0.01),
    new THREE.Vector3(0, scale * 0.3, 0.012),
  );
  const geomR = new THREE.TubeGeometry(curveRight, 24, scale * 0.12, 8, false);
  const meshR = new THREE.Mesh(geomR, material);
  ribbonGroup.add(meshR);

  return ribbonGroup;
}
