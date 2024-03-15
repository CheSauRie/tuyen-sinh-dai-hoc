import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/adminPage.css";
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const navigate = useNavigate();
    const mdParser = new MarkdownIt();
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const [uniInfo, setUniInfo] = useState({
        uni_code: '',
        uni_name: '',
        address: '',
        phone: '',
        website: '',
        email: '',
        description: ''
    });
    const [markdownContent, setMarkdownContent] = useState({
        mission: '',
        admissions_criteria: '',
        admission_method: '',
        tution_fee: '',
        teaching_staff: '',
        dormitory: '',
        library: '',
    });
    const [images, setImages] = useState({
        logo: null,
        background: null
    });

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/');
        }
    }, [navigate]);

    const handleUniInfoChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setImages(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else {
            setUniInfo(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleMarkdownChange = ({ html, text }, name) => {
        setMarkdownContent(prevState => ({
            ...prevState,
            [name]: text
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(uniInfo).forEach(key => formData.append(key, uniInfo[key]));
        Object.keys(markdownContent).forEach(key => formData.append(key, markdownContent[key]));
        Object.keys(images).forEach(key => {
            if (images[key]) formData.append(key, images[key]);
        });
        // Gửi FormData đến server
        const response = await fetch(`${baseURL}api/v1/admin/universities`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Data successfully saved');
            toast.success("Thêm thành công")
        } else {
            console.error('Failed to save data');
        }
    };

    return (
        <div className="admin-container">
            <form onSubmit={handleSubmit}>
                {/* Render input fields for university info */}
                {Object.keys(uniInfo).map((key) => (
                    <input
                        key={key}
                        type="text"
                        name={key}
                        value={uniInfo[key]}
                        onChange={handleUniInfoChange}
                        placeholder={key}
                    />
                ))}

                {/* Render markdown editors for markdown content */}
                {Object.keys(markdownContent).map((key) => (
                    <div key={key}>
                        <h3>{key}</h3>
                        <MarkdownEditor
                            value={markdownContent[key]}
                            style={{ height: '250px' }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={(data) => handleMarkdownChange(data, key)}
                        />
                    </div>
                ))}
                <div>
                    <h3>Logo</h3>
                    <input
                        type="file"
                        name="logo"
                        onChange={handleUniInfoChange}
                        accept="image/*"
                    />
                </div>
                <div>
                    <h3>Background</h3>
                    <input
                        type="file"
                        name="background"
                        onChange={handleUniInfoChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Save Data</button>
            </form>
        </div>
    );
};

export default AdminPage;
