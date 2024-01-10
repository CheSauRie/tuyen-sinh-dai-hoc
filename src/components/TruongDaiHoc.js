import React, { useState } from 'react';
import '../css/TruongDaiHoc.css';
import { useNavigate } from 'react-router-dom';
import UET from '../img/UET.png'
const TruongDaiHoc = () => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const navigate = useNavigate();
    const universities = [
        {
            id: 1,
            name: 'Đại học A',
            location: 'Hà Nội',
            majors: ['Ngành A1', 'Ngành A2'],
            image: UET,
            logo: UET
        },
        {
            id: 2,
            name: 'Đại học B',
            location: 'TP Hồ Chí Minh',
            majors: ['Ngành B1', 'Ngành B2'],
            image: UET,
            logo: UET
        },
        {
            id: 3,
            name: 'Đại học C',
            location: 'Đà Nẵng',
            majors: ['Ngành C1', 'Ngành C2'],
            image: UET,
            logo: UET
        },
        {
            id: 4,
            name: 'Đại học D',
            location: 'Cần Thơ',
            majors: ['Ngành D1', 'Ngành D2'],
            image: UET,
            logo: UET
        },
        {
            id: 5,
            name: 'Đại học E',
            location: 'Hải Phòng',
            majors: ['Ngành E1', 'Ngành E2'],
            image: UET,
            logo: UET
        }
    ];

    const goToUniversityDetail = (uni) => {
        navigate(`/truong-dai-hoc/${uni.name}`); //Sau này có dữ liệu thì sửa thành uni.code
    };

    // Hàm cập nhật khi lựa chọn địa điểm thay đổi
    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
        // Thêm logic cập nhật danh sách trường dựa trên địa điểm
    };

    // Hàm cập nhật khi lựa chọn ngành thay đổi
    const handleMajorChange = (event) => {
        setSelectedMajor(event.target.value);
        // Thêm logic cập nhật danh sách trường dựa trên ngành
    };

    // Lọc danh sách trường dựa trên địa điểm và ngành
    const filteredUniversities = universities.filter(uni => {
        return (!selectedLocation || uni.location === selectedLocation) &&
            (!selectedMajor || uni.majors.includes(selectedMajor));
    });

    return (
        <div className="university-page-container">
            <h1>Genz tìm kiếm ước mơ</h1>
            <div className="search-and-filter">
                <input type="text" placeholder="Tìm kiếm trường đại học..." className="search-box" />
                <button className="search-button">Tìm</button>
                <select onChange={handleLocationChange} className="filter-dropdown">
                    <option value="">Địa điểm</option>
                    {/* Các option khác cho địa điểm */}
                </select>
                <select onChange={handleMajorChange} className="filter-dropdown">
                    <option value="">Ngành</option>
                    {/* Các option khác cho ngành */}
                </select>
            </div>
            <div className="university-list">
                {filteredUniversities.map((university, index) => (
                    <div key={index} className="university-card" onClick={() => { goToUniversityDetail(university) }}>
                        <img src={university.image} alt={`Ảnh bìa của ${university.name}`} className="university-image" />
                        <div className="university-info">
                            <img src={university.logo} alt={`Logo của ${university.name}`} className="university-logo" />
                            <h3>{university.name}</h3>
                            <p>Ngành nổi bật: {university.majors.join(', ')}</p>
                            <p>Tin tuyển sinh</p>
                            <button className="follow-button">Theo dõi</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TruongDaiHoc;
