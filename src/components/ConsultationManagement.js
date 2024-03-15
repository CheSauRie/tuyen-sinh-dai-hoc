import React, { useState, useEffect } from 'react';
import "../css/ConsultationManagement.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import Select from 'react-select'
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLink, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ConsultationManagement = () => {
    const [consultations, setConsultations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [newMeetUrl, setNewMeetUrl] = useState('');
    const [modalType, setModalType] = useState("");
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const fetchConsultation = async () => {
            try {
                const response = await fetch(`${baseURL}api/v1/user/consultation-schedule`);
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

    const handleOpenModal = (scheduleId, type) => {
        setSelectedConsultation(scheduleId);
        setShowModal(true);
        // Thêm trạng thái để xác định loại modal
        setModalType(type); // Bạn cần thêm state modalType
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedConsultation(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const startMeeting = startDate.toISOString();
        const body = modalType === 'time' ? {
            consultation_time: startDate.toISOString(),
        } : {
            meet_url: newMeetUrl,
        };
        try {
            const response = await fetch(`${baseURL}api/v1/user/consultation-schedule/${selectedConsultation}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                alert("Cập nhật thành công!");
                handleCloseModal();
                // Cập nhật danh sách lịch tư vấn mà không cần tải lại trang
                setConsultations(consultations.map(consultation =>
                    consultation.schedule_id === selectedConsultation ? { ...consultation, consultation_time: startMeeting } : consultation
                ));
                setConsultations(consultations.map(consultation =>
                    consultation.schedule_id === selectedConsultation ? { ...consultation, meet_url: newMeetUrl } : consultation
                ));
            } else {
                const errorData = await response.json();
                alert(`Có lỗi xảy ra khi cập nhật: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating consultation:", error);
            alert("Có lỗi xảy ra!");
        }
    };
    const handleAddSchedule = async () => {
        try {
            const response = await fetch(`${baseURL}api/v1/admin/universities`, {
                method: 'GET',
                headers: {
                    'token': `${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUniversities(data.universities.map(uni => ({ value: uni.uni_id, label: uni.uni_name })));
            } else {
                console.error("Failed to fetch universities");
            }
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
        setShowModal(true);
        setModalType('add');
    };
    const handleSubmitAddConsultation = async (e) => {
        e.preventDefault();
        if (!selectedUniversity) {
            alert('Vui lòng chọn trường đại học.');
            return;
        }

        const body = {
            uni_id: selectedUniversity.value,
            consultation_time: startDate.toISOString(),
        };

        try {
            const response = await fetch(`${baseURL}api/v1/user/consultation-schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const newConsultation = await response.json();
                if (newConsultation && newConsultation.schedule) {
                    setConsultations(currentConsultations => [...currentConsultations, {
                        ...newConsultation.schedule,
                        uni_name: selectedUniversity.label
                    }]);
                    toast.success("Thêm lịch thành công")
                    handleCloseModal();
                } else {
                    alert("Có lỗi xảy ra khi cập nhật danh sách tư vấn.");
                }
            } else {
                alert("Có lỗi xảy ra khi thêm lịch tư vấn!");
            }
        } catch (error) {
            console.error("Error adding consultation schedule:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (window.confirm("Bạn có chắc xóa lịch này")) {
            try {
                const response = await fetch(`${baseURL}api/v1/user/consultation-schedule/${scheduleId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    toast.success("Xóa thành công")
                    // Cập nhật state để loại bỏ lịch tư vấn đã xóa
                    setConsultations(consultations.filter(schedule => schedule.schedule_id !== scheduleId));
                } else {
                    alert("Xóa thất bại");
                }
            } catch (error) {
                console.error("Error deleting schedule:", error);
                alert("Error deleting schedule.");
            }
        }
    };

    const filteredConsultations = searchTerm.length > 0
        ? consultations.filter(consultation =>
            consultation.uni_name.toLowerCase().includes(searchTerm.toLowerCase()))
        : consultations;

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="consultation-management">
            <h2 className="consultation-management__title">Quản Lý Tư vấn Online</h2>
            {/* Modal */}
            {showModal && (modalType === 'time' || modalType === 'meet') && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        <span className="update-modal-close" onClick={handleCloseModal}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <h2>Cập Nhật {modalType === 'time' ? 'Thời Gian' : 'Link Google Meet'}</h2>
                            {modalType === 'time' ? (
                                <div>
                                    <label>Thời gian bắt đầu:</label>
                                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                                </div>
                            ) : (
                                <div>
                                    <label>Link Google Meet mới:</label>
                                    <input type="text" value={newMeetUrl} onChange={(e) => setNewMeetUrl(e.target.value)} />
                                </div>
                            )}
                            <button type="submit" className='update-consultation-button'>Cập nhật</button>
                        </form>
                    </div>
                </div>
            )}
            {showModal && modalType === 'add' && (
                <div className="update-modal">
                    <div className="update-modal-content">
                        <span className="update-modal-close" onClick={handleCloseModal}>&times;</span>
                        <form onSubmit={handleSubmitAddConsultation}>
                            <h2>Thêm Lịch Tư Vấn Mới</h2>
                            <div>
                                <label>Chọn trường đại học:</label>
                                <Select
                                    value={selectedUniversity}
                                    onChange={setSelectedUniversity}
                                    options={universities}
                                />
                            </div>
                            <div>
                                <label>Thời gian tư vấn:</label>
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                            </div>
                            <button type="submit" className='update-consultation-button'>Thêm</button>
                        </form>
                    </div>
                </div>
            )}

            <button className="add-schedule-btn" onClick={handleAddSchedule}>Thêm Lịch</button>
            <div className="consultation-management__search">
                <input
                    type="text"
                    placeholder="Tìm kiếm trường đại học..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <table className="consultation-management__table">
                <thead>
                    <tr>
                        <th>Tên Trường</th>
                        <th>Lịch</th>
                        <th>Link meet</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredConsultations.map((consultation) => (
                        <tr key={consultation.schedule_id}>
                            <td>{consultation.uni_name || 'N/A'}</td>
                            <td>{format(new Date(consultation.consultation_time), "dd/MM/yyyy HH:mm:ss") || 'N/A'}</td>
                            <td>{consultation.meet_url || 'N/A'}</td>
                            <td>
                                <button className="consultation-management__icon-btn" onClick={() => handleOpenModal(consultation.schedule_id, "time")}>
                                    <FontAwesomeIcon icon={faEdit} title="Cập Nhật" />
                                </button>
                                <button className="consultation-management__icon-btn" onClick={() => handleOpenModal(consultation.schedule_id, 'meet')}>
                                    <FontAwesomeIcon icon={faLink} title="Cập Nhật Link Meet" />
                                </button>
                                <button className="consultation-management__icon-btn" onClick={() => handleDeleteSchedule(consultation.schedule_id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} title="Xóa" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultationManagement;
