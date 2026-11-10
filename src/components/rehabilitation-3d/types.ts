export type TargetArea = "arm" | "shoulder" | "chest" | "torso" | "breathing";

export type RehabStage = "early" | "gentle" | "progressive" | "all";

export type AffectedSide = "left" | "right" | "both";

export interface ExerciseStep3D {
  order: number;
  phase: "prepare" | "movement" | "hold" | "return" | "rest";
  ar: string;
  en: string;
  durationPercent: number; // percent of single rep cycle (sum to 100)
  targetVisualCue_ar?: string;
  targetVisualCue_en?: string;
}

export interface Exercise3DDef {
  key: string;
  name_ar: string;
  name_en: string;
  category:
    | "arm_elevation"
    | "shoulder_mobility"
    | "side_movement"
    | "shoulder_rotation"
    | "chest_stretch"
    | "breathing_relaxation";
  category_name_ar: string;
  category_name_en: string;
  targetArea: TargetArea;
  targetArea_ar: string;
  targetArea_en: string;
  stage: RehabStage;
  stage_ar: string;
  stage_en: string;
  purpose_ar: string;
  purpose_en: string;
  instructions_ar: string[];
  instructions_en: string[];
  precautions_ar: string[];
  precautions_en: string[];
  recommendedReps: number;
  repDurationSeconds: number; // duration of 1 full repetition
  defaultTotalMinutes: number;
  level_ar: "مبتدئ" | "متوسط";
  level_en: "Beginner" | "Intermediate";
  steps: ExerciseStep3D[];
  motionConfig: {
    primaryJoint: "shoulder" | "elbow" | "spine" | "chest" | "scapula";
    motionPlane: "sagittal" | "frontal" | "transverse" | "expansion";
    maxAngleDeg: number; // clinical safe range limit
    holdTimeSeconds: number;
  };
}

export interface ExerciseSessionState {
  running: boolean;
  paused: boolean;
  completedReps: number;
  targetReps: number;
  elapsedSeconds: number;
  totalDurationSeconds: number;
  currentStepIndex: number;
  repCycleProgress: number; // 0 to 1 representing position within current repetition
  speed: number;
  affectedSide: AffectedSide;
}
