import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/TuyenSinhDetail.css';
import ReactMarkdown from 'react-markdown';

const TuyenSinhDetail = () => {
    const { uni_code } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [universityData, setUniversityData] = useState([])
    const [statistics, setStatistics] = useState([]);
    const [infoCards, setInfoCards] = useState([]);
    const [mission, setMission] = useState('')
    const [majors, setMajors] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(2);

    const [reviewInfo, setReviewInfo] = useState({
        major_id: '',
        pros: '',
        cons: ''
    });

    const [consultationInfo, setConsultationInfo] = useState({
        major_id: '',
        consulting_information: '',
        consultation_name: '',
        consultation_email: '',
        consultation_phone: ''
    });

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
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:2000/api/v1/user/review/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserReviews(data); // Giả sử API trả về một mảng đánh giá trong `data.reviews`
                } else {
                    console.error("Failed to fetch reviews");
                }
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
        fetchReviews();
        fetchMajors();
        fetchUniversityDetails();
    }, [uni_code]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:2000/api/v1/user/review/${uni_code}`, {
                headers: {
                    'token': `${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Không thể lấy danh sách đánh giá.');
            }
            const data = await response.json();
            // Cập nhật state với danh sách đánh giá mới
            setUserReviews(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đánh giá:', error);
        }
    };
    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:2000/api/v1/user/add-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(reviewInfo)
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi gửi đánh giá.');
            }

            // const newReview = await response.json(); // Giả sử response trả về đánh giá mới được thêm, bao gồm cả thông tin người dùng và ngành

            // // Cập nhật danh sách đánh giá trên UI mà không cần refresh trang
            // setUserReviews(prevReviews => [newReview, ...prevReviews]);
            fetchReviews();
            // setShowReviewModal(false); // Đóng modal sau khi gửi thành công
            // Reset form nếu cần
            setReviewInfo({
                major_id: '',
                pros: '',
                cons: ''
            });
            alert('Đánh giá đã được gửi thành công!');
            setShowReviewModal(false); // Đóng modal form đánh giá
            // Cập nhật UI nếu cần
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const handleConsultationSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = 'http://localhost:2000/api/v1/user/consultation';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(consultationInfo),
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gửi thông tin tư vấn.');
            }

            alert('Đăng ký tư vấn thành công!');
            // Reset form và state nếu cần
            setConsultationInfo({
                major_id: '',
                consulting_information: '',
                consultation_name: '',
                consultation_email: '',
                consultation_phone: ''
            });
        } catch (error) {
            console.error('Failed to submit consultation:', error);
            alert('Đăng ký tư vấn không thành công. Vui lòng thử lại.');
        }
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

    const showMoreReviews = () => {
        setVisibleReviews(prevVisibleReviews => prevVisibleReviews + 2); // Hiển thị thêm 2 đánh giá
    };

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
                {userReviews.slice(0, visibleReviews).map((review, index) => (
                    <div key={index} className="review-item">
                        <strong>{review.username}</strong>
                        <p>Ngành: {review.majorName}</p>
                        <p>Ưu điểm: {review.pros}</p>
                        <p>Nhược điểm: {review.cons}</p>
                    </div>
                ))}
                {visibleReviews < userReviews.length && (
                    <button onClick={showMoreReviews} className="show-more-reviews">Xem thêm</button>
                )}
            </div>

            {/* Modal Đánh Giá */}
            {showReviewModal && (
                <div className="review-modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={closeReviewModal}>&times;</span>
                        <form onSubmit={submitReview}>
                            <select
                                value={reviewInfo.major_id}
                                onChange={(e) => setReviewInfo({ ...reviewInfo, major_id: e.target.value })}
                            >
                                {/* Các lựa chọn ngành, ví dụ */}
                                {majors.map((major) => (
                                    <option value={major.major_id}>{major.major_name}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Ưu điểm"
                                value={reviewInfo.pros}
                                onChange={(e) => setReviewInfo({ ...reviewInfo, pros: e.target.value })}
                            ></textarea>
                            <textarea
                                placeholder="Nhược điểm"
                                value={reviewInfo.cons}
                                onChange={(e) => setReviewInfo({ ...reviewInfo, cons: e.target.value })}
                            ></textarea>
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
                    <form onSubmit={handleConsultationSubmit}>
                        {!isLoggedIn && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Tên của bạn"
                                    value={consultationInfo.consultation_name}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, consultation_name: e.target.value })}

                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={consultationInfo.consultation_email}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, consultation_email: e.target.value })}

                                />
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    value={consultationInfo.consultation_phone}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, consultation_phone: e.target.value })}

                                />
                            </>
                        )}
                        <select
                            value={consultationInfo.major_id}
                            onChange={(e) => setConsultationInfo({ ...consultationInfo, major_id: e.target.value })}
                            required
                        >
                            <option value="">Chọn ngành cần tư vấn</option>
                            {majors.map((major) => (
                                <option key={major.major_id} value={major.major_id}>{major.major_name}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Thông tin cần tư vấn"
                            value={consultationInfo.consulting_information}
                            onChange={(e) => setConsultationInfo({ ...consultationInfo, consulting_information: e.target.value })}
                            required
                        ></textarea>
                        <button type="submit">Đăng ký tư vấn</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TuyenSinhDetail;
