import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
const mdParser = new MarkdownIt();

const AdminUniDetail = () => {
    const { uni_code } = useParams();
    const navigate = useNavigate();
    const [university, setUniversity] = useState(null);
    const [majors, setMajors] = useState([]);

    const [selectedMajor, setSelectedMajor] = useState(null);
    const [editInfo, setEditInfo] = useState('');
    const [admissionsInfo, setAdmissionsInfo] = useState('');
    const [admissionsMethod, setAdmissionsMethod] = useState('');
    const [descriptionMajor, setDescriptionMajor] = useState('');
    const [quota, setQuota] = useState('');

    useEffect(() => {
        fetchUniversityDetails();
        fetchMajors();
    }, [uni_code]);

    const fetchUniversityDetails = async () => {
        try {
            const response = await fetch(`http://localhost:2000/api/v1/admin/universities/details/${uni_code}`);
            if (response.ok) {
                const data = await response.json();
                setUniversity(data);
            } else {
                console.error('Failed to fetch university details');
            }
        } catch (error) {
            console.error('Error fetching university details:', error);
        }
    };

    const fetchMajors = async () => {
        try {
            const response = await fetch(`http://localhost:2000/api/v1/admin/major/${uni_code}`);
            if (response.ok) {
                const data = await response.json();
                setMajors(data)
            } else {
                console.error('Failed to fetch majors');
            }
        } catch (error) {
            console.error('Error fetching majors:', error);
        }
    };

    // const handleEditUniversity = async (updatedInfo) => {
    //     try {
    //         const response = await fetch(`http://localhost:2000/api/universities/${uniId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedInfo),
    //         });

    //         if (response.ok) {
    //             // Update UI or refetch university details
    //             fetchUniversityDetails();
    //         } else {
    //             console.error('Failed to update university');
    //         }
    //     } catch (error) {
    //         console.error('Error updating university:', error);
    //     }
    // };


    const handleEditMajor = async () => {
        if (!selectedMajor) return;
        try {
            const updatedInfo = {
                admissions_information: admissionsInfo,
                admissions_method: admissionsMethod,
                description_major: descriptionMajor,
                quota: parseInt(quota),
            };
            const response = await fetch(`http://localhost:2000/api/v1/admin/major/${selectedMajor.major_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInfo),
            });

            if (response.ok) {
                alert('Cập nhật thành công!');
                // Tải lại danh sách ngành sau khi cập nhật
                fetchMajors();
            } else {
                console.error('Failed to update major');
            }
        } catch (error) {
            console.error('Error updating major:', error);
        }
    };

    return (
        <div>
            <h1>{university?.uni_name}</h1>
            <select onChange={(e) => {
                const selected = majors.find(major => major.major_id === parseInt(e.target.value));
                setSelectedMajor(selected);
                setAdmissionsInfo(selected?.admissions_information || '');
                setAdmissionsMethod(selected?.admissions_method || '');
                setDescriptionMajor(selected?.description_major || '');
                setQuota(selected?.quota.toString() || '');
            }}>
                <option value="">Chọn Ngành</option>
                {majors.map((major) => (
                    <option key={major.major_id} value={major.major_id}>{major.major_name}</option>
                ))}
            </select>

            {selectedMajor && (
                <>
                    <p>Thông tin tuyển sinh</p>
                    <MarkdownEditor
                        value={admissionsInfo}
                        style={{ height: '300px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={({ text }) => setAdmissionsInfo(text)}
                    />
                    <p>Phương thức tuyển sinh</p>
                    <MarkdownEditor
                        value={admissionsMethod}
                        style={{ height: '300px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={({ text }) => setAdmissionsMethod(text)}
                    />
                    <p>Giới thiệu ngành</p>
                    <MarkdownEditor
                        value={descriptionMajor}
                        style={{ height: '300px' }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={({ text }) => setDescriptionMajor(text)}
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
                    <button onClick={() => handleEditMajor(selectedMajor?.major_id, { ...selectedMajor, admissions_information: editInfo })}>
                        Lưu Thay Đổi
                    </button>
                </>

            )}
        </div>
    );
};

export default AdminUniDetail;
