import Link from 'next/link'
import { useState } from 'react'
import { useForm, useController } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
// import { ButtonSubmit } from '@/components/button/btnSubmit'
import { blogApi } from '@/services'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Image from 'next/image'

function PageTabMenu() {
  const [menuTab, setMenuTab] = useState(0)
  const { control, handleSubmit, reset } = useForm<any>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
  } = useController({ name: 'email', control: control, defaultValue: null })

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await blogApi.createSubscribe({
        email: data?.email,
      })
    },
    onSuccess: (response: any) => {
      if (!!response?.subscribeEmailToNewsletter) {
        toast.success('Đăng ký nhận bài viết thành công')
        reset()
      }
    },
    onError: () => { },
  })

  const onSubmitHandler = handleSubmit((value) => {
    mutate(value)
  })

  const handleMenutab = (type: number) => {
    setMenuTab(type)
  }
  return (
    <div className="wtabs-1">
      <div className="menu-tabs">
        <div className={`menu-tab ${menuTab == 0 && 'active'}`} onClick={() => handleMenutab(0)}>
          Đăng ký nhận bài viết
        </div>
        <div className={`menu-tab ${menuTab == 1 && 'active'}`} onClick={() => handleMenutab(1)}>
          Fanpage
        </div>
      </div>
      <div className="content-tabs">
        {menuTab == 0 && (
          <>
            <form onSubmit={onSubmitHandler} className="content-tab">
              <div style={{ flex: `auto` }}>
                <div style={{ position: 'relative' }}>
                  <input
                    name="email"
                    className={`text-field ${error ? 'input-error' : ''}`}
                    placeholder="Nhập email để đăng ký nhận bài viết"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || ''}
                    ref={ref}
                    required
                    type="text"
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit-img">
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </form>
            {error && <div className="txt-form-err">{error?.message || 'Trường này không được bỏ trống'}</div>}
          </>
        )}
        {menuTab == 1 && (
          <div className="blog-item-social">
            <Link href={'https://www.facebook.com/mubaohiemchinhhang.com.vn/'} target="_blank">
              <Image fill src="/assets/images/socials/social-fb.svg" alt="Facebook" />
            </Link>
            <Link href={'https://www.youtube.com/@thegioimubaohiem7307'} target="_blank">
              <Image fill src="/assets/images/socials/social-yt.svg" alt="Youtube" />
            </Link>
            <Link href={'https://www.instagram.com/mubaohiemchinhhangvn/'} target="_blank">
              <Image fill src="/assets/images/socials/social-Instagram.png" alt="Instagram" />
            </Link>
            <Link href={'https://www.tiktok.com/@vuamu'} target="_blank">
              <Image fill src="/assets/images/socials/social-tiktok.png" alt="Tiktok" />
            </Link>
            {/* <Link href={'/'} target="_blank">
              <img src="/assets/images/socials/social-link.svg" alt="LinkedIn" />
            </Link> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageTabMenu

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  email: Yup.string()
    .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
    .required('Trường này không được bỏ trống'),
})
