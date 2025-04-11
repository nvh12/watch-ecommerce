import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Product from './pages/Product';
import { Register, Login } from './pages/Authen';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/browse' element={<Browse />} />
            <Route path='/search' element={<Browse />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/authen/login' element={<Login />} />
            <Route path='/authen/register' element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
