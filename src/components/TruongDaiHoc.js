import React, { useState, useEffect } from 'react';
import '../css/TruongDaiHoc.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const TruongDaiHoc = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [followedUniversities, setFollowedUniversities] = useState(new Set());
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        // Hàm lấy danh sách trường đại học từ API
        const fetchUniversities = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/admin/universities`);
                if (response.ok) {
                    const data = await response.json();
                    const universitiesWithImages = await Promise.all(data.universities.map(async (uni) => {
                        const imgResponse = await fetch(`${baseURL}api/v1/admin/universities/images/${uni.uni_id}`);
                        const imgData = await imgResponse.json();
                        return { ...uni, ...imgData };
                    }));
                    setUniversities(universitiesWithImages);
                } else {
                    console.error("Failed to fetch universities");
                }
            } catch (error) {
                console.error("Error fetching universities: ", error);
            }
        };

        const fetchFollowedUniversities = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${baseURL}api/v1/user/follow`, {
                    method: "GET",
                    headers: {
                        'token': `${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const uniIds = data.map(uni => uni.uni_id);
                    setFollowedUniversities(new Set(uniIds));
                }
            } catch (error) {
                console.error('Error fetching followed universities:', error);
            }
        };
        fetchUniversities();
        fetchFollowedUniversities();

        // Định nghĩa hàm xử lý khi nhận được custom event
        const handleUserLoggedOut = () => {
            setFollowedUniversities(new Set()); // Reset danh sách trường đã theo dõi
        };

        // Thêm event listener
        window.addEventListener('user-logged-out', handleUserLoggedOut);

        // Cleanup function
        return () => {
            window.removeEventListener('user-logged-out', handleUserLoggedOut);
        };
    }, []);

    const goToUniversityDetail = (uni) => {
        navigate(`/truong-dai-hoc/${uni.uni_code}`);
    };

    // Hàm cập nhật khi lựa chọn địa điểm thay đổi
    const handleLocationChange = async (event) => {
        setSelectedLocation(event.target.value);
        try {
            const response = await fetch(`${baseURL}api/v1/admin/universities/address`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: event.target.value })
            });

            if (response.ok) {
                const data = await response.json();
                const universitiesWithImages = await Promise.all(data.universities.map(async (uni) => {
                    const imgResponse = await fetch(`${baseURL}api/v1/admin/universities/images/${uni.uni_id}`);
                    const imgData = await imgResponse.json();
                    return { ...uni, ...imgData };
                }));
                setUniversities(universitiesWithImages);
            } else {
                console.error("Failed to fetch universities by address");
            }
        } catch (error) {
            console.error("Error fetching universities by address: ", error);
        }
    };


    // Hàm cập nhật khi lựa chọn ngành thay đổi
    const handleMajorChange = async (event) => {
        setSelectedMajor(event.target.value);
        try {
            const response = await fetch(`${baseURL}api/v1/admin/universities/major`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ majorName: event.target.value })
            });

            if (response.ok) {
                const data = await response.json();
                const universitiesWithImages = await Promise.all(data.universities.map(async (uni) => {
                    const imgResponse = await fetch(`${baseURL}api/v1/admin/universities/images/${uni.uni_id}`);
                    const imgData = await imgResponse.json();
                    return { ...uni, ...imgData };
                }));
                setUniversities(universitiesWithImages);
            } else {
                console.error("Failed to fetch universities by major");
            }
        } catch (error) {
            console.error("Error fetching universities by major: ", error);
        }
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    // Lọc danh sách trường theo thanh tìm kiếm
    const filteredUniversities = universities.filter(uni => {
        return (uni.uni_name.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    const handleFollowUniversity = async (event, uniId) => {
        event.stopPropagation(); // Ngăn chặn sự kiện onClick của parent element
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn cần đăng nhập để thực hiện thao tác này.');
            navigate("/dang-nhap")
            return;
        }
        try {
            const method = followedUniversities.has(uniId) ? 'DELETE' : 'POST'; // Xác định phương thức dựa trên trạng thái theo dõi
            const body = method === 'POST' ? JSON.stringify({ uni_id: uniId }) : undefined; // Body chỉ cần cho phương thức POST

            const response = await fetch(`${baseURL}api/v1/user/follow${method === 'DELETE' ? `/${uniId}` : ''}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                ...(body && { body: body }),
            });

            if (response.ok) {
                if (method === 'DELETE') {
                    followedUniversities.delete(uniId);
                    toast.success("Đã hủy theo dõi")
                } else {
                    followedUniversities.add(uniId);
                    toast.success("Đã theo dõi")
                }
                setFollowedUniversities(new Set([...followedUniversities])); // Cập nhật state để UI phản ánh sự thay đổi
            } else {
                toast.error("Đã có lỗi xảy ra")
            }
        } catch (error) {
            console.error('Có lỗi xảy ra:', error);
        }
    };

    return (
        <div className="university-page-container">
            <h1>Genz tìm kiếm ước mơ</h1>
            <div className="search-and-filter">
                <input type="text" placeholder="Tìm kiếm trường đại học..." className="search-box" value={searchTerm}
                    onChange={handleSearchChange} />
                <button className="search-button">Tìm</button>
                <select onChange={handleLocationChange} className="filter-dropdown">
                    <option value="">Địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                </select>
                <select onChange={handleMajorChange} className="filter-dropdown">
                    <option value="">Ngành</option>
                    <option value="Kỹ thuật máy tính">Kỹ thuật máy tính</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                </select>
            </div>
            <div className="university-list">
                {filteredUniversities.map((university, index) => (
                    <div key={index} className="university-card" onClick={() => { goToUniversityDetail(university) }}>
                        <img src={`${university.background}`} alt={`Ảnh bìa của ${university.uni_name}`} className="university-image" />
                        <div className="university-info">
                            <img src={`${university.logo}`} alt={`Logo của ${university.uni_name}`} className="university-logo" />
                            <h3>{university.uni_name}</h3>
                            <p>{university.address}</p>
                            <button className={`follow-button ${university.followed ? 'followed' : ''}`} onClick={(event) => handleFollowUniversity(event, university.uni_id)}>
                                {followedUniversities.has(university.uni_id) ? 'Đã Theo Dõi' : 'Theo Dõi'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TruongDaiHoc;
