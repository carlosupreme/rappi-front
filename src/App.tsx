import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import BusinessDetail from './pages/BusinessDetail'
import Orders, { OrderDetail } from './pages/Orders'
import RegisterBusiness from './pages/RegisterBusiness'
import AddProduct from './pages/AddProduct'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/register/business" element={<RegisterBusiness />} />
          <Route path="/business/:id/add-product" element={<AddProduct />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
