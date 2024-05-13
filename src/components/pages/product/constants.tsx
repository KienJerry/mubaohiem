export const PAGE_SIZE = 20
export const TWO_ITEMS = 2
export const FOUR_ITEMS = 4
export const MAX_POPULAR_ITEMS = 5

export const EMPTY_ITEM = 0;

export const CONFIGURABLE_PRODUCT = 'ConfigurableProduct'
export const SIMPLE_PRODUCT = "SimpleProduct"

export const ATTRIBUTE_CODE = {
  COLOR: 'color'
};

export const TYPE_COLOR_SWATCH = {
  TEXT: "TextSwatchData",
  IMAGE: "ImageSwatchData",
  COLOR: "ColorSwatchData"
}

export const FILTER_ATTRIBUTE_SKIP: string[] = ["price"];

export const handleSortAggregations = (aggregations:  Aggregation[]) => {
  const aggregationsWithPosition = aggregations.filter(
    (aggregation) => aggregation.position !== null
  )
  const aggregationsWithoutPosition = aggregations.filter(
    (aggregation) => aggregation.position === null
  )

  const sortAggregations = [
    ...aggregationsWithPosition.sort((a, b) => b.position! - a.position!),
    ...aggregationsWithoutPosition,
  ]

  return sortAggregations
}
