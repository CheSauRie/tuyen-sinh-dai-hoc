import React, { useState } from 'react';
import '../css/ChatTuVan.css';

const ChatTuVan = () => {
    const [showQuestionHistory, setShowQuestionHistory] = useState(false);
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    // Dữ liệu giả cho mục đích hiển thị
    const chatSummary = ["Câu hỏi về ngành CNTT", "Hỏi về học phí"];
    const questionHistory = ["Thông tin về ngành Công nghệ thông tin", "Học phí ngành Kỹ thuật Máy tính"];

    const toggleQuestionHistory = () => {
        setShowQuestionHistory(!showQuestionHistory);
    };

    const handleSendQuestion = async () => {
        if (!question.trim()) return;

        const timestamp = Date.now(); // Sử dụng timestamp làm ID duy nhất
        const newChatEntry = { id: timestamp, question, answer: 'Đang chờ phản hồi...', isLoading: true };
        setChatHistory(chatHistory => [...chatHistory, newChatEntry]);

        try {
            const response = await fetch('http://localhost:2000/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            const responseData = await response.text();
            if (response.ok) {
                console.log(responseData);
                setChatHistory(chatHistory =>
                    chatHistory.map(chat =>
                        chat.id === timestamp ? { ...chat, answer: responseData, isLoading: false } : chat
                    )
                );
            } else {
                console.error('Lỗi khi gửi câu hỏi:', responseData);
            }
        } catch (error) {
            console.error('Lỗi khi kết nối với API:', error);
        }

        setQuestion('');
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
                <div className="chat-messages">
                    {chatHistory.map((chat) => (
                        <div key={chat.id}>
                            <p><strong>Bạn:</strong> {chat.question}</p>
                            <p>
                                <strong>Phản hồi:</strong>
                                {chat.isLoading ? <span className="loading-animation"></span> : chat.answer}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <button onClick={handleSendQuestion}>Gửi</button>
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
