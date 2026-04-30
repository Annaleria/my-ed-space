export type Purchase = {
  id: string;
  parent_id: string;
  course_id: string;
  student_email: string;
  invite_token: string;
};

export const purchases: Purchase[] = [];

export const PurchaseRepo = {
  getAll: () => purchases,
  add: (purchase: Purchase) => {
    purchases.push(purchase);
  },
};
