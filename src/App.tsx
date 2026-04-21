import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import { navBarArr } from './Components/NavBar/NavItemsData';
import DonutsGallery from './Components/DonutsGallery/DonutsGallery';
import SignUp from './Components/SignUp/SignUp';
import AboutUs from './Components/AboutUs/AboutUs';
import Home from './Components/Home/Home';
import DonutsV from "./Components/Donuts/DonutsV";
import DonutsAdd from "./Components/Donuts/DonutsAdd";
import DonutsUpdate from "./Components/Donuts/DonutsUpdate";
import Login from './Components/SignUp/Login';
import CartPage from './Components/CartPage/CartPage';
import UsersPage from './Components/UsersPage/UsersPage';
import MemberPage from './Components/MemberPage/MemberPage';
import ThankYouPage from './Components/ThankYouPage/ThankYouPage';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import ServerStatusLayer from './Components/ServerStatus/ServerStatusLayer';
import { AdminRoute, MemberRoute, ProtectedRoute, PublicOnlyRoute } from './Components/RouteGuards/RouteGuards';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ServerStatusLayer />
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
