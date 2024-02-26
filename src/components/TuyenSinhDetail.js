import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/TuyenSinhDetail.css'; // Đảm bảo bạn đã tạo file CSS này
import UET from "../img/UET.png"
import ReactMarkdown from 'react-markdown';
const TuyenSinhDetail = () => {
    const { uni_code } = useParams();
    const [showModal, setShowModal] = useState(false); // Trạng thái để quản lý việc hiển thị modal
    const [selectedCard, setSelectedCard] = useState(null); // Trạng thái để xác định card được chọn
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [universityData, setUniversityData] = useState([])
    const [statistics, setStatistics] = useState([]);
    const [infoCards, setInfoCards] = useState([]);
    const [mission, setMission] = useState('')
    const [majors, setMajors] = useState([]);
    function getRandomColor() {
        const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffcd56'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    useEffect(() => {
        const fetchUniversityDetails = async () => {
            try {
                const response = await fetch(`http://localhost:2000/api/v1/admin/universities/details/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    // Cập nhật trạng thái với thông tin chi tiết của trường đại học
                    setUniversityData({
                        name: data.uni_name,
                        address: data.address,
                        website: data.website,
                        coverImage: `http://localhost:2000/${data.background.replace(/\\/g, '/')}`, // Đảm bảo đường dẫn đúng
                        logo: `http://localhost:2000/${data.logo.replace(/\\/g, '/')}` // Đảm bảo đường dẫn đúng
                    });
                    setMission(data.mission)
                    const statsArray = data.description.split(", ");
                    const parsedStatistics = statsArray.map(stat => {
                        const parts = stat.split(" - ");
                        return {
                            number: parts[0].trim(),
                            label: parts[1].trim(),
                            color: getRandomColor() // Sử dụng hàm getRandomColor đã định nghĩa ở trên
                        };
                    });

                    setStatistics(parsedStatistics);
                    setInfoCards([
                        { title: 'Chỉ tiêu tuyển sinh', icon: '🎯', markdown: data.admissions_criteria },
                        { title: 'Phương thức tuyển sinh', icon: '🚀', markdown: data.admission_method },
                        { title: 'Học phí & Học bổng', icon: '💰', markdown: data.tution_fee },
                        { title: 'Đội ngũ giảng viên', icon: '👩‍🏫', markdown: data.teaching_staff },
                        { title: 'Kí túc xá & Câu lạc bộ', icon: '🏠', markdown: data.dormitory },
                        { title: 'Thư viện', icon: '📚', markdown: data.library }
                    ]);
                } else {
                    console.error("Failed to fetch university details");
                }
            } catch (error) {
                console.error("Error fetching university details: ", error);
            }
        };
        const fetchMajors = async () => {
            try {
                const response = await fetch(`http://localhost:2000/api/v1/admin/major/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    setMajors(data);
                } else {
                    console.error("Failed to fetch majors");
                }
            } catch (error) {
                console.error("Error fetching majors: ", error);
            }
        };

        fetchMajors();
        fetchUniversityDetails();
    }, [uni_code]);

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
        navigate(`/truong-dai-hoc/${uni_code}/chi-tiet-nganh/${major.major_name}`)
    }

    const openReviewModal = () => {
        // Kiểm tra trạng thái đăng nhập
        const isLoggedIn = localStorage.getItem('token'); // Giả sử token được lưu khi đăng nhập
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
                        <h4 className='major-name' onClick={() => handleMajorClick(major)}>{major.major_name}</h4>
                        <div className='icon-container'>
                            <p><span className="icon">🎓</span>{major.type || "Đại học - Chính quy"}</p>
                            <p><span className="icon">🔖</span>Mã ngành: {major.major_code}</p>
                            <p><span className="icon">🎯</span>Chỉ tiêu: {major.quota}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phần 5: Giới thiệu trường học */}
            <div className="introduction-section">
                <h3>Giới thiệu trường</h3>
                <ReactMarkdown>{mission}</ReactMarkdown>
                <div className="info-cards-container">
                    {infoCards.map((card, index) => (
                        <div key={index} className="info-card" onClick={() => { handleCardClick(card) }}>
                            <div className="card-icon-circle">{card.icon}</div>
                            <h4>{card.title}</h4>
                            {/* <ReactMarkdown>{card.markdown}</ReactMarkdown> */}
                        </div>
                    ))}
                </div>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <h4>{selectedCard.title}</h4>
                            <ReactMarkdown>{selectedCard.markdown}</ReactMarkdown>
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
