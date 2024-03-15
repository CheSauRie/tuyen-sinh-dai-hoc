import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/DiemThi.css';

const DiemThi = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [showProvinces, setShowProvinces] = useState(false);
    const [visibleUniversities, setVisibleUniversities] = useState(20);
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        fetch(`${baseURL}api/v1/admin/score/universities`)
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(uni => ({
                    code: uni.uni_code,
                    name: uni.uni_name,
                }));
                setUniversities(formattedData);
                setFilteredUniversities(formattedData);
            })
            .catch(error => console.error('Error fetching universities:', error));
    }, []);
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);
    const displayUniversities = filteredUniversities.slice(0, visibleUniversities);

    const toggleProvinces = () => {
        setShowProvinces(!showProvinces);
    };
    const loadMoreUniversities = () => {
        setVisibleUniversities(prevCount => prevCount + 20);
    };

    const handleSearch = () => {
        if (searchTerm === '') {
            setFilteredUniversities(universities);
        } else {
            const filtered = universities.filter(uni =>
                uni.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUniversities(filtered);
        }
        setVisibleUniversities(20);
    };

    const handleProvinceClick = (province) => {
        const filtered = universities.filter(uni => uni.province === province);
        setFilteredUniversities(filtered);
        setVisibleUniversities(20);
        setSearchTerm('');
    };

    const handleUniversityClick = (uni) => {
        navigate(`/diem-thi/${uni.code}`);
    };
    return (
        <div className="diem-thi-wrapper">
            <h1>Xem Điểm Thi 2023</h1>
            <div className='diem-thi-search-container'>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="diem-thi-search-box"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} className="diem-thi-search-btn">Tìm</button>
            </div>

            {/* <div className="diem-thi-province-btns"> */}
            {/* Province buttons remain the same, just update the class name */}
            {/* <button className="diem-thi-province-btn">Hà Nội</button>
                <button className="diem-thi-province-btn">TPHCM</button>
                <button className="diem-thi-province-btn">Quảng Ninh</button>
                <button className="diem-thi-province-btn">Đà Nẵng</button>
                <button onClick={toggleProvinces} className="diem-thi-province-btn">Các tỉnh khác</button>
                {showProvinces && (
                    <div className="diem-thi-dropdown-provinces"> */}
            {/* Province list remains the same */}
            {/* </div>
                )}
            </div> */}

            <div className="diem-thi-university-list">
                {displayUniversities.map((uni, index) => (
                    <div key={index} className="diem-thi-university-item" onClick={() => handleUniversityClick(uni)}>
                        <span className="diem-thi-university-code">{uni.code}</span>
                        <span className="diem-thi-university-name">{uni.name}</span>
                    </div>
                ))}
                {visibleUniversities < filteredUniversities.length && (
                    <button className="diem-thi-load-more" onClick={loadMoreUniversities}>Xem thêm</button>
                )}
            </div>
        </div>
    );
}

export default DiemThi;
