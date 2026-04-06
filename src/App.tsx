//import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import { navBarArr } from './Components/NavBar/NavItemsData';
import DonutsGallery from './Components/DonutsGallery/DonutsGallery';
//import TempComponent from './Components/AboutUs/AboutUs';
import SignUp from './Components/SignUp/SignUp';
import AboutUs from './Components/AboutUs/AboutUs';
import Home from './Components/Home/Home';
import DonutsV from "./Components/Donuts/DonutsV";
import DonutsAdd from "./Components/Donuts/DonutsAdd";
import DonutsUpdate from "./Components/Donuts/DonutsUpdate";
import Login from './Components/SignUp/Login';
import { ReactElement, useLayoutEffect } from 'react';
import CartPage from './Components/CartPage/CartPage';
import UsersPage from './Components/UsersPage/UsersPage';
import MemberPage from './Components/MemberPage/MemberPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ThankYouPage from './Components/ThankYouPage/ThankYouPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function useAuthSnapshot() {
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    role: string;
  }>({
    isLoading: true,
    isAuthenticated: false,
    role: ''
  });

  const { pathname } = useLocation();

  useEffect(() => {
    let isMounted = true;

    axios.defaults.withCredentials = true;

    async function loadAuthState() {
      try {
        const res = await axios.get('http://localhost:8800/me');

        if (!isMounted) {
          return;
        }

        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          role: res.data.role || 'user'
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          role: ''
        });
      }
    }

    loadAuthState();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return authState;
}

function PublicOnlyRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated, role } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/donutsv' : '/my-perks'} replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated, role } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/my-perks" replace />;
  }

  return children;
}

function MemberRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isLoading, isAuthenticated } = useAuthSnapshot();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <NavBar items={navBarArr} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/donutsv' element={<AdminRoute><DonutsV /></AdminRoute>} />
          <Route path='/donutsadd' element={<AdminRoute><DonutsAdd /></AdminRoute>} />
          <Route path='/donutsupdate/:id' element={<AdminRoute><DonutsUpdate /></AdminRoute>} />
          <Route path='/donuts' element={<DonutsGallery />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/signup' element={<PublicOnlyRoute><SignUp /></PublicOnlyRoute>} />
          <Route path='/login' element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/users' element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path='/my-perks' element={<MemberRoute><MemberPage /></MemberRoute>} />
          <Route path='/thank-you' element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
