import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/ManageUniversities.css"
import MarkdownEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ManageUniversities = () => {
    const [universities, setUniversities] = useState([]);
    const navigate = useNavigate();
    const [majorName, setMajorName] = useState('');
    const [majorCode, setMajorCode] = useState('');
    const [admissionsInfo, setAdmissionsInfo] = useState('');
    const [admissionsMethod, setAdmissionsMethod] = useState('');
    const [descriptionMajor, setDescriptionMajor] = useState('');
    const [showAddMajorModal, setShowAddMajorModal] = useState(false);
    const [currentUniIdForNewMajor, setCurrentUniIdForNewMajor] = useState(null);
    const mdParser = new MarkdownIt();
    const [quota, setQuota] = useState('');
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const openAddMajorModal = (uniId) => {
        setCurrentUniIdForNewMajor(uniId);
        setShowAddMajorModal(true);
    };
    const handleEditorChange = ({ html, text }, setState) => {
        setState(text);
    };
    useEffect(() => {
        // Hàm lấy danh sách trường học từ server
        const fetchUniversities = async () => {
            const response = await fetch(`${baseURL}api/v1/admin/universities`);
            if (response.ok) {
                const data = await response.json();
                setUniversities(data.universities);
            } else {
                console.log("Lỗi lấy danh sách trường học");
            }
        };

        fetchUniversities();
    }, []);

    const handleDelete = async (uniId) => {
        // Gửi yêu cầu xóa trường học đến server
        const response = await fetch(`${baseURL}api/v1/admin/universities/${uniId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Cập nhật danh sách trường học sau khi xóa
            setUniversities(universities.filter(uni => uni.uni_id !== uniId));
        } else {
            // Xử lý lỗi (ví dụ: thông báo)
        }
    };

    const handleAddMajor = async (e) => {
        e.preventDefault();
        // Gửi yêu cầu thêm major mới đến server
        const response = await fetch(`${baseURL}api/v1/admin/major`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uni_id: currentUniIdForNewMajor,
                major_name: majorName,
                major_code: majorCode,
                admissions_information: admissionsInfo,
                admissions_method: admissionsMethod,
                description_major: descriptionMajor,
                quota: quota
            }),
        });

        if (response.ok) {
            // Xử lý sau khi thêm thành công
            setMajorName('');
            setMajorCode('');
            setAdmissionsInfo('');
            setAdmissionsMethod('');
            setDescriptionMajor("");
            setQuota("")
            alert("Thêm thành công")
        } else {
            alert("Lỗi")
        }
    };

    return (
        <div className='admin-manage-uni-container'>
            <h1>Quản Lý Trường Học</h1>
            <table>
                <thead>
                    <tr>
                        <th>Mã Trường</th>
                        <th>Tên Trường</th>
                        <th>Địa Chỉ</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {universities.map((uni) => (
                        <tr key={uni.uni_id}>
                            <td>{uni.uni_code}</td>
                            <td>{uni.uni_name}</td>
                            <td>{uni.address}</td>
                            <td>
                                {/* <button onClick={() => handleDelete(uni.uni_id)}>Xóa</button> */}
                                <button className="manage-uni-button" onClick={() => openAddMajorModal(uni.uni_id)} title="Thêm Ngành">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                                <button className="manage-uni-button" onClick={() => navigate(`/admin/university/${uni.uni_code}`)} title="Chi Tiết">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddMajorModal && (
                <div className="add-major-modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setShowAddMajorModal(false)}>&times;</span>
                        <h2>Thêm Ngành Mới</h2>
                        <form onSubmit={handleAddMajor}>
                            <input
                                type="text"
                                placeholder="Tên Ngành"
                                value={majorName}
                                onChange={(e) => setMajorName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Mã Ngành"
                                value={majorCode}
                                onChange={(e) => setMajorCode(e.target.value)}
                            />
                            <p>Thông tin tuyển sinh</p>
                            <MarkdownEditor
                                value={admissionsInfo}
                                style={{ height: '200px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={(e) => handleEditorChange(e, setAdmissionsInfo)}
                            />
                            <p>Phương thức tuyển sinh</p>
                            <MarkdownEditor
                                value={admissionsMethod}
                                style={{ height: '200px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={(e) => handleEditorChange(e, setAdmissionsMethod)}
                            />
                            <p>Giới thiệu ngành</p>
                            <MarkdownEditor
                                value={descriptionMajor}
                                style={{ height: '200px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={(e) => handleEditorChange(e, setDescriptionMajor)}
                            />
                            <div>
                                <label htmlFor="quota">Chỉ tiêu:</label>
                                <input
                                    type="number"
                                    id="quota"
                                    name="quota"
                                    value={quota}
                                    onChange={(e) => setQuota(e.target.value)}
                                />
                            </div>
                            <button type="submit">Thêm Ngành</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageUniversities;
