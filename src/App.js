import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CategoryPage from './pages/category/CategoryPage';
import ColorPage from './pages/color/ColorPage';
import SignIn from './pages/auth/SignIn';
import SizePage from './pages/size/SizePage';
import MaterialPage from './pages/material/MaterialPage';
import VoucherPage from './pages/voucher/VoucherPage';
import PrivateRouter from './layouts/PrivateRouter';
import ProductPage from './pages/products/ProductPage';
import DeatailProductPage from './pages/products/DetailProductPage';
import UserPage from './pages/users/UserPage';
import OrderPage from './pages/order/OrderPage';
import OrderManager from './pages/order/OrderManager';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='signin' element={<SignIn />} />
        <Route path='/' element={<PrivateRouter><AdminLayout /></PrivateRouter>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path='dashboard' />
          <Route path='products' element={<ProductPage />}></Route>
          <Route path='products/:id' element={<DeatailProductPage />}></Route>
          <Route path='categorys' element={<CategoryPage />}></Route>
          <Route path='colors' element={<ColorPage />}></Route>
          <Route path='size' element={<SizePage />}></Route>
          <Route path='material' element={<MaterialPage />}></Route>
          <Route path='vouchers' element={<VoucherPage />}></Route>
          <Route path='users' element={<UserPage />}></Route>
          <Route path='orders' element={<OrderManager />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
