import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import '../css/Navbar.css';
import LOGO from '../img/logoq.png'
import LogoutIcon from '../img/logout.svg';

const Navbar = () => {
    const [userName, setUserName] = useState('');
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const userName = localStorage.getItem('userName');
            const role = localStorage.getItem('role');
            if (token && userName) {
                setUserLoggedIn(true);
                setUserName(userName);
                setIsAdmin(role === 'admin');
            } else {
                setUserLoggedIn(false);
                setUserName('');
                setIsAdmin(false);
            }
        };
        // Gọi hàm checkLoginStatus ngay lập tức để kiểm tra trạng thái đăng nhập
        checkLoginStatus();

        // Lắng nghe sự kiện khi localStorage thay đổi
        window.addEventListener('storage', checkLoginStatus);

        // Gỡ bỏ listener khi component unmount
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);
    const handleLoginClick = () => {
        const currentPath = window.location.pathname;
        navigate('/dang-nhap', { state: { from: currentPath } }); // Chuyển hướng tới trang đăng nhập
    };

    const handleRegisterClick = () => {
        const currentPath = window.location.pathname;
        navigate('/dang-ky', { state: { from: currentPath } }); // Chuyển hướng tới trang đăng ký
    };

    const handleLogout = () => {
        const currentPath = window.location.pathname;
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        localStorage.removeItem('user-email')
        setShowDropdown(!showDropdown)
        setUserLoggedIn(false);
        setUserName('');
        setIsAdmin(false);
        navigate('/truong-dai-hoc');
        window.dispatchEvent(new CustomEvent('user-logged-out'));
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    return (
        <nav className="navbar">
            <img src={LOGO} alt="Logo" className="nav-logo" />
            <ul className="nav-links">
                {!isAdmin && (
                    <>
                        <li><Link to="/diem-thi">Xem Điểm Thi</Link></li>
                        <li><Link to="/truong-dai-hoc">Xem Trường Đại Học</Link></li>
                        <li><Link to="/chat-tu-van">Chat Tư Vấn</Link></li>
                    </>
                )}
                {isAdmin && (
                    <>
                        <li><Link to="/admin">Thêm Thông Tin Trường</Link></li>
                        <li><Link to="/quan-ly-tu-van">Quản Lý Tư Vấn</Link></li>
                        <li><Link to="/manage-universities">Quản Lý Trường Học</Link></li>
                    </>
                )}
            </ul>
            <div className="auth-links">
                {userLoggedIn ? (
                    <div className="user-info-dropdown">
                        <button className="dropdown-toggle" onClick={toggleDropdown}>
                            Chào {userName} {notificationCount > 0 && `(${notificationCount})`}
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <Link to="/quan-ly-tai-khoan" className="dropdown-item" onClick={toggleDropdown}>Quản lý tài khoản</Link>
                                <div className="logout-icon" onClick={handleLogout}>
                                    <img src={LogoutIcon} alt="Logout" />
                                    <span className='text-logout'>Đăng xuất</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={handleLoginClick}>Đăng nhập</button>
                        <button onClick={handleRegisterClick}>Đăng ký</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
