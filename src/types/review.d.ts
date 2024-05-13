type ReviewRating = {
  id: string,
  name: string,
  values: {
    value: string,
    value_id: string,
  }[],
}

type Review = {
  average_rating: number,
  created_at: string,
  nickname: string,
  summary: string,
  text: string,
  ratings_breakdown: {
    name: string,
    value: string,
  }[],
}

type ResReviewProduct = {
  items: Review[],
  page_info?: {
    current_page: number,
    page_size: number,
    total_pages: number,
  },
}
