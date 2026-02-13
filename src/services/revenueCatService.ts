export type PlanId = 'monthly' | 'yearly';

interface PurchaseResult {
  active: boolean;
  entitlementId: string;
}

export const purchasePlan = async (planId: PlanId): Promise<PurchaseResult> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return {
    active: true,
    entitlementId: `lockgoal_${planId}`,
  };
};
