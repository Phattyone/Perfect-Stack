"use client";

import { useReducer, useState, useTransition } from "react";
import Link from "next/link";
import type { ProfileFormData, SafetyModalConfig } from "@/lib/types/profile";
import { DEFAULT_PROFILE } from "@/lib/types/profile";
import { saveProfile } from "../actions";
import ProgressBar from "./progress-bar";
import StepBasicProfile from "./step-basic-profile";
import StepMedications from "./step-medications";
import StepStackSelection from "./step-stack-selection";
import SafetyModal from "./safety-modal";

// ---------------------------------------------------------------------------
// Safety modal definitions
// ---------------------------------------------------------------------------

function buildModalQueue(data: ProfileFormData): SafetyModalConfig[] {
  const queue: SafetyModalConfig[] = [];

  if (data.nitrate_meds) {
    queue.push({
      id: "nitrate",
      variant: "red",
      title: "Critical Safety Warning  -  Nitrate Medication Detected",
      body: "You have indicated you take nitrate medications (nitroglycerin, isosorbide, or similar). Nitrates combined with nitric oxide-boosting supplements  -  including L-Citrulline, Beet Root, and Pine Bark Extract  -  can cause a severe and potentially life-threatening drop in blood pressure. If you also use a PDE5 inhibitor (Viagra, Cialis, etc.), this combination is an absolute contraindication. All nitric oxide supplements in Stack C will be set to zero in your protocol. Do not use these supplements without explicit clearance from your cardiologist.",
      acknowledgeText:
        "I understand  -  I take nitrate medication and Stack C will be excluded",
      acknowledgementKey: "nitrate_warning_acknowledged",
    });
  }

  if (data.blood_thinners) {
    queue.push({
      id: "blood_thinners",
      variant: "orange",
      title: "Blood Thinner Interaction Notice",
      body: "You are on anticoagulant or blood-thinning medication. Several supplements in this protocol have mild to moderate interactions with blood thinners: Vitamin K2 (affects warfarin clotting cascade), Omega-3 at high dose (additive antiplatelet effect), Quercetin (inhibits warfarin metabolism via CYP3A4), Resveratrol (inhibits CYP2C9, warfarin\u2019s primary metabolic pathway), Horny Goat Weed (mild antiplatelet activity). These supplements are not necessarily excluded, but you must discuss each one with your prescriber before starting and monitor your INR or clotting markers as directed.",
      acknowledgeText:
        "I understand  -  I will consult my prescriber before starting these supplements",
      acknowledgementKey: "blood_thinner_warning_acknowledged",
    });
  }

  if (data.trt_hrt) {
    queue.push({
      id: "trt",
      variant: "blue",
      title: "Hormone Therapy Protocol Adjustment",
      body: "You are on testosterone replacement therapy or hormone therapy. Several supplements that work by stimulating your body\u2019s natural testosterone production have limited benefit when exogenous hormones are already present: Tongkat Ali, Fadogia Agrestis (both target LH/testosterone signaling which is suppressed by TRT), and DHEA (can cause unpredictable hormone fluctuations when combined with TRT). These will be flagged or dose-adjusted in your Stack Builder. Ashwagandha\u2019s cortisol-reduction and recovery benefits remain fully relevant. Inform your prescriber of all supplements you plan to take.",
      acknowledgeText:
        "I understand  -  my protocol will be adjusted for hormone therapy",
      acknowledgementKey: "trt_warning_acknowledged",
    });
  }

  if (data.pde5_inhibitor !== "None") {
    let pde5Body =
      "You use a PDE5 inhibitor. The good news: PDE5 inhibitors and the Nitric Performance Stack (Stack C) are designed to work together. PDE5 inhibitors prevent breakdown of nitric oxide signaling while Stack C increases nitric oxide production  -  they work on opposite ends of the same pathway and are mutually reinforcing. However, the combined blood pressure effect requires you to start NO supplements at a reduced dose and monitor how you feel. L-Citrulline: start at 3g, not the full dose. Beet Root: start at half dose. If you also take BP medications or alpha-blockers, your doses will be further reduced. Never take NO supplements within 24 hours of a nitrate medication.";

    if (data.alpha_blockers) {
      pde5Body +=
        "\n\nAlpha-blocker detected alongside PDE5 inhibitor. This combination significantly increases hypotension risk. Use only the lowest available PDE5 dose and allow the time gap between medications directed by your prescriber. Do not self-adjust.";
    }

    queue.push({
      id: "pde5",
      variant: "blue",
      title: "PDE5 Inhibitor + Nitric Oxide Stack  -  Important Guidance",
      body: pde5Body,
      acknowledgeText:
        "I understand  -  I will start NO supplements at a reduced dose and monitor blood pressure",
      acknowledgementKey: "pde5_warning_acknowledged",
    });
  }

  return queue;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

interface FormState {
  currentStep: 1 | 2 | 3;
  formData: ProfileFormData;
  modalQueue: SafetyModalConfig[];
  activeModal: SafetyModalConfig | null;
  error: string | null;
}

type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof ProfileFormData; value: string | boolean }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "ACKNOWLEDGE_MODAL" }
  | { type: "SET_ERROR"; error: string | null };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        error: null,
      };

    case "NEXT_STEP": {
      if (state.currentStep === 1) {
        return { ...state, currentStep: 2, error: null };
      }
      if (state.currentStep === 2) {
        // Build modal queue before advancing to step 3
        const queue = buildModalQueue(state.formData);
        if (queue.length > 0) {
          return {
            ...state,
            modalQueue: queue.slice(1),
            activeModal: queue[0],
            error: null,
          };
        }
        return { ...state, currentStep: 3, error: null };
      }
      return state;
    }

    case "PREV_STEP": {
      if (state.currentStep === 2) return { ...state, currentStep: 1, error: null };
      if (state.currentStep === 3) return { ...state, currentStep: 2, error: null };
      return state;
    }

    case "ACKNOWLEDGE_MODAL": {
      // Record acknowledgement flag
      const ackKey = state.activeModal?.acknowledgementKey;
      const updatedData = ackKey
        ? { ...state.formData, [ackKey]: true }
        : state.formData;

      // Pop next modal or advance to step 3
      if (state.modalQueue.length > 0) {
        return {
          ...state,
          formData: updatedData,
          activeModal: state.modalQueue[0],
          modalQueue: state.modalQueue.slice(1),
        };
      }
      return {
        ...state,
        formData: updatedData,
        activeModal: null,
        modalQueue: [],
        currentStep: 3,
      };
    }

    case "SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateStep1(data: ProfileFormData): string | null {
  if (!data.age_group) return "Please select your age group.";
  if (!data.primary_goal) return "Please select your primary goal.";
  if (!data.training_style) return "Please select your training style.";
  if (!data.health_status) return "Please select your health status.";
  return null;
}

