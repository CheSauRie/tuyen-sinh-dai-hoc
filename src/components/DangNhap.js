import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import '../css/DangNhap.css';
Modal.setAppElement('#root');
const DangNhap = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
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

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2000/api/v1/user/request-reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: resetEmail })
            });
            if (response.ok) {
                toast.success("Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.");
            }
        } catch (error) {
            toast.error("Lỗi khi gửi yêu cầu: " + error.message);
        } finally {
            closeModal();
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
                <button type="button" className="quen-mk-btn" onClick={openModal}>
                    Quên Mật Khẩu?
                </button>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal Quên Mật Khẩu"
                className="modal-quen-mk"
                overlayClassName="overlay"
            >
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                <h2>Quên Mật Khẩu</h2>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <button type="submit">Gửi Yêu Cầu</button>
                </form>
            </Modal>
        </div>
    );
};

export default DangNhap;
