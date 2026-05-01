import type { Purchase } from "@myedspace/shared";
export const purchases: Purchase[] = [];

export const PurchaseRepo = {
  getAll: () => [...purchases],
  add: (purchase: Purchase) => {
    purchases.push(purchase);
  },
};
