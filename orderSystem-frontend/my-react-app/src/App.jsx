// src/App.jsx
import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext'; // 确保路径正确
import LoginPage from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import PermissionSettings from './pages/PermissionSettings';
import UserManagement from './pages/UserManagement';
import OrderManagement from './pages/OrderManagement';
import CustomerManagement from './pages/CustomerManagement';
import {getAccessToken, getRefreshToken} from "./utils/storage.js";

const PrivateRoute = ({ children }) => {
    return getAccessToken() && getRefreshToken() ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        // ThemeProvider 必须在最外层
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Home />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="customers" element={<CustomerManagement />} />
                        <Route path="system/permissions" element={<PermissionSettings />} />
                        <Route path="system/users" element={<UserManagement />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;