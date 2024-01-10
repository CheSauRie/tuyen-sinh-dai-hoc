import React from 'react';
import '../css/MajorDetail.css'; // Đảm bảo bạn đã tạo file CSS này
import UET from '../img/UET.png'
const MajorDetail = () => {
    // Giả sử bạn có dữ liệu cho component này
    const universityData = {
        name: 'Tên Trường Đại Học',
        logo: UET,
        // Các dữ liệu khác
    };

    const currentMajor = {
        name: 'Tên Ngành',
        markdownContent: 'Nội dung markdown chi tiết ngành', // Nội dung markdown
        // Các thông tin khác của ngành
    };

    const otherMajors = [
        // Danh sách các ngành còn lại
    ];

    return (
        <div className="major-detail-container">
            {/* Dòng 1: Logo, Tên ngành và Tên trường */}
            <div className="row header">
                <div className="logo">
                    <img src={universityData.logo} alt="Logo trường" />
                </div>
                <div className="name-info">
                    <h2>{currentMajor.name}</h2>
                    <h3>{universityData.name}</h3>
                </div>
            </div>

            {/* Dòng 2: Chi tiết ngành và các ngành còn lại */}
            <div className="row content">
                <div className="major-details">
                    {/* Chi tiết ngành dạng markdown */}
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                </div>
                <div className="other-majors">
                    {/* Danh sách các ngành còn lại */}
                    <p>hi</p>
                </div>
            </div>
        </div>
    );
};

export default MajorDetail;
