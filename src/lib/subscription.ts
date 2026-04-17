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
