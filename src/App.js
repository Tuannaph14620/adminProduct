import React from 'react';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CategoryPage from './pages/category/CategoryPage';
import ColorPage from './pages/color/ColorPage';
import SignIn from './pages/auth/SignIn';
import SizePage from './pages/size/SizePage';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='signin' element={<SignIn />} />
        <Route path='/' element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path='dashboard' />
          <Route path='categorys' element={<CategoryPage />}></Route>
          <Route path='colors' element={<ColorPage />}></Route>
          <Route path='size' element={<SizePage />}></Route>
        </Route>


      </Routes>

    </div>
  );
}

export default App;
