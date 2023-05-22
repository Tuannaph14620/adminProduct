import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderIndex from './headerIndex'
const AdminLayout = () => {
  return (
    <div>
      <header>
        <HeaderIndex />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
      </footer>
    </div>
  )
}

export default AdminLayout