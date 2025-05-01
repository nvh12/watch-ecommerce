import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';

import Home from './pages/Home';
import Browse from './pages/Browse';
import Product from './pages/Product';
import { Register, Login } from './pages/Authen';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { User, UserOrder } from './pages/User';
import Admin from './pages/Admin';
import { ProductList, ManageProduct, CreateProduct } from './pages/AdminProduct';
import { OrderList, ManageOrder } from './pages/AdminOrder';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/browse' element={<Browse />} />
              <Route path='/search' element={<Browse />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/auth/login' element={<Login />} />
              <Route path='/auth/register' element={<Register />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/cart/checkout' element={<Checkout />} />
              <Route path='/user' element={<User />} />
              <Route path='/user/order/:id' element={<UserOrder />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/admin/product' element={<ProductList />} />
              <Route path='/admin/product/:id' element={<ManageProduct />} />
              <Route path='/admin/product/create' element={<CreateProduct />} />
              <Route path='/admin/order' element={<OrderList />} />
              <Route path='/admin/order/:id' element={<ManageOrder />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  )
}

export default App;
