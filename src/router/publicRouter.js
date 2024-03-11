import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Login from '../containers/login'
import App from '../app/index'
import Signup from '../containers/signup'

const PublicRouter = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="*" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default PublicRouter