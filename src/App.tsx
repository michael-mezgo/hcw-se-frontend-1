import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import SingleCar from "./pages/SingleCar";
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminCreateUser from './pages/admin/AdminCreateUser'
import AdminCars from './pages/admin/AdminCars'
import AdminCreateCar from './pages/admin/AdminCreateCar'
import AdminCarDetail from './pages/admin/AdminCarDetail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin area – own layout, no main Navbar */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminCreateUser />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="cars/new" element={<AdminCreateCar />} />
            <Route path="cars/:id" element={<AdminCarDetail />} />
          </Route>

          {/* Public area – shared Navbar layout */}
          <Route
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cars" element={<Booking />} />
                  <Route path="/cars/:id" element={<SingleCar />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Booking />} />
            <Route path="/cars/:id" element={<SingleCar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
