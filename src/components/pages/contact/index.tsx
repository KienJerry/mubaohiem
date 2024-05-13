/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { TextField } from '@/components/inputs/textField'
import { TextArea } from '@/components/inputs/textArea'
import { Checkbox } from '@/components/checkbox'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { FormSelectAntd } from '@/components/select/formSelectAntd'
import addressApi from '@/services/address.queries'
import { contactApi } from '@/services'
import { useQuery, useMutation } from 'react-query'
import { toast } from 'react-toastify'
import React, { useEffect, useState } from 'react'
import homeApi from '@/services/home'
import LoadingData from '@/components/boxLayout/LoadingData'

const ContactPage = () => {
  const [stateMap, setStateMap] = useState<string>('')
  const { control, handleSubmit, reset, setValue } = useForm<any>({
    mode: 'all',
    defaultValues: {
      country: 'VN',
    },
    resolver: yupResolver(schemaValidate),
  })

  const { data: bannerContact } = useQuery<Banner[]>(['banner-contact'], {
    queryFn: async () => {
      return await homeApi
        .getSlider({
          eq: 'banner-contact',
        })
        .then((res: any) => {
          return res?.Slider?.items?.[0]?.Banner?.items
        })
    },
    staleTime: 30000,
  })

  const { isLoading: LoadingInfoStore, data: InforMationStore } = useQuery({
    queryKey: ['getInforMationStore'],
    queryFn: async () => {
      return await contactApi.getInfoMationStore().then((response: any) => {
        if (!!response?.storeAddress) {
          return response?.storeAddress || []
        }
      })
    },
    staleTime: 30000,
  })

  useEffect(() => {
    const firstNonEmptyMaps = InforMationStore?.find(
      (item: any) => item?.maps !== null && item?.maps?.trim() !== ''
    )
    const mapsData = firstNonEmptyMaps ? firstNonEmptyMaps.maps : null
    setStateMap(mapsData)
  }, [InforMationStore])

  const { mutate: SubmitContact, isLoading } = useMutation({
    mutationFn: async (data: any) => {
      return await contactApi.submitContactUs({
        input: {
          firstname: data?.firstname,
          lastname: data?.lastname,
          email: data?.email,
          phone_number: data?.phone_number,
          title: data?.subject,
          description: data?.message,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.contactusFormSubmit) {
        toast.success('Gửi thành công')
        reset()
        setValue('checkbox', false)
      }
    },
    onError: () => { },
  })

  const onSubmitHandler = handleSubmit((value: any) => {
    SubmitContact(value)
  })

  const { data: dataCountries, isFetching: isFetchingCountries } = useQuery({
    queryKey: ['getCountries'],
    queryFn: async () => {
      return await addressApi.getCountries().then((response: any) => {
        return response?.countries || []
      })
    },
  })

  const handleChangeMap = (map: string) => {
    if (!!map) {
      setStateMap(map)
    }
  }

  return (
    <div className="contact-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Liên hệ',
            href: '#',
          },
        ]}
      />

      <section className="contact box-wr bg-white mt-3 wow fadeInUp">
        <h6 className="fsz-18 fw-bold text-uppercase mb-title"> Liên Hệ Tư Vấn Hỗ Trợ </h6>
        <div className="checkout-form">
          <div className="row">
            <div className="col-lg-7">
              <p className="fsz-16 color-666 mb-title">
                Nhập thông tin bạn cần tư vấn, chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
              <form onSubmit={onSubmitHandler} className="form">
                <div className="form-content">
                  <div className="row gx-3">
                    <div className="col-lg-6">
                      <TextField
                        required
                        name="firstname"
                        type="text"
                        placeholder="Nhập họ của bạn"
                        nameLabel="Họ"
                        control={control}
                      />
                    </div>
                    <div className="col-lg-6">
                      <TextField
                        required
                        name="lastname"
                        type="text"
                        placeholder="Nhập tên của bạn"
                        nameLabel="Tên"
                        control={control}
                      />
                    </div>
                    <div className="col-lg-6">
                      <TextField
                        required
                        name="email"
                        type="text"
                        placeholder="Nhập email của bạn"
                        nameLabel="Email"
                        control={control}
                      />
                    </div>
                    <div className="col-lg-6">
                      <TextField
                        name="phone_number"
                        type="text"
                        placeholder="Nhập số điện thoại của bạn"
                        nameLabel="Số điện thoại"
                        control={control}
                      />
                    </div>
                    <div className="col-lg-12">
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormSelectAntd
                            name="country"
                            required
                            error={error}
                            nameLabel="Quốc gia / Khu vực"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input: any, option: any) =>
                              (option?.label ?? '').includes(input)
                            }
                            filterSort={(optionA: any, optionB: any) =>
                              (optionA?.label ?? '')
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            style={{ width: '100%', height: '45px' }}
                            loading={isFetchingCountries}
                            value={value}
                            placeholder="Chọn Quốc gia / Khu vực"
                            options={
                              dataCountries?.length > 0
                                ? dataCountries?.map((val: any) => ({
                                  value: val?.id,
                                  label: val?.full_name_english,
                                }))
                                : []
                            }
                            onChange={(id: any) => {
                              if (id !== value) {
                                onChange(id)
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-lg-12">
                      <TextField
                        required
                        name="subject"
                        type="text"
                        placeholder="Nhập tiêu đề của bạn"
                        nameLabel="Tiêu đề"
                        control={control}
                      />
                    </div>
                    <div className="col-lg-12">
                      <TextArea
                        required
                        name="message"
                        placeholder="Nhập mô tả của bạn"
                        nameLabel="Mô tả"
                        control={control}
                        rows={5}
                      />
                    </div>
                    <div className="col-lg-12">
                      <Checkbox
                        required
                        name="checkbox"
                        type="checkbox"
                        placeholder="Nhập tiêu đề của bạn"
                        control={control}
                        nameLabel="I"
                      />
                    </div>
                    <div className="col-lg-12">
                      <div className="btns mt-15">
                        <ButtonSubmit
                          type="submit"
                          style={{
                            border: 'none',
                            width: '-webkit-fill-available',
                          }}
                          title="Gửi"
                          loading={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-5">
              <div className="contact-info mt-cus mt-lg-0">
                <div className="contact-info-card">
                  {LoadingInfoStore ? (
                    <LoadingData />
                  ) : (
                    InforMationStore?.map((val: any, idx: number) => {
                      return (
                        <React.Fragment key={idx}>
                          <small
                            className={`fsz-12 color-666 text-uppercase mb-title-sm ${idx > 0 ? 'info-store' : ''
                              }`}>
                            {' '}
                            {val?.name}{' '}
                          </small>
                          <ul className="lh-lg contact-info-list">
                            <li onClick={() => handleChangeMap(val?.maps)}>
                              <div className="cls-cursor contact-info-addr">
                                {[val?.street, val?.ward, val?.district, val?.city]
                                  .filter(Boolean)
                                  .join(', ')}
                              </div>
                            </li>
                            <li>
                              <a href="#"> {val?.telephone_1} </a>{' '}
                              {val?.telephone_2 && <a href="#"> - {val?.telephone_2} </a>}
                            </li>
                            <li>
                              <a
                                href={`mailto: ${val?.email}`}
                                className="color-green2 text-decoration-underline contact-info-mail">
                                {' '}
                                {val?.email}{' '}
                              </a>
                            </li>
                          </ul>
                        </React.Fragment>
                      )
                    })
                  )}
                  <div className="social-icons mt-cus ">
                    <a href="https://www.facebook.com/mubaohiemchinhhang.com.vn/">
                      {' '}
                      <FontAwesomeIcon icon={['fab', 'facebook']} />{' '}
                    </a>
                    <a href="https://www.instagram.com/mubaohiemchinhhangvn/">
                      {' '}
                      <FontAwesomeIcon icon={['fab', 'instagram']} />{' '}
                    </a>
                    <a href="https://www.youtube.com/@thegioimubaohiem7307">
                      {' '}
                      <FontAwesomeIcon icon={['fab', 'youtube']} />{' '}
                    </a>
                    <a href="https://www.tiktok.com/@vuamu">
                      {' '}
                      <FontAwesomeIcon icon={['fab', 'tiktok']} />{' '}
                    </a>
                  </div>
                </div>
                <a href={`${bannerContact?.[0]?.link}`} className="img mt-16">
                  <img
                    src={`${bannerContact?.[0]?.media || '/assets/images/inner/contact.png'}`}
                    alt="Banner contact"
                    className="img-cover radius-4"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map box-wr bg-white mt-3 wow fadeInUp mb-3">
        <h6 className="fsz-18 fw-bold text-uppercase mb-title"> TÌM CHÚNG TÔI TRÊN GOOGLE MAP </h6>
        <div className="map-content">
          <div dangerouslySetInnerHTML={{ __html: stateMap }}></div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  firstname: Yup.string().required('Trường này không được bỏ trống'),
  lastname: Yup.string().required('Trường này không được bỏ trống'),
  country: Yup.string().required('Trường này không được bỏ trống'),
  email: Yup.string()
    .required('Trường này không được bỏ trống')
    .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng'),
  phone_number: Yup.string()
    .required('Trường này không được bỏ trống')
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
  subject: Yup.string().required('Trường này không được bỏ trống'),
  message: Yup.string().required('Trường này không được bỏ trống'),
  checkbox: Yup.bool().oneOf([true], 'Bạn chưa chấp nhận Điều khoản & Điều kiện'),
})
