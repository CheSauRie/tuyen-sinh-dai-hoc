import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DiemThi.css';

const DiemThi = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [showProvinces, setShowProvinces] = useState(false);
    const [visibleUniversities, setVisibleUniversities] = useState(20);
    const navigate = useNavigate(); // Thêm dòng này để sử dụng useHistory

    const universities = [
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'FTU', name: 'Đại học Ngoại Thương' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },
        { code: 'ANS', name: 'Đại học An Ninh Nhân Dân' },
        { code: 'UET', name: 'Đại học Công Nghệ - Đại học Quốc Gia Hà Nội' },
        { code: 'UEB', name: 'Đại học Kinh Tế' },
        { code: 'ULIS', name: 'Đại học Ngoại Ngữ' },

        // Thêm các trường đại học khác tại đây
    ];

    const displayUniversities = filteredUniversities.length > 0 ? filteredUniversities : universities;
    const toggleProvinces = () => {
        setShowProvinces(!showProvinces);
    };
    const loadMoreUniversities = () => {
        setVisibleUniversities(prevCount => prevCount + 20); // Tăng số lượng trường đại học hiển thị
    };

    const handleSearch = () => {
        const filtered = universities.filter(uni =>
            uni.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUniversities(filtered);
        setVisibleUniversities(20); // Đặt lại số lượng trường đại học hiển thị
    };

    const handleProvinceClick = (province) => {
        const filtered = universities.filter(uni => uni.province === province);
        setFilteredUniversities(filtered);
        setVisibleUniversities(20);
        setSearchTerm(''); // Đặt lại searchTerm nếu bạn muốn
    };

    const handleUniversityClick = (uni) => {
        navigate(`/diem-thi/${uni.code}`);
    };
    return (
        <div className="diem-thi-container">
            <h1>Xem Điểm Thi 2023</h1>
            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="search-box"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Tìm</button>
            </div>

            <div className="province-buttons">
                <button>Hà Nội</button>
                <button>TPHCM</button>
                <button>Quảng Ninh</button>
                <button>Đà Nẵng</button>
                <button onClick={toggleProvinces}>Các tỉnh khác</button>
                {showProvinces && (
                    <div className="dropdown-provinces">
                        {/* Danh sách các tỉnh khác */}
                        <p>Tỉnh 1</p>
                        <p>Tỉnh 2</p>
                        {/* Thêm các tỉnh khác ở đây */}
                    </div>
                )}
            </div>
            <div className="university-list-score">
                {displayUniversities.slice(0, visibleUniversities).map((uni, index) => (
                    <div key={index} className="university-item" onClick={() => handleUniversityClick(uni)}>
                        <span className="university-code">{uni.code}</span>
                        <span className="university-name">{uni.name}</span>
                    </div>
                ))}
                {visibleUniversities < displayUniversities.length && (
                    <button className="load-more" onClick={loadMoreUniversities}>Xem thêm</button>
                )}
            </div>
        </div>
    );
}

export default DiemThi;
