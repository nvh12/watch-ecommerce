import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Browse from './pages/Browse';
import Layout from './layouts/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
