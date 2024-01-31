import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; // Đảm bảo đường dẫn đến file CSS đúng
import LOGO from '../img/logo-q.png'
import { ReactComponent as LogoutIcon } from '../img/logout.svg';
const Navbar = () => {
    const [userName, setUserName] = useState('');
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const userName = localStorage.getItem('userName');
            if (token && userName) {
                setUserLoggedIn(true);
                setUserName(userName);
            } else {
                setUserLoggedIn(false);
                setUserName('');
            }
        };

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
        setUserLoggedIn(false);
        setUserName('');
        navigate(currentPath); // Hoặc chuyển hướng đến trang bạn muốn sau khi đăng xuất
    };
    return (
        <nav className="navbar">
            <img src={LOGO} alt="Logo" className="nav-logo" />
            {/* <h1 className='nav-title'>Tư vấn tuyển sinh</h1> */}
            <ul className="nav-links">
                <li><Link to="/diem-thi">Xem Điểm Thi</Link></li>
                <li><Link to="/truong-dai-hoc">Xem Trường Đại Học</Link></li>
                <li><Link to="/chat-tu-van">Chat Tư Vấn</Link></li>
            </ul>
            <div className="auth-links">
                {userLoggedIn ? (
                    <>
                        <p>Chào {userName}</p>
                        <button onClick={handleLogout} className="logout-button">
                            <LogoutIcon />
                        </button>
                    </>
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
