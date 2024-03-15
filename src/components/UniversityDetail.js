import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/UniversityDetail.css';
import UET from "../img/UET.png";
import StatisticsModal from '../Modal/StatisticsModal';

const UniversityDetail = () => {
    const { code } = useParams();
    const [admissionScores, setAdmissionScores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState({ uniCode: '', majorCode: '' });
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const [universityDetails, setUniversityDetails] = useState({
        name: "Tên Trường Đại Học",
        address: "Địa chỉ của trường",
        phone: "Số điện thoại",
        website: "Website",
        email: "Email",
    });

    // Hàm để gọi API và lấy dữ liệu
    const fetchUniversityData = async () => {
        try {
            const response = await fetch(`${baseURL}api/v1/admin/score/${code}/majors`);
            const data = await response.json();
            // Xử lý dữ liệu nhận được từ API
            const scores = data.map((item, index) => ({
                id: index,
                major: item.major_name,
                majorCode: item.major_code,
                score: item.admission_score,
                subjectCombination: item.subject_group,
            }));
            setAdmissionScores(scores);
            // Cập nhật thông tin trường đại học nếu API hỗ trợ
            // setUniversityDetails({ ... });
        } catch (error) {
            console.error("Failed to fetch data: ", error);
        }
    };

    useEffect(() => {
        fetchUniversityData();
    }, [code]);


    const openModal = (uniCode, majorCode) => {
        setSelectedMajor({ uniCode, majorCode });
        setIsModalOpen(true);
    };

    return (
        <div className="university-detail-container">
            <div className="university-contact">
                <div>
                    <h2>Thông Tin Liên Hệ</h2>
                    <p>Địa chỉ: {universityDetails.address}</p>
                    <p>Điện thoại: {universityDetails.phone}</p>
                    <p>Website: <a href={universityDetails.website}>{universityDetails.website}</a></p>
                    <p>Email: {universityDetails.email}</p>
                </div>
                <div className='university-logo-unidetail'>
                    <img src={UET} alt="Logo Trường" />
                </div>
            </div>

            <div className="university-admission">
                <h2>Phương Thức Tuyển Sinh 2023</h2>
                {/* Nội dung markdown từ database */}
            </div>

            <div className="university-scores">
                <h2>Điểm Chuẩn Năm 2023</h2>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Ngành</th>
                            <th>Mã Ngành</th>
                            <th>Điểm Chuẩn</th>
                            <th>Tổ Hợp Môn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admissionScores.map((score, index) => (
                            <tr key={score.id}
                                onClick={() => openModal(code, score.majorCode)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{index + 1}</td>
                                <td>{score.major}</td>
                                <td>{score.majorCode}</td>
                                <td>{score.score}</td>
                                <td>{score.subjectCombination}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                <StatisticsModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    uniCode={selectedMajor.uniCode}
                    majorCode={selectedMajor.majorCode}
                />
            </div>
        </div>
    );
}

export default UniversityDetail;
