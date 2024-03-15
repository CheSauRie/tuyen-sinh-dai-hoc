import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/UserAccount.css';
import User from "../img/user.png"
import { format } from 'date-fns';
import { toast } from 'react-toastify';
const UserAccount = () => {
    const [activeTab, setActiveTab] = useState('interests');
    const [followedUniversities, setFollowedUniversities] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const formRef = useRef();
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const handleUniversityClick = (uniCode) => {
        navigate(`/truong-dai-hoc/${uniCode}`); // Navigate to the university page
    };

    useEffect(() => {
        if (activeTab === 'interests') {
            fetchFollowedUniversities();
        } else if (activeTab === 'applications') {
            fetchConsultations();
        }
    }, [activeTab]);


    const fetchFollowedUniversities = async () => {
        try {
            const response = await fetch(`${baseURL}api/v1/user/follow`, {
                headers: {
                    "token": `${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            setFollowedUniversities(data);
        } catch (error) {
            console.error('Error fetching followed universities:', error);
        }
    };

    const fetchConsultations = async () => {
        try {
            const response = await fetch(`${baseURL}api/v1/user/consultation-request`, {
                headers: {
                    "token": `${localStorage.getItem('token')}`
                },
            });
            const data = await response.json();
            setConsultations(data);
        } catch (error) {
            console.error('Error fetching consultations:', error);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');

        // Validate the new passwords match
        if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới không trùng khớp")
            return;
        }

        try {
            const response = await fetch(`${baseURL}api/v1/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Không thể thay đổi do mật khẩu không trùng khớp" || 'Không thể thay đổi mật khẩu.');
            toast.success("Mật khẩu đã được thay đổi")
            if (formRef.current) {
                formRef.current.reset(); // Reset form khi cần
            }
        } catch (error) {
            toast.error(error.message);
        }

    };

    const renderContent = () => {
        switch (activeTab) {
            case 'interests':
                return (
                    <div className="followed-universities-container">
                        {followedUniversities.map((uni) => (
                            <div key={uni.uni_id} className="university-followed-card">
                                <h3 onClick={() => handleUniversityClick(uni.uni_code)} style={{ cursor: 'pointer' }}>{uni.uni_name}</h3>
                                <p><strong>Địa chỉ:</strong> {uni.address}</p>
                                <p><strong>Liên hệ:</strong> {uni.phone}</p>
                                <p><strong>Email:</strong> {uni.email}</p>
                                <p><strong>Website:</strong> <a href={uni.website} target="_blank" rel="noreferrer">{uni.website}</a></p>
                            </div>
                        ))}
                    </div>
                );
            case 'applications':
                return (
                    <div className="consultations-container">
                        {consultations.map((consultation) => (
                            <div key={consultation.consultation_id} className="consultation-item">
                                <h3><strong>Trường:</strong> {consultation.uni_name}</h3>
                                <p><strong>Nội dung tư vấn:</strong> {consultation.consulting_information}</p>
                                {consultation.meet_url && <p><strong>Meet URL:</strong> <a href={consultation.meet_url} target="_blank" rel="noopener noreferrer">Tham gia cuộc họp</a></p>}
                                {consultation.consultation_time && (
                                    <p><strong>Thời gian tư vấn:</strong> {format(new Date(consultation.consultation_time), "dd/MM/yyyy HH:mm:ss")}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            case 'career':
                return <div>Nội dung cho Hướng nghiệp ở đây hiển thị các chức năng recommend ngành học</div>;
            case 'notifications':
                return <div>Nội dung cho Thông báo khi trường được follow có tin tuyển sinh mới</div>;
            case 'account':
                return (
                    <div className="change-password-container">
                        <h2>Thay đổi mật khẩu</h2>
                        <form ref={formRef} className="change-password-form" onSubmit={handleChangePassword}>
                            <input type="password" placeholder="Mật khẩu hiện tại" name="currentPassword" />
                            <input type="password" placeholder="Mật khẩu mới" name="newPassword" />
                            <input type="password" placeholder="Nhập lại mật khẩu mới" name="confirmNewPassword" />
                            <button type="submit">Xác nhận</button>
                        </form>
                    </div>
                );
            default:
                return <div>Chọn một tab</div>;
        }
    };

    return (
        <div className="user-account-container">
            <div className="user-account-sidebar">
                <div className="user-profile">
                    <img src={User} alt="User" className="user-profile-image" />
                    <h3 className="user-name">{localStorage.getItem("userName")}</h3>
                    <p className="user-email">{localStorage.getItem("user-email")}</p>
                </div>
                <div className="user-account-options">
                    <button onClick={() => setActiveTab('interests')}>Trường quan tâm</button>
                    <button onClick={() => setActiveTab('applications')}>Tuyển sinh của tôi</button>
                    <button onClick={() => setActiveTab('career')}>Hướng nghiệp</button>
                    <button onClick={() => setActiveTab('notifications')}>Thông báo</button>
                    <button onClick={() => setActiveTab('account')}>Quản lý tài khoản</button>
                    <button onClick={() => {/* Thực hiện đăng xuất */ }}>Thoát</button>
                </div>
            </div>
            <div className="user-account-details">
                {renderContent()}
            </div>
        </div>
    );
}

export default UserAccount;
