import React, { useState } from 'react';
import '../css/UserAccount.css';
import User from "../img/user.png"
const UserAccount = () => {
    const [activeTab, setActiveTab] = useState('interests');

    const renderContent = () => {
        switch (activeTab) {
            case 'interests':
                return <div>Nội dung cho Trường quan tâm</div>;
            case 'applications':
                return <div>Nội dung cho Tuyển sinh của tôi</div>;
            case 'career':
                return <div>Nội dung cho Hướng nghiệp</div>;
            case 'notifications':
                return <div>Nội dung cho Thông báo</div>;
            case 'account':
                return <div>Nội dung cho Quản lý tài khoản</div>;
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
