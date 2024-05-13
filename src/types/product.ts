export interface ProductParams {
  type_get?: 'price_reduction' | 'price_increase' | 'new' | 'top_sale' | 'combo' | 'sale' | ''
  limit?: number
  offset?: number
  keyword?: string
  category_id?: number | false
  categ_id?: number | false
  product_id?: number
  partner_id?: number
  attribute_ids?: any[]
}
