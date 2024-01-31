import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DiemThi from './components/DiemThi';
import TruongDaiHoc from './components/TruongDaiHoc';
import ChatTuVan from './components/ChatTuVan';
import UniversityDetail from './components/UniversityDetail';
import TuyenSinhDetail from './components/TuyenSinhDetail';
import MajorDetail from './components/MajorDetail';
import DangNhap from './components/DangNhap';
import DangKy from './components/DangKy';
import ResetPassword from './components/ResetPassword';
import "./App.css"
const App = () => {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/dang-nhap' element={<DangNhap />} />
          <Route path='/dang-ky' element={<DangKy />} />
          <Route path="/diem-thi" element={<DiemThi />} />
          <Route path="/truong-dai-hoc" element={<TruongDaiHoc />} />
          <Route path="/chat-tu-van" element={<ChatTuVan />} />
          <Route path="/" element={<DiemThi />} />
          <Route path="/diem-thi/:code" element={<UniversityDetail />} />
          <Route path="/truong-dai-hoc/:name" element={<TuyenSinhDetail />} />
          <Route path='/truong-dai-hoc/:name/chi-tiet-nganh/:major' element={<MajorDetail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
      <ToastContainer />
    </div>

  );
}

export default App;
