import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import { Register, Login } from './pages/Authen';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/browse' element={<Browse />} />
          <Route path='/authen/login' element={<Login />} />
          <Route path='/authen/register' element={<Register />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
