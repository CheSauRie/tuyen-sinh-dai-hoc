import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/UniversityDetail.css'; // Đảm bảo bạn đã tạo file CSS này
import UET from "../img/UET.png"
const UniversityDetail = () => {
    const { code } = useParams();
    // Giả định thông tin chi tiết và dữ liệu khác từ database

    // const [universityDetails, setUniversityDetails] = useState(null);
    // useEffect(() => {
    //     // Tạm thời giả định rằng chúng ta có một hàm lấy thông tin trường đại học dựa trên mã
    //     fetchUniversityDetails(code);
    // }, [code]);

    // const fetchUniversityDetails = async (uniCode) => {
    //     // Giả định rằng chúng ta có một API hoặc cách lấy dữ liệu dựa trên mã trường
    //     // Ví dụ: fetch('/api/universities/' + uniCode)
    //     // Lưu ý: Đây chỉ là ví dụ giả định
    //     const response = await fetch('/api/universities/' + uniCode); // Đường dẫn giả định
    //     const data = await response.json();
    //     setUniversityDetails(data);
    // };

    // if (!universityDetails) {
    //     return <div>Loading...</div>;
    // }

    const universityDetails = {
        name: "Tên Trường Đại Học",
        address: "Địa chỉ của trường",
        phone: "Số điện thoại",
        website: "Website",
        email: "Email",
        // Các thông tin khác
    };

    // Dữ liệu giả định cho điểm chuẩn
    const admissionScores = [
        { id: 1, major: "Ngành A", majorCode: "001", score: 25, subjectCombination: "Toán, Lý, Hóa" },
        // Thêm các ngành khác tại đây
    ];

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
                    {/* Logo của trường */}
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
                            <tr key={score.id}>
                                <td>{index + 1}</td>
                                <td>{score.major}</td>
                                <td>{score.majorCode}</td>
                                <td>{score.score}</td>
                                <td>{score.subjectCombination}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UniversityDetail;
