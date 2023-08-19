import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { signIn } from '../../api/auth'
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom'
const SignIn = () => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const onSubmit = async data => {
    setLoading(true)
    await signIn(data).then((res) => {
      try {
        if (res.status == 200) {
          localStorage.setItem('user', JSON.stringify(res.data))
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Đâng nhập thành công', life: 3000 });
          setLoading(false);
          setTimeout(() => {
            navigate('/')
          }, 1000);
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Successful', detail: 'Đâng nhập thất bại, vui lòng thử lại', life: 3000 });
        setLoading(false);
      }
    })
  }
  return (
    <div className="flex align-items-center justify-content-center">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img src="https://firebasestorage.googleapis.com/v0/b/upload-image-d5f7e.appspot.com/o/images%2FUntitled-2.png?alt=media&token=1aa0e1e8-714f-4087-834c-118eeb91b97e" alt="hyper" height={50} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Chào mừng trở lại</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
            <InputText {...register('email', { required: true })} id="email" type="text" placeholder="Email" className="w-full mb-3" />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Mật khẩu</label>
            <InputText {...register('password', { required: true })} id="password" type="password" placeholder="Mật khẩu" className="w-full mb-3" />

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                <label htmlFor="rememberme">Nhớ tôi</label>
              </div>
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Quên mật khẩu?</a>
            </div>

            <Button label="Đăng nhập" icon="pi pi-user" className="w-full" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn