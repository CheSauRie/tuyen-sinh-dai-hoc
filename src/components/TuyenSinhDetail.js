import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import '../css/TuyenSinhDetail.css';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

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
    const [schedules, setSchedules] = useState([]);
    const [replyToReviewId, setReplyToReviewId] = useState(null);
    const [replies, setReplies] = useState({});
    const [currentReply, setCurrentReply] = useState('');
    const [comments, setComments] = useState({
        roots: [], // chứa các bình luận gốc
        replies: {} // là một object với key là parent_review_id và giá trị là một array của replies
    });
    const [showRepliesCount, setShowRepliesCount] = useState({});
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const handleShowMoreReplies = (parentId) => {
        setShowRepliesCount(prevState => ({
            ...prevState,
            [parentId]: (prevState[parentId] || 4) + 4, // Tăng số lượng phản hồi hiển thị thêm 4
        }));
    };

    const [reviewInfo, setReviewInfo] = useState({
        major_id: '',
        content: '',
        parent_review_id: null
    });

    const [consultationInfo, setConsultationInfo] = useState({
        schedule_id: '',
        consulting_information: '',
        username: '',
        user_email: '',
        user_phone: ''
    });
    function getRandomColor() {
        const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffcd56'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchUniversityDetails = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/admin/universities/details/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    // Cập nhật trạng thái với thông tin chi tiết của trường đại học
                    setUniversityData({
                        name: data.uni_name,
                        address: data.address,
                        website: data.website,
                        coverImage: data.background,
                        logo: data.logo
                    });
                    setMission(data.mission)
                    const statsArray = data.description.split(", ");
                    const parsedStatistics = statsArray.map(stat => {
                        const parts = stat.split(" - ");
                        return {
                            number: parts[0].trim(),
                            label: parts[1].trim(),
                            color: getRandomColor()
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
                const response = await fetch(`${baseURL}api/v1/admin/major/${uni_code}`);
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
                const response = await fetch(`${baseURL}api/v1/user/review/${uni_code}`);
                if (response.ok) {

                    const data = await response.json();
                    const roots = data.filter(review => review.parent_review_id === null);
                    const replies = data
                        .filter(review => review.parent_review_id)
                        .reduce((acc, reply) => {
                            acc[reply.parent_review_id] = [...(acc[reply.parent_review_id] || []), reply];
                            return acc;
                        }, {});
                    setUserReviews(data);
                    setComments({ roots, replies });
                } else {
                    console.error("Failed to fetch reviews");
                }
            } catch (error) {
                console.error("Error fetching reviews: ", error);
            }
        };

        if (token) {
            setIsLoggedIn(true);
        }

        fetchReviews();
        fetchMajors();
        fetchUniversityDetails();
    }, [uni_code]);

    useEffect(() => {
        // Hàm lấy danh sách lịch tư vấn từ server
        const fetchSchedules = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/user/consultation-schedule/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    setSchedules(data);
                } else {
                    console.error("Failed to fetch majors");
                }
            } catch (error) {
                console.error("Error fetching majors: ", error);
            }
        };

        fetchSchedules();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${baseURL}api/v1/user/review/${uni_code}`);
            if (response.ok) {

                const data = await response.json();
                const roots = data.filter(review => review.parent_review_id === null);
                const replies = data
                    .filter(review => review.parent_review_id)
                    .reduce((acc, reply) => {
                        acc[reply.parent_review_id] = [...(acc[reply.parent_review_id] || []), reply];
                        return acc;
                    }, {});
                setUserReviews(data);
                setComments({ roots, replies });
            } else {
                console.error("Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Error fetching reviews: ", error);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewInfo.major_id) {
            return alert('Vui lòng chọn một ngành.');
        }
        try {
            const response = await fetch(`${baseURL}api/v1/user/add-review`, {
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

            fetchReviews();
            setReviewInfo({
                major_id: '',
                content: '',
                parent_review_id: null
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
        const apiUrl = `${baseURL}api/v1/user/consultation-request`;
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
                schedule_id: "",
                consulting_information: '',
                username: '',
                user_email: '',
                user_phone: ''
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

    // Hàm gửi phản hồi đến server
    const sendReplyToServer = async (reviewId, major_id, content) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}api/v1/user/add-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                body: JSON.stringify({
                    parent_review_id: reviewId,
                    major_id: major_id,
                    content: content,
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newReply = await response.json();
            return newReply;
        } catch (error) {
            console.error('Could not send reply:', error);
            throw error; // Có thể xử lý lỗi cụ thể nếu cần
        }
    };

    const handleReplyClick = (reviewId) => {
        // Nếu đang phản hồi bình luận này, đóng form. Ngược lại, mở form.
        if (replies[reviewId]) {
            const newReplies = { ...replies };
            delete newReplies[reviewId];
            setReplies(newReplies);
        } else {
            setReplies({ ...replies, [reviewId]: [] });
        }
    };

    // Hàm xử lý khi nút Gửi Phản Hồi được click hiển thị
    const handleSendReply = async (reviewId, major_id) => {
        try {
            // Gửi phản hồi đến server và nhận phản hồi mới
            const newReply = await sendReplyToServer(reviewId, major_id, currentReply);

            fetchReviews()
            setCurrentReply('');
            setReplyToReviewId(null); // Đóng form phản hồi
            // Toast hoặc thông báo thành công
            toast.success("Đã bình luận!");

        } catch (error) {
            alert('Lỗi khi gửi phản hồi: ' + error.message);
        }
    };

    const renderReplies = (parentId) => {
        if (!comments.replies[parentId]) {
            return null;
        }
        const replies = comments.replies[parentId] || [];
        const showCount = showRepliesCount[parentId] || 4;

        // Lấy phản hồi từ cuối lên dựa vào showCount
        const latestReplies = replies.length > showCount ? replies.slice(-showCount) : replies;
        return (
            <>
                {latestReplies.map((reply) => (
                    <div key={reply.review_id} className="reply-item">
                        <strong>{reply.username || 'Người dùng ẩn danh'}</strong>
                        <p>{reply.content}</p>
                        <p className='time-reply'>{format(new Date(reply.createdAt), "dd/MM/yyyy HH:mm:ss")}</p>
                        {renderReplies(reply.review_id)}
                    </div>
                ))}
                {replies.length > showCount && (
                    <button className="show-more-replies-btn" onClick={() => handleShowMoreReplies(parentId)}><FontAwesomeIcon icon={faCaretDown} /></button>
                )}
            </>
        );
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

            {/* Phần 6: Đăng ký tư vấn */}
            <div className="registration-section">
                <div className="university-image">
                    <img src={universityData.coverImage} alt="Ảnh trường" />
                </div>
                <div className="registration-form">
                    <h3>Đăng Ký Tư Vấn Online</h3>
                    <form onSubmit={handleConsultationSubmit}>
                        {!isLoggedIn && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Tên của bạn"
                                    value={consultationInfo.username}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, username: e.target.value })}

                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={consultationInfo.user_email}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, user_email: e.target.value })}

                                />
                                <input
                                    type="tel"
                                    placeholder="Số điện thoại"
                                    value={consultationInfo.user_phone}
                                    onChange={(e) => setConsultationInfo({ ...consultationInfo, user_phone: e.target.value })}

                                />
                            </>
                        )}
                        <select
                            id="schedule"
                            value={consultationInfo.schedule_id}
                            onChange={(e) =>
                                setConsultationInfo({ ...consultationInfo, schedule_id: e.target.value })
                            }
                            required
                        >
                            <option value="">Chọn lịch...</option>
                            {schedules.map((schedule) => (
                                <option key={schedule.schedule_id} value={schedule.schedule_id}>
                                    {format(new Date(schedule.consultation_time), "dd/MM/yyyy HH:mm:ss")}
                                </option>
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

            {/* Phần 7: Đánh giá của người dùng */}
            <div className="user-reviews">
                <div className='user-reviews-title'>
                    <h3>Hỏi đáp</h3>
                    <button onClick={openReviewModal}>Gửi Bình Luận</button>
                </div>
                {comments.roots.slice(0, visibleReviews).map((review) => (
                    <div key={review.review_id} className="review-item">
                        {/* Hiển thị bình luận gốc */}
                        <strong>{review.username}</strong>
                        <p>Ngành: {review.majorName}</p>
                        <p>{review.content}</p>
                        <button onClick={() => handleReplyClick(review.review_id)}>Bình luận</button>

                        {/* Hiển thị form phản hồi nếu cần */}
                        {replies[review.review_id] && (
                            <div className="reply-form">
                                <textarea
                                    placeholder="Nhập bình luận của bạn..."
                                    value={currentReply}
                                    onChange={(e) => setCurrentReply(e.target.value)}
                                />
                                <button onClick={() => handleSendReply(review.review_id, review.major_id)}>Gửi</button>
                            </div>
                        )}

                        {/* Đệ quy để hiển thị các phản hồi */}
                        {renderReplies(review.review_id)}
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
                                onChange={(e) => {
                                    const newMajorId = e.target.value;
                                    console.log(e.target.value);
                                    setReviewInfo(current => {
                                        const updated = { ...current, major_id: newMajorId };
                                        return updated;
                                    });
                                }}
                            >
                                <option value="">Chọn ngành...</option>
                                {majors.map((major) => (
                                    <option key={major.major_id} value={major.major_id}>{major.major_name}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Câu hỏi của bạn"
                                value={reviewInfo.content}
                                onChange={(e) => setReviewInfo({ ...reviewInfo, content: e.target.value })}
                            ></textarea>
                            <button type="submit">Gửi</button>
                        </form>

                    </div>
                </div>
            )}

            <df-messenger intent="WELCOME" chat-title="Hệ thống tư vấn tuyển sinh" agent-id="b9d16e35-2a47-4d31-b5b8-8844913cf5d4"
                language-code="en"></df-messenger>
        </div>
    );
}

export default TuyenSinhDetail;
