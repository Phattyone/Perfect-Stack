export type SubscriptionStatus = "free" | "foundation" | "complete" | "ultimate" | "active"

export const FOUNDATION_PLANS: SubscriptionStatus[] = ["foundation", "complete", "ultimate", "active"]
export const ULTIMATE_PLANS: SubscriptionStatus[] = ["complete", "ultimate"]

export function isFoundation(status: string | null): boolean {
  return FOUNDATION_PLANS.includes(status as SubscriptionStatus)
}

export function isUltimate(status: string | null): boolean {
  return ULTIMATE_PLANS.includes(status as SubscriptionStatus)
}

export function isFree(status: string | null): boolean {
  return !isFoundation(status)
}

/** Number of Stack A supplements blurred/locked for free users */
export const FREE_STACK_A_LOCKED_SUPPLEMENTS: number = 2

/** Number of meal plan days fully accessible for free users */
export const FREE_MEAL_PLAN_DAYS: number = 3
