import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import React from 'react'
import { useNavigate } from 'react-router-dom';
const HeaderIndex = () => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.removeItem('user')
    navigate('/signin')
  }
  const items = [
    {
      label: 'Products',
      icon: 'pi pi-book',
      command: (event) => {
        navigate('/products')
      },
    },
    {
      label: 'Categorys',
      icon: 'pi pi-book',
      command: (event) => {
        navigate('/categorys')
      },
    },
    {
      label: 'Vouchers',
      command: (event) => {
        navigate('/vouchers')
      },
    },
    {
      label: 'Thuộc tính',
      icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: 'Màu sắc',
          command: (event) => {
            navigate('/colors')
          },
        },
        {
          label: 'Kích cỡ',
          command: (event) => {
            navigate('/size')
          },
        },
        {
          label: 'Nguyên liệu',
          command: (event) => {
            navigate('/material')
          },
        }


      ]
    },
    {
      label: 'Tài khoản',
      icon: 'pi pi-user',
      command: (event) => {
        navigate('/users')
      },
    },
    {
      label: 'Đơn hàng',
      icon: 'pi pi-truck',
      command: (event) => {
        navigate('/orders')
      },
    },
    {
      label: 'Đăng xuất',
      icon: 'pi pi-fw pi-power-off',
      command: (event) => {
        Logout()
      },
    }
  ];

  const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
  const end = <InputText placeholder="Search" type="text" className="w-full" />;

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  )
}

export default HeaderIndex