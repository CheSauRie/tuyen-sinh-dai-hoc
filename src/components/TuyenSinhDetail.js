import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/TuyenSinhDetail.css'; // Đảm bảo bạn đã tạo file CSS này
import UET from "../img/UET.png"
const TuyenSinhDetail = () => {
    const { name } = useParams();
    const [showModal, setShowModal] = useState(false); // Trạng thái để quản lý việc hiển thị modal
    const [selectedCard, setSelectedCard] = useState(null); // Trạng thái để xác định card được chọn
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Giả định dữ liệu
    const universityData = {
        name: 'Tên Trường Đại Học',
        address: 'Địa chỉ',
        website: 'uet.vnu.edu.vn',
        coverImage: UET,
        logo: UET
        // Các dữ liệu khác
    };

    const statistics = [
        { number: '100+', label: 'Chương trình đào tạo', color: '#ff6384' },
        { number: '3000', label: 'Tuyển sinh 2023', color: '#36a2eb' },
        { number: '85%', label: 'Sinh viên có việc làm', color: '#cc65fe' },
        { number: '5', label: 'Phương thức xét tuyển', color: '#ffcd56' }
    ];
    const infoCards = [
        { title: 'Chỉ tiêu tuyển sinh', icon: '🎯', markdown: '...' },
        { title: 'Phương thức tuyển sinh', icon: '🚀', markdown: '...' },
        { title: 'Học phí & Học bổng', icon: '💰', markdown: '...' },
        { title: 'Đội ngũ giảng viên', icon: '👩‍🏫', markdown: '...' },
        { title: 'Kí túc xá & Câu lạc bộ', icon: '🏠', markdown: '...' },
        { title: 'Thư viện', icon: '📚', markdown: '...' }
    ];

    const majors = [
        {
            name: 'Kỹ thuật Máy tính',
            type: 'Đại học - Chính quy',
            quota: '100',
            examGroup: 'A00 (Toán, Lý, Hóa)',
            // Thêm icons vào đây, ví dụ: typeIcon: 'path-to-icon', ...
        },
        {
            name: 'Kỹ thuật Máy tính',
            type: 'Đại học - Chính quy',
            quota: '100',
            examGroup: 'A00 (Toán, Lý, Hóa)',
            // Thêm icons vào đây, ví dụ: typeIcon: 'path-to-icon', ...
        },
        // Các ngành khác
    ];
    const userReviews = [
        { username: 'Người dùng 1', review: 'Trường rất tốt, giáo viên nhiệt tình.' },
        { username: 'Người dùng 2', review: 'Chương trình học hiện đại và thực tế.' },
        // Thêm các đánh giá khác
    ];
    const handleCardClick = (card) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleMajorClick = (major) => {
        navigate(`/truong-dai-hoc/${name}/chi-tiet-nganh/${major.name}`)
    }

    const openReviewModal = () => {
        // Kiểm tra trạng thái đăng nhập
        const isLoggedIn = localStorage.getItem('token'); // Giả sử token được lưu khi đăng nhập
        console.log(isLoggedIn);
        if (isLoggedIn) {
            setShowReviewModal(true);
        } else {
            alert("Bạn cần đăng nhập để đánh giá."); // Hoặc sử dụng một phương pháp thông báo khác
            navigate('/dang-nhap'); // Chuyển hướng đến trang đăng nhập
        }
    }
    const closeReviewModal = () => setShowReviewModal(false);
    return (
        <div className="university-detail-page">
            {/* Phần 1: Ảnh bìa */}
            <div className="cover-image" style={{ backgroundImage: `url(${universityData.coverImage})` }}></div>


            {/* Phần 2: Thông tin trường */}
            <div className="container-fluid university-info-container">
                <div className="university-logo-tuyensinh">
                    <img src={universityData.logo} alt="Logo của trường" />
                </div>
                <div className="university-info-tuyensinh">
                    <h2>{universityData.name}</h2>
                    <p>{universityData.address} | <a href={universityData.website}>Website</a></p>
                </div>
            </div>


            {/* Phần 3: Thống kê */}
            <div className="statistics-container">
                {statistics.map((stat, index) => (
                    <div key={index} className="statistic-item">
                        <div className="stat-circle" style={{ backgroundColor: stat.color }}>
                            <div className="number">{stat.number}</div>
                        </div>
                        <div className="label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Phần 4: Danh sách ngành đào tạo */}
            <div className="majors-list-container">
                <h3 className='majors-list-title'>Danh sách các ngành đào tạo</h3>
                {majors.map((major, index) => (
                    <div key={index} className="major-item">
                        <h4 className='major-name' onClick={() => handleMajorClick(major)}>{major.name}</h4>
                        <div className='icon-container'>
                            <p><span className="icon">🎓</span>{major.type}</p>
                            <p><span className="icon">🎯</span>Chỉ tiêu: {major.quota}</p>
                            <p><span className="icon">📚</span>Khối thi: {major.examGroup}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phần 5: Giới thiệu trường học */}
            <div className="introduction-section">
                <h3>Giới thiệu trường</h3>
                {/* Đoạn markdown */}
                <div className="info-cards-container">
                    {infoCards.map((card, index) => (
                        <div key={index} className="info-card" onClick={() => { handleCardClick(card) }}>
                            <div className="card-icon-circle">{card.icon}</div>
                            <h4>{card.title}</h4>
                            {/* Đoạn markdown khác */}
                        </div>
                    ))}
                </div>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h4>{selectedCard.title}</h4>
                            <p>Xin chào</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Phần 6: Đánh giá của người dùng */}
            <div className="user-reviews">
                <div className='user-reviews-title'>
                    <h3>Đánh Giá Từ Người Dùng</h3>
                    <button onClick={openReviewModal}>Đánh Giá</button>
                </div>
                {userReviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <strong>{review.username}</strong>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>

            {/* Modal Đánh Giá */}
            {showReviewModal && (
                <div className="review-modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={closeReviewModal}>&times;</span>
                        <form>
                            <select>
                                <option value="">Chọn ngành đánh giá</option>
                                {/* Các lựa chọn ngành */}
                            </select>
                            <textarea placeholder="Ưu điểm"></textarea>
                            <textarea placeholder="Nhược điểm"></textarea>
                            <button type="submit">Gửi Đánh Giá</button>
                        </form>
                    </div>
                </div>
            )}


            {/* Phần 7: Đăng ký tư vấn */}
            <div className="registration-section">
                <div className="university-image">
                    <img src={universityData.coverImage} alt="Ảnh trường" />
                </div>
                <div className="registration-form">
                    <h3>Đăng Ký Tư Vấn</h3>
                    <form>
                        <input type="text" placeholder="Tên của bạn" />
                        <input type="email" placeholder="Email" />
                        <input type="tel" placeholder="Số điện thoại" />
                        <select>
                            <option value="">Chọn ngành cần tư vấn</option>
                            {/* Các ngành khác */}
                        </select>
                        <textarea placeholder="Thông tin cần tư vấn"></textarea>
                        <button type="submit">Đăng ký tư vấn</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TuyenSinhDetail;
