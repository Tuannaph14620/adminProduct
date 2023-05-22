import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import React from 'react'
import { useNavigate } from 'react-router-dom';
const HeaderIndex = () => {
  const navigate = useNavigate();
  const items = [
    {
      label: 'Products',
      icon: 'pi pi-book',
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
        }

      ]
    },
    {
      label: 'Users',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',

        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-user-minus',

        },
        {
          label: 'Search',
          icon: 'pi pi-fw pi-users',
          items: [
            {
              label: 'Filter',
              icon: 'pi pi-fw pi-filter',
              items: [
                {
                  label: 'Print',
                  icon: 'pi pi-fw pi-print'
                }
              ]
            },
            {
              icon: 'pi pi-fw pi-bars',
              label: 'List'
            }
          ]
        }
      ]
    },
    {
      label: 'Events',
      icon: 'pi pi-fw pi-calendar',
      items: [
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
            {
              label: 'Save',
              icon: 'pi pi-fw pi-calendar-plus'
            },
            {
              label: 'Delete',
              icon: 'pi pi-fw pi-calendar-minus'
            }
          ]
        },
        {
          label: 'Archive',
          icon: 'pi pi-fw pi-calendar-times',
          items: [
            {
              label: 'Remove',
              icon: 'pi pi-fw pi-calendar-minus'
            }
          ]
        }
      ]
    },
    {
      label: 'Quit',
      icon: 'pi pi-fw pi-power-off'
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