import React, { useState, useEffect } from 'react';
import '../css/TruongDaiHoc.css';
import { useNavigate } from 'react-router-dom';

const TruongDaiHoc = () => {
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);

    const baseURL = "http://localhost:2000/";
    useEffect(() => {
        // Hàm lấy danh sách trường đại học từ API
        const fetchUniversities = async () => {
            try {
                const response = await fetch('http://localhost:2000/api/v1/admin/universities');
                if (response.ok) {
                    const data = await response.json();
                    const universitiesWithImages = await Promise.all(data.universities.map(async (uni) => {
                        const imgResponse = await fetch(`http://localhost:2000/api/v1/admin/universities/images/${uni.uni_id}`);
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

        fetchUniversities();
    }, []);
    console.log(universities);
    const goToUniversityDetail = (uni) => {
        navigate(`/truong-dai-hoc/${uni.uni_code}`);
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
                        <img src={`${baseURL}${university.background}`} alt={`Ảnh bìa của ${university.uni_name}`} className="university-image" />
                        <div className="university-info">
                            <img src={`${baseURL}${university.logo}`} alt={`Logo của ${university.uni_name}`} className="university-logo" />
                            <h3>{university.uni_name}</h3>
                            <p>{university.address}</p>
                            <button className="follow-button">Theo dõi</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TruongDaiHoc;
