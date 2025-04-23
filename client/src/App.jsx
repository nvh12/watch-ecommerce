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
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  )
}

export default App;
