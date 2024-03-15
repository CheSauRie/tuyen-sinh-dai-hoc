import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../css/MajorDetail.css';

const MajorDetail = () => {
    const { uni_code, major_name } = useParams();
    const [majorDetails, setMajorDetails] = useState(null);
    const [universityData, setUniversityData] = useState({});
    const [otherMajors, setOtherMajors] = useState([]);
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const fetchMajorDetails = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/admin/major/${uni_code}`);
                if (response.ok) {
                    const majors = await response.json();
                    const major = majors.find(m => m.major_name === major_name);
                    if (major) {
                        setMajorDetails(major);
                    }
                } else {
                    console.error("Failed to fetch major details");
                }
            } catch (error) {
                console.error("Error fetching major details: ", error);
            }
        };

        const fetchUniversityDetails = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/admin/universities/details/${uni_code}`);
                if (response.ok) {
                    const data = await response.json();
                    setUniversityData({
                        logo: `${baseURL}${data.logo.replace(/\\/g, '/')}`
                    });
                } else {
                    console.error("Failed to fetch university details");
                }
            } catch (error) {
                console.error("Error fetching university details: ", error);
            }
        };
        const fetchOtherMajors = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/admin/major/${uni_code}`);
                if (response.ok) {
                    const majors = await response.json();
                    const otherMajors = majors.filter(m => m.major_name !== major_name);
                    setOtherMajors(otherMajors);
                } else {
                    console.error("Failed to fetch other majors");
                }
            } catch (error) {
                console.error("Error fetching other majors: ", error);
            }
        };

        fetchOtherMajors();
        fetchMajorDetails();
        fetchUniversityDetails();
    }, [uni_code, major_name]);

    if (!majorDetails) return <div>Loading...</div>;
    const handleMajorClick = (selectedMajor) => {
        navigate(`/truong-dai-hoc/${uni_code}/chi-tiet-nganh/${selectedMajor.major_name}`);
    };

    return (
        <div className="major-detail-container">
            <div className="row header">
                {universityData.logo && (
                    <div className="university-logo">
                        <img src={universityData.logo} alt="Logo của trường" />
                    </div>
                )}
                <div className="name-info">
                    <h2>{majorDetails.major_name}</h2>
                    <h3>Mã ngành: {majorDetails.major_code}</h3>
                    <h3>Chỉ tiêu: {majorDetails.quota}</h3>
                </div>
            </div>

            <div className="row content">
                <div className="major-details">
                    <h4>Thông tin tuyển sinh</h4>
                    <ReactMarkdown>{majorDetails.admissions_information}</ReactMarkdown>
                    <h4>Phương thức tuyển sinh</h4>
                    <ReactMarkdown>{majorDetails.admissions_method}</ReactMarkdown>
                    <h4>Mô tả ngành</h4>
                    <ReactMarkdown>{majorDetails.description_major}</ReactMarkdown>
                </div>
                <div className="other-majors">
                    <h4>Các Ngành Khác</h4>
                    {otherMajors.map((major, index) => (
                        <div key={index} className="other-major-item" onClick={() => handleMajorClick(major)}>
                            <h5>{major.major_name}</h5>
                            <p>Mã ngành: {major.major_code}</p>
                            <p>Chỉ tiêu: {major.quota}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MajorDetail;
