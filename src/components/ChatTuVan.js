import React, { useState } from 'react';
import '../css/ChatTuVan.css';

const ChatTuVan = () => {
    const [showQuestionHistory, setShowQuestionHistory] = useState(false);

    // Dữ liệu giả cho mục đích hiển thị
    const chatSummary = ["Câu hỏi về ngành CNTT", "Hỏi về học phí"];
    const questionHistory = ["Thông tin về ngành Công nghệ thông tin", "Học phí ngành Kỹ thuật Máy tính"];

    const toggleQuestionHistory = () => {
        setShowQuestionHistory(!showQuestionHistory);
    };

    return (
        <div className="chat-tuvan-container">
            <div className="chat-summary">
                {chatSummary.map((summary, index) => (
                    <p key={index}>{summary}</p>
                ))}
            </div>
            <div className="chat-window">
                {/* Nơi cho chat interface */}
                <div className="chat-input">
                    <input type="text" placeholder="Nhập câu hỏi của bạn..." />
                    <button>Gửi</button>
                </div>
            </div>
            <div className="question-history">
                {questionHistory.map((question, index) => (
                    <p key={index}>{question}</p>
                ))}
            </div>
        </div>
    );
};

export default ChatTuVan;
