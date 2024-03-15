import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../css/DangKy.css"

const DangKy = () => {
    const [email, setEmail] = useState('');
    const [name, setname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            const response = await fetch(`${baseURL}api/v1/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username: name, password }),
            });

            const data = await response.json();

            if (data) {
                toast.success("Đăng ký thành công!");
                navigate('/dang-nhap');
            } else {
                toast.error(`Đăng ký thất bại: ${data.message}`);
            }
        } catch (error) {
            toast.error(`Đăng ký thất bại: ${error.message}`);
        }
    };

    return (
        <div className="dang-ky-container">
            <form onSubmit={handleSubmit}>
                <h2>Đăng Ký</h2>

                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Đăng Ký</button>
            </form>
        </div>
    );
};

export default DangKy;
