type ProductAttributes = {
  attribute_code: string,
  label: string,
  value: string,
}

type Aggregation = {
  count: number,
  label: string,
  position: null,
  attribute_code: string,
  options: {
    count: number,
    label: string,
    value: string,
    swatch_data?:
      | {
          type: string,
          value: string,
        }
      | any,
  }[],
}

type CategoriesBrands = {
  attribute_code: string,
  count: number,
  label: string,
  options: {
    label: string,
    value: string,
  }[],
}

type priceRangeFilter = {
  max: string,
  min: string,
  ranges: {
    from: string,
    label: string,
    to: string,
    value: string,
  }[],
}

type PriceRange = {
  maximum_price: {
    discount: {
      amount_off: number,
      percent_off: number,
    },
    final_price: {
      currency: string,
      value: number,
    },
    regular_price: {
      currency: string,
      value: number,
    },
  },
  minimum_price: {
    discount: {
      amount_off: number,
      percent_off: number,
    },
    final_price: {
      currency: string,
      value: number,
    },
    regular_price: {
      currency: string,
      value: number,
    },
  },
}

type Product = {
  sku: string,
  stock_status: string;
  uid: string,
  name: string,
  url_key: string,
  warranty: number,
  size: null | any,
  styrofoam: number,
  color: null | any,
  __typename: string,
  url_suffix: string,
  meta_title: string,
  stock_status: string,
  meta_keyword: string,
  review_count: number,
  helmet_shell: number,
  helmet_lining: number,
  rating_summary: number,
  daily_sale: null | {
    __typename: string,
    sale_qty: number,
    sold_qty: number,
    end_date: string,
    entity_id: number,
    sale_price: number,
    start_date: string,
    saleable_qty: number,
  },
  new_to_date: null | any,
  helmet_ear_cups: number,
  meta_description: string,
  new_from_date: null | any,
  canonical_url: null | string,
  country_of_manufacture: string,
  description: {
    html: string,
  },
  short_description: {
    html: string,
  },
  thumbnail: {
    url: string,
    position: null,
  },
  image: {
    url: string,
  },
  rating_summary_start: {
    star_1: number,
    star_2: number,
    star_3: number,
    star_4: number,
    star_5: number,
  },
  media_gallery: {
    url: string,
    disabled: false,
    position: number,
    label: null | string,
  }[],
  categories: {
    uid: string,
    name: string,
    path: string,
    level: number,
    url_key: string,
    url_path: string,
    image: null | string,
    icon_image: null | string,
  }[],
  price_range: PriceRange,
  attributes: ProductAttributes[],
  configurable_options: {
    attribute_code: string,
    position: number,
  }[],
  configurable_product_options_selection: {
    configurable_options: {
      attribute_code: string,
      label: string,
      uid: string,
      values: ValueConfigurableOption[],
    }[],
  },
  variants: Variant[],
}

type ResProduct = {
  total_count: number,
  items: Product[],
  aggregations: Aggregation[],
  page_info: {
    page_size: number,
    total_pages: number,
    current_page: number,
  },
  sort_fields: {
    default: string,
    options: {
      label: string,
      value: string,
    }[],
  },
  categories_brands: CategoriesBrands,
  priceRangeFilters: priceRangeFilter,
}

type ImageHadLaBel = {
  url: string,
  label: string,
}

type ValueConfigurableOption = {
  uid: string,
  label: string,
  is_use_default: boolean,
  is_available: boolean,
  swatch: null | any,
}

type Variant = {
  attributes: {
    uid: string,
    code: string,
    abel: string,
    value_index: number,
  }[],
  product: {
    special_price: null | any,
    color: number,
    styrofoam: number,
    size: number,
    warranty: number,
    helmet_lining: number,
    helmet_shell: number,
    helmet_ear_cups: number,
    country_of_manufacture: string,
    daily_sale: null | any,
    rating_summary_start: {
      star_1: number,
      star_2: number,
      star_3: number,
      star_4: number,
      star_5: number,
    },
    attributes: ProductAttributes[],
    price_range: PriceRange,
    sku: string,
    name: string,
    url_key: string,
    image: ImageHadLaBel,
    small_image: ImageHadLaBel,
    thumbnail: {
      url: string,
      position: null,
    },
  },
}

type ProductDetailCategory = {
  name: string,
  url_key: string,
  url_path: string,
  level: number,
  uid: string,
  icon_image: null | string,
  image: null | string,
  path: string,
}

type ProductDetail = {
  uid: string,
  sku: string,
  name: string,
  url_key: string,
  warranty: number,
  size: null | any,
  styrofoam: number,
  __typename: string,
  meta_title: string,
  url_suffix: string,
  helmet_shell: number,
  review_count: number,
  meta_keyword: string,
  helmet_lining: number,
  daily_sale: null | any,
  rating_summary: number,
  helmet_ear_cups: number,
  new_to_date: null | any,
  meta_description: string,
  new_from_date: null | any,
  canonical_url: null | string,
  color: null | string | number,
  country_of_manufacture: string,
  categories: ProductDetailCategory[],
  description: {
    html: string,
  },
  short_description: {
    html: string,
  },
  thumbnail: {
    url: string,
    position: null | number,
  },
  image: {
    url: string,
  },
  media_gallery: {
    disabled: boolean,
    label: null | string,
    url: string,
    position: number,
  }[],
  price_range: PriceRange,
  rating_summary_start: {
    star_1: number,
    star_2: number,
    star_3: number,
    star_4: number,
    star_5: number,
  },
  attributes: ProductAttributes[],
  configurable_options: {
    attribute_code: string,
    position: number,
  }[],
  configurable_product_options_selection: {
    configurable_options: {
      attribute_code: string,
      label: string,
      uid: string,
      values: ValueConfigurableOption[],
    }[],
  },
  variants: Variant[],
  related_products: any,
}

type ResProductDetail = {
  items: ProductDetail[],
  total_count: number,
}

type ResProductDaily = {
  items: {
    end_date: string,
    entity_id: number,
    items: {
      end_date: null | string,
      entity_id: number,
      product: Product,
      product_id: number,
      sale_price: number,
      sale_qty: number,
      saleable_qty: number,
      sold_qty: number,
      start_date: null | string,
    }[],
    priority: string,
    show_in_home: null | string,
    start_date: string,
    status: number,
    title: string,
  }[],
  page_info: {
    current_page: number,
    page_size: number,
    total_pages: number,
  },
  total_count: number,
}
