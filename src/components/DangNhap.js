import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/DangNhap.css';

const DangNhap = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:2000/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                // Lưu JWT token vào localStorage hoặc cách lưu trữ khác
                console.log("Đăng nhập thành công");
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.userName);
                window.dispatchEvent(new Event('storage'));
                // Chuyển hướng người dùng
                const locationState = location.state || {};
                const redirectTo = locationState.from || '/';
                toast.success("Đăng nhập thành công");
                navigate(redirectTo);

            } else {
                // Xử lý lỗi đăng nhập
                toast.error("Đăng nhập thất bại: Kiểm tra lại tài khoản và mật khẩu");
                console.error('Đăng nhập thất bại:', data.message);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API đăng nhập:', error);
        }
    };

    return (
        <div className="dang-nhap-container">
            <form onSubmit={handleSubmit}>
                <h2>Đăng Nhập</h2>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default DangNhap;
