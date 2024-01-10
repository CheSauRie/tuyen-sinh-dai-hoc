import React from 'react';
import '../css/Footer.css'; // Đảm bảo đường dẫn đến file CSS đúng

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <p>Trịnh Hồng Quân</p>
                <p>Số điện thoại: 0327804566</p>
                <p>Email: 20020211@vnu.edu.vn</p>
                <p>Hà Nội, Trường Đại học Công Nghệ</p>
                {/* Thêm logo ở đây, ví dụ: <img src="path-to-logo.png" alt="Logo Trường Đại học Công Nghệ" /> */}
            </div>
        </footer>
    );
}

export default Footer;
