import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../css/ResetPass.css"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}api/v1/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });
            if (response.ok) {
                toast.success("Mật khẩu đã được đặt lại");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.");
            }
        } catch (error) {
            toast.error("Lỗi khi gửi yêu cầu: " + error.message);
        }
    };

    return (
        <div className='reset-password-container'>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit">Đặt Lại Mật Khẩu</button>
            </form>
        </div>
    );
};

export default ResetPassword;
