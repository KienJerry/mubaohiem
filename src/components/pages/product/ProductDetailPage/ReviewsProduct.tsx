/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'

import * as Yup from 'yup'
import { Rate } from 'antd'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

import { useMutation } from 'react-query'
import { TextField } from '@/components/inputs'
import { Spinner } from '@/components/spinner'
import { yupResolver } from '@hookform/resolvers/yup'

import reviewAPI, { CreateReviewInput, RatingSelected } from '@/services/review'

type ReviewsProduct = {
  sku: string,
  dataReviewRatings: ReviewRating[],
  dataReviewProduct: ResReviewProduct,
  customerInfo: ResCustomer | undefined,
  onRefetch?: () => void,
}

const ReviewsProduct: FC<ReviewsProduct> = ({
  sku,
  customerInfo,
  dataReviewRatings,
  dataReviewProduct,
  onRefetch,
}) => {
  const [ratingSelected, setRatingSelected] = useState<(RatingSelected & { value: number })[]>([])

  const isHaveReview = !!dataReviewProduct?.items?.length

  const { control, register, handleSubmit, watch, reset } = useForm<any>({
    mode: 'all',
    defaultValues: {
      nickname: !!customerInfo ? `${customerInfo?.lastname} ${customerInfo?.firstname}` : '',
    },
    resolver: yupResolver(schemaValidate),
  })

  const { mutate: mutateCreateReview, isLoading } = useMutation({
    mutationFn: async (variable: CreateReviewInput) => {
      return await reviewAPI.createReview(variable)
    },
    onSuccess: (data: any) => {
      if (!data) {
        toast.error('Lỗi! Đã có lỗi xảy ra, vui là thử lai.')
        return data
      }

      toast.success('Thành công! Đánh giá của bạn đã được ghi nhận.')
      reset(
        !!customerInfo
          ? {
              review: '',
            }
          : {
              nickname: '',
              review: '',
            }
      )
      setRatingSelected([])

      onRefetch?.()
      return data
    },
  })

  const handlerOnSubmit = handleSubmit((formValues) => {
    mutateCreateReview({
      input: {
        sku: sku,
        nickname: formValues?.nickname,
        text: formValues?.review,
        summary: formValues?.review,
        ratings: ratingSelected?.map((val) => ({ id: val?.id, value_id: val?.value_id })) || [],
      },
    })
  })

  const handleSelectRating = (indexRating: number, rating: ReviewRating) => {
    if (indexRating === 0) {
      const listRatingSelected = ratingSelected?.filter((val) => val?.id !== rating?.id)
      return setRatingSelected(listRatingSelected)
    }

    const _ratingSelected = ratingSelected?.filter((val) => val?.id === rating?.id)
    if (_ratingSelected?.length === 0) {
      return setRatingSelected([
        ...ratingSelected,
        {
          id: rating?.id,
          value_id: rating?.values?.[indexRating - 1]?.value_id || '',
          value: indexRating,
        },
      ])
    }

    const listRatingSelected = ratingSelected?.map((val) => {
      if (val?.id === rating?.id) {
        return {
          id: rating?.id,
          value_id: rating?.values?.[indexRating - 1]?.value_id || '',
          value: indexRating,
        }
      }

      return val
    })

    setRatingSelected(listRatingSelected)
  }

  const renderListRating = () => {
    return dataReviewRatings?.map((rating) => {
      const _currentRating: any = ratingSelected?.filter((val) => val?.id === rating?.id)?.[0] ?? {}

      return (
        <div key={rating?.id} className="mb-2">
          <p className="mb-0 fw-bold">{rating?.name}</p>
          <Rate
            onChange={(indexRating) => handleSelectRating(indexRating, rating)}
            value={_currentRating?.value}
          />
        </div>
      )
    })
  }

  const renderReviews = () => {
    if (!isHaveReview || !dataReviewProduct) return null

    return (
      <div className="col-lg-7">
        <div className="reviews-content pt-30">
          <h5 className="color-000 mb-40 text-capitalize">
            {dataReviewProduct?.items?.length} đánh giá
          </h5>
          <div className="box-show-review">
            {dataReviewProduct?.items?.map((review, index) => {
              return <Review key={review?.created_at + index} data={review} />
            })}
          </div>
        </div>
      </div>
    )
  }

  const isDisabledBtnSubmit = !watch('nickname') || !watch('review') || !ratingSelected?.length

  return (
    <div className="tab-pane fade show active MN-review" id="pills-tab3">
      <div className="product-reviews p-4 radius-5 bg-light">
        <div className="row gx-5 justify-content-center">
          {renderReviews()}
          <div className="col-lg-5">
            <form className="comment-form d-block pt-30 MN-form-review" onSubmit={handlerOnSubmit}>
              <h5 className="color-000 mb-40 text-capitalize"> Viết đánh giá của bạn</h5>
              <div className="row">
                <div className="col-lg-12">
                  {/* <p className="text-uppercase mb-1">đánh giá của bạn</p> */}

                  {renderListRating()}
                </div>
                <div className="col-lg-12 mt-30">
                  <div className="form-group mb-4 mb-lg-0">
                    <TextField
                      name="nickname"
                      type="text"
                      className="form-control"
                      nameLabel="Họ và tên"
                      placeholder="Nhập họ và tên của bạn"
                      required
                      control={control}
                      disabled={!!customerInfo}
                    />
                  </div>
                </div>
                {/* <div className="col-lg-6 mt-30">
                  <div className="form-group">
                    <TextField
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Nhập email của bạn"
                      nameLabel="Email"
                      control={control}
                      required
                      disabled={!!customerInfo}
                    />
                  </div>
                </div> */}

                <div className="col-lg-12">
                  <div className="form-group">
                    <textarea
                      {...register('review')}
                      className="form-control"
                      rows={6}
                      placeholder="Viết đánh giá của bạn ở đây"></textarea>
                  </div>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    disabled={isDisabledBtnSubmit || isLoading}
                    className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-30 w-100 py-3 none-border">
                    <span className="text-white">{isLoading ? <Spinner /> : 'Gửi đánh giá'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsProduct

const EMPTY_FIELD = 'Trường này không được bỏ trống'

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  nickname: Yup.string().required(EMPTY_FIELD),
  // email: Yup.string()
  //   .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
  //   .required(EMPTY_FIELD),
  review: Yup.string().required(EMPTY_FIELD),
})

const Review: FC<{ data: Review }> = ({ data }) => {
  return (
    <div className="comment-replay-cont py-5 px-4 mb-20 bg-white radius-5 review-box">
      <div className="d-flex comment-cont">
        <div className="icon-60 rounded-circle overflow-hidden me-3 flex-shrink-0">
          <img src="/assets/images/logo.png" alt="" className="img-cover" />
        </div>
        <div className="inf">
          <div className="title d-flex justify-content-between gap-2">
            <h6 className="fw-bold">{data?.nickname}</h6>
            <div className="time  text-uppercase d-inline-block">
              <div className="rate">
                <Rate disabled allowHalf defaultValue={(data?.average_rating / 100) * 5} />
              </div>
            </div>
          </div>
          <div className="text color-000  mt-10">{data?.text}</div>
        </div>
      </div>
    </div>
  )
}
