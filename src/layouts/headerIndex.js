import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react'
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { myProfile, updateProfile } from '../api/user';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { RadioButton } from 'primereact/radiobutton';
const HeaderIndex = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const dt = useRef(null);
  const [errors, setErrors] = useState({ field: "" });
  const [onEdit, setOnEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profileOb, setProfileOb] = useState(null);
  const menuLeft = useRef(null);
  useEffect(() => {
    searchAll();
  }, []);

  const searchAll = () => {
    myProfile().then((res) => {
      const _data = res?.data;
      setProfileOb(_data);
    });
  };
  const onSubmit = () => {
    if (!validate()) {
      return;
    }
    setErrors({ field: '' })
    updateProfile(profileOb).then((res) => {
      if (res) {
        searchAll();
        setVisible(false)
        setOnEdit(false)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 3000 });
      }
    })
  }

  const Logout = () => {
    localStorage.removeItem('user')
    navigate('/signin')
  }
  const items = [
    {
      label: 'Trang chủ',
      icon: 'pi pi-home',
      command: (event) => {
        navigate('/')
      },
    },
    {
      label: 'Sản phẩm',
      command: (event) => {
        navigate('/products')
      },
    },
    {
      label: 'Danh mục sản phẩm',
      command: (event) => {
        navigate('/categorys')
      },
    },
    {
      label: 'Khuyến mãi',
      command: (event) => {
        navigate('/vouchers')
      },
    },
    {
      label: 'Thuộc tính',
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
      label: 'Bán hàng tại quầy',
      icon: 'pi pi-shopping-cart',
      command: (event) => {
        navigate('/shop')
      },
    }
  ];

  const profile = [
    {
      label: 'Thông tin tài khoản',
      icon: 'pi pi-user',
      command: (event) => {
        setVisible(true);
      },
    },
    {
      label: 'Đăng xuất',
      icon: 'pi pi-fw pi-power-off',
      command: (event) => {
        Logout()
      },
    }
  ]
  // const nameAvatar = () => {
  //   const _nameAvatar = profileOb?.firstName.split(' ')
  //   const confirmName = `${_nameAvatar[0] ? _nameAvatar[0].toString?.charAt(0) : ''}${_nameAvatar[1] ? _nameAvatar[1]?.charAt(0) : ''}`
  //   console.log(confirmName);
  //   return confirmName
  // }
  const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
  const end = <Avatar label={"TN"} shape="circle" size="large" className='m-2' style={{ backgroundColor: '#2196F3', color: '#ffffff', fontWeight: "bold" }} onClick={(event) => menuLeft.current.toggle(event)} />
  // <Button label="Show Left" icon="pi pi-align-left" className="mr-2" onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup />

  const validate = () => {
    const _dataTable = { ...profileOb };
    const _error = { ...errors };
    if (!_dataTable.firstName) {
      _error.field = 'firstName';
      toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên người dùng', life: 3000 });
      setErrors(_error);
      return false;
    }
    if (!_dataTable.lastName) {
      _error.field = 'lastName';
      toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập họ người dùng', life: 3000 });
      setErrors(_error);
      return false;
    }
    if (!_dataTable.email) {
      _error.field = 'email';
      toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập email', life: 3000 });
      setErrors(_error);
      return false;
    }
    if (!_dataTable.phone) {
      _error.field = 'phone';
      toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số điện thoại', life: 3000 });
      setErrors(_error);
      return false;
    }
    return true;
  }
  const setRowData = (value, field) => {
    const table = { ...profileOb };
    switch (field) {
      default: {
        setErrors({ field: "" });
        table[field] = value;
      }
    }
    setProfileOb(table);
  };
  return (
    <div className="card">
      <Toast ref={toast} />
      <Menu model={profile} popup ref={menuLeft} id="popup_menu_left" />
      <Menubar model={items} start={start} end={end} />
      <Dialog header="Thông tin tài khoản" visible={visible} style={{ width: '30vw' }} modal className="p-fluid" onHide={() => {
        setVisible(false);
        setOnEdit(false);
        searchAll();
      }}>
        <div className="field">
          <label className='mr-2' htmlFor="firstName">Tên người dùng</label>
          <InputText
            disabled={!onEdit}
            value={profileOb?.firstName}
            onChange={(event) => setRowData(event.target.value, "firstName")}
            className={classNames({
              "p-invalid": errors.field === 'firstName'
            })}
            id="firstName" />
        </div>
        <div className="field">
          <label className='mr-2' htmlFor="lastName">Họ đệm người dùng</label>
          <InputText
            disabled={!onEdit}
            value={profileOb?.lastName}
            onChange={(event) => setRowData(event.target.value, "lastName")}
            className={classNames({
              "p-invalid": errors.field === 'lastName'
            })}
            id="lastName" />
        </div>
        <div className="field">
          <label className='mr-2' htmlFor="email">Email</label>
          <InputText
            disabled={!onEdit}
            value={profileOb?.email}
            onChange={(event) => setRowData(event.target.value, "email")}
            className={classNames({
              "p-invalid": errors.field === 'email'
            })}
            id="email" />
        </div>
        <div className="field">
          <label className='mr-2' htmlFor="phone">Số điện thoại</label>
          <InputText
            disabled={!onEdit}
            value={profileOb?.phone}
            onChange={(event) => setRowData(event.target.value, "phone")}
            className={classNames({
              "p-invalid": errors.field === 'phone'
            })}
            id="phone" />
        </div>
        <div className="grid formgrid p-fluid fluid mb-2">
          <div className="col-12 flex gap-8 align-items-center">
            <div >
              <span className="">
                <RadioButton
                  inputId="city1"
                  name="city"
                  disabled={!onEdit}
                  onChange={() => setRowData(true, "gender")}
                  checked={profileOb?.gender === true}
                  className={classNames({ 'p-invalid': errors.field === 'gender' })}
                />
                <label className='ml-2' htmlFor="city1">Nữ</label>
              </span>
            </div>
            <div >
              <span className="">
                <RadioButton
                  inputId="city1"
                  disabled={!onEdit}
                  name="city"
                  onChange={() => setRowData(false, "gender")}
                  checked={profileOb?.gender === false}
                  className={classNames({ 'p-invalid': errors.field === 'gender' })}
                />
                <label className='ml-2' htmlFor="city1">Nam</label>
              </span>
            </div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="dob">Ngày sinh</label>
          <Calendar
            disabled={!onEdit}
            value={new Date(profileOb?.dob)}
            onChange={(event) => setRowData(event.value, "dob")}
            showIcon
            placeholder="dd/mm/yyyy"
            className={classNames({ 'p-invalid': errors.field === 'dob' })}
          />
        </div>
        <div className='flex align-items-center justify-content-center'>
          <Button style={{ display: !onEdit ? 'block' : 'none' }} label="Sửa thông tin" type='reset' icon="pi pi-pencil" text onClick={() => setOnEdit(true)} />
          <Button style={{ display: onEdit ? 'block' : 'none' }} label="Cancel" type='reset' icon="pi pi-times" text onClick={() => {
            setOnEdit(false)
            searchAll();
          }} />
          <Button style={{ display: onEdit ? 'block' : 'none' }} label="Save" type='submit' icon="pi pi-check" onClick={() => onSubmit()} />
        </div>
      </Dialog>
    </div>
  )
}

export default HeaderIndex