function validateStep2(data: ProfileFormData): string | null {
  if (data.pde5_inhibitor !== "None") {
    if (!data.pde5_dose) return "Please enter your PDE5 inhibitor dose.";
    if (!data.pde5_frequency) return "Please select your PDE5 inhibitor frequency.";
  }
  return null;
}

function validateStep3(data: ProfileFormData): string | null {
  if (!data.stack_selection) return "Please select a stack.";
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ProfileFormProps {
  existingProfile: ProfileFormData | null;
  userId: string;
}

export default function ProfileForm({ existingProfile, userId }: ProfileFormProps) {
  const [state, dispatch] = useReducer(reducer, {
    currentStep: 1,
    formData: existingProfile ?? DEFAULT_PROFILE,
    modalQueue: [],
    activeModal: null,
    error: null,
  });

  const [isPending, startTransition] = useTransition();
  const [profileSaved, setProfileSaved] = useState(false);

  const { currentStep, formData, activeModal, error } = state;

  // Stacks that should be disabled on Step 3
  const disabledStacks: string[] = [];
  if (formData.nitrate_meds) {
    disabledStacks.push("stack_c");
  }

  function handleFieldChange(field: keyof ProfileFormData, value: string | boolean) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  function handleNext() {
    let validationError: string | null = null;
    if (currentStep === 1) validationError = validateStep1(formData);
    if (currentStep === 2) validationError = validateStep2(formData);
    if (validationError) {
      dispatch({ type: "SET_ERROR", error: validationError });
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  }

  function handleBack() {
    dispatch({ type: "PREV_STEP" });
  }

  function handleSave() {
    const validationError = validateStep3(formData);
    if (validationError) {
      dispatch({ type: "SET_ERROR", error: validationError });
      return;
    }

    startTransition(async () => {
      const result = await saveProfile(userId, formData);
      if (result?.error) {
        dispatch({ type: "SET_ERROR", error: result.error });
      } else {
        setProfileSaved(true);
      }
    });
  }

  if (profileSaved) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <svg className="mx-auto h-16 w-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-xl font-bold text-white">Profile saved.</h2>
        <p className="mt-2 text-sm text-zinc-400">Your Stack Builder is ready to calculate your personalized protocol.</p>
        <Link href="/dashboard/stack-builder" className="mt-6 inline-block w-full rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500">
          Build My Stack
        </Link>
        <Link href="/dashboard" className="mt-3 inline-block text-sm text-zinc-400 transition hover:text-zinc-300">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <ProgressBar currentStep={currentStep} />

      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {currentStep === 1 && (
          <StepBasicProfile data={formData} onChange={handleFieldChange} />
        )}
        {currentStep === 2 && (
          <StepMedications data={formData} onChange={handleFieldChange} />
        )}
        {currentStep === 3 && (
          <StepStackSelection
            data={formData}
            onChange={handleFieldChange}
            disabledStacks={disabledStacks}
          />
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-md bg-yellow-600 px-6 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="rounded-md bg-yellow-600 px-6 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>
      </div>

      {/* Safety modal overlay */}
      {activeModal && (
        <SafetyModal
          config={activeModal}
          onAcknowledge={() => dispatch({ type: "ACKNOWLEDGE_MODAL" })}
        />
      )}
    </div>
  );
}
