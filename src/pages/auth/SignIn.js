import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, } from 'react-redux'
import { Login } from '../../features/AuthSlice'
import { InputText } from 'primereact/inputtext'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { signIn } from '../../api/auth'
import { Toast } from 'primereact/toast';
import { Navigate, useNavigate } from 'react-router-dom'
const SignIn = () => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const onSubmit = data => {
    setLoading(true)
    signIn(data).then((res) => {
      if (res) {
        localStorage.setItem('user', JSON.stringify(res.data))
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
        setLoading(false);
        navigate('/')
      }
    })
  }
  return (
    <div className="flex align-items-center justify-content-center">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
          <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/1/1d/Manchester_City_FC_logo.svg/1200px-Manchester_City_FC_logo.svg.png" alt="hyper" height={50} className="mb-3" />
          <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span className="text-600 font-medium line-height-3">Don't have an account?</span>
          <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
            <InputText {...register('email', { required: true })} id="email" type="text" placeholder="Email address" className="w-full mb-3" />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
            <InputText {...register('password', { required: true })} id="password" type="password" placeholder="Password" className="w-full mb-3" />

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                <label htmlFor="rememberme">Remember me</label>
              </div>
              <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
            </div>

            <Button label="Sign In" icon="pi pi-user" className="w-full" />
          </div>
        </form>
      </div>
    </div>
    // <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full space-y-8">
    //     <div>
    //       <img className="mx-auto h-12 w-auto" src="https://res.cloudinary.com/dl8w6p4sf/image/upload/v1644822377/logo_ea3bvi.png" alt="Workflow" />
    //       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
    //       <p className="mt-2 text-center text-sm text-gray-600">
    //         Hoặc
    //         <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500"> Tiếp tục xem mặt hàng yêu thích </a>
    //       </p>
    //     </div>
    //     <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} >
    //       <input type="hidden" name="remember" defaultValue="true" />
    //       <div className="rounded-md shadow-sm -space-y-px">
    //         <div>
    //           <label htmlFor="email-address" className="sr-only">Email address</label>
    //           <input {...register('email', { required: true })} id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" />
    //         </div>
    //         <div>
    //           <label htmlFor="password" className="sr-only">Password</label>
    //           <input {...register('password', { required: true })} id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
    //         </div>
    //       </div>
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center">
    //           <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
    //           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Nhớ tài khoản này! </label>
    //         </div>
    //         <div className="text-sm">
    //           <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500"> Quên mật khẩu? </a>

    //         </div>
    //       </div>
    //       <div className='text-left'><a href="/signup" className="text-sm text-indigo-600 hover:text-indigo-500"> Tôi chưa có tài khoảng! <strong>Đăng ký</strong> </a></div>
    //       <div>
    //         <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
    //           <span className="absolute left-0 inset-y-0 flex items-center pl-3">
    //             {/* Heroicon name: solid/lock-closed */}
    //             <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    //               <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    //             </svg>
    //           </span>
    //           Đăng nhập
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>

  )
}

export default SignIn