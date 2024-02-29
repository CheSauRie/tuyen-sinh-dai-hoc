import React, { useState, useEffect } from 'react';
import "../css/ConsultationManagement.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ConsultationManagement = () => {
    const [consultations, setConsultations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        const fetchConsultation = async () => {
            try {
                const response = await fetch(`http://localhost:2000/api/v1/user/consultation`);
                if (response.ok) {
                    const data = await response.json();
                    setConsultations(data);
                } else {
                    console.error("Failed to fetch consultation");
                }
            } catch (error) {
                console.error("Error fetching consultation:", error);
            }
        };
        fetchConsultation();
    }, []);

    const handleOpenModal = (consultation) => {
        setSelectedConsultation(consultation);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedConsultation(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startMeeting = new Date(startDate);
        const endMeeting = new Date(startMeeting.getTime() + 60 * 60 * 1000);
        const body = {
            consultation_id: selectedConsultation,
            start_meeting: startDate.toISOString(),
            end_meeting: endMeeting.toISOString(),
        };
        console.log(body);
        try {
            const response = await fetch('http://localhost:2000/api/v1/user/consultation/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                alert("Cập nhật thành công!");
                handleCloseModal();
            } else {
                alert("Có lỗi xảy ra khi cập nhật!");
            }
        } catch (error) {
            console.error("Error updating consultation:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <div className="consultation-management">
            <h2 className="consultation-management__title">Quản Lý Yêu Cầu Tư Vấn</h2>
            {/* Modal */}
            {showModal && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        <span className="update-modal-close" onClick={handleCloseModal}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <h2>Cập Nhật Trạng Thái</h2>
                            <div>
                                <label>Thời gian bắt đầu:</label>
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                            </div>
                            <button type="submit" className='update-consultation-button'>Cập nhật</button>
                        </form>
                    </div>
                </div>
            )}
            <table className="consultation-management__table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Người Dùng</th>
                        <th>Email</th>
                        <th>Số Điện Thoại</th>
                        <th>Thông Tin Tư Vấn</th>
                        <th>Ngành</th>
                        <th>Trường Đại Học</th>
                        <th>Trạng Thái</th>
                        <th>Meet</th>
                        <th>Thời gian</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {consultations.map((consultation) => (
                        <tr key={consultation.consultation_id}>
                            <td>{consultation.consultation_id}</td>
                            <td>{consultation.consultation_name || 'N/A'}</td>
                            <td>{consultation.consultation_email || 'N/A'}</td>
                            <td>{consultation.consultation_phone || 'N/A'}</td>
                            <td>{consultation.consulting_information}</td>
                            <td>{consultation.major_name}</td>
                            <td>{consultation.uni_name}</td>
                            <td>{consultation.status ? 'Đã Xử Lý' : 'Chưa Xử Lý'}</td>
                            <td>{consultation.meet_url || 'N/A'}</td>
                            <td>{consultation.consultation_time || 'N/A'}</td>
                            <td>
                                <button className="consultation-management__update-btn" onClick={() => handleOpenModal(consultation.consultation_id)}>Cập Nhật</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultationManagement;
