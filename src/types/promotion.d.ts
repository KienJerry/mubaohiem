type Promotion = {
  code: string,
  name: string,
  rule_id: number,
  to_date: string,
  currency: string,
  from_date: string,
  is_active: boolean,
  coupon_type: string,
  description: string,
  simple_action: string,
  discount_amount: number,
  uses_per_customer: number,
  max_discount: number | null,
  promotion_image: null | string,
}

type ResPromotion = {
  cartPriceRule: {
    items: Promotion[],
    total_count: number,
  },
}
