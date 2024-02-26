import React, { useState, useEffect, useRef } from 'react';
import '../css/ChatTuVan.css';

const ChatTuVan = () => {
    const [question, setQuestion] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedChatDetails, setSelectedChatDetails] = useState([]);
    const [chatSummary, setChatSummary] = useState([]); // Update state này để lưu trữ danh sách chat
    const [questionHistory, setQuestionHistory] = useState([]); // Update state này để lưu trữ lịch sử câu hỏi
    const [isNewChat, setIsNewChat] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem('token'); // Hoặc lấy token từ nơi bạn lưu trữ
            try {
                const response = await fetch('http://localhost:2000/api/v1/chat/get-chat', {
                    method: 'GET',
                    headers: {
                        'token': `${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chat summary');
                }

                const data = await response.json();
                setChatSummary(data); // Giả sử API trả về một mảng các đoạn chat
                // setQuestionHistory(data); // Update state này nếu bạn cũng muốn lấy lịch sử câu hỏi từ API
            } catch (error) {
                console.error('Error fetching chat summary:', error);
            }
        };

        fetchChats();
    }, []); // Chỉ chạy một lần khi component mount


    const fetchChatDetails = async (chatId) => {
        try {
            const url = new URL('http://localhost:2000/api/v1/chat/detail-message');
            url.searchParams.append('chat_id', chatId);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'token': `${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chat details');
            }

            const data = await response.json();
            setSelectedChatDetails(data);
            setSelectedChatId(chatId);
            setQuestionHistory(data);
            setIsNewChat(false);
        } catch (error) {
            console.error('Error fetching chat details:', error);
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            const token = localStorage.getItem('token'); // Hoặc lấy token từ nơi bạn lưu trữ
            const response = await fetch(`http://localhost:2000/api/v1/chat/delete-chat?chat_id=${chatId}`, {
                method: 'DELETE', // Phương thức DELETE để xóa dữ liệu
                headers: {
                    'token': `${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat');
            }

            // Xóa đoạn chat khỏi state sau khi xóa thành công trên server
            setChatSummary(chatSummary.filter(chat => chat.chat_id !== chatId));

            // Nếu đoạn chat được xóa đang được xem chi tiết, cần xóa chi tiết đoạn chat đó
            if (selectedChatId === chatId) {
                setSelectedChatDetails([]);
                setSelectedChatId(null);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const handleServerResponse = (responseData) => {
        setSelectedChatDetails(prevDetails =>
            prevDetails.map(detail =>
                detail.tempId === responseData.tempId ? {
                    ...detail,
                    id: responseData.message_id, // Cập nhật ID thực từ server
                    answer: responseData.answer, // Cập nhật câu trả lời
                    isLoading: false, // Đánh dấu đã nhận phản hồi
                    tempId: undefined // Xóa tempId
                } : detail
            ).filter(detail => detail.tempId === undefined || detail.id) // Loại bỏ entry tạm thời nếu cần
        );
    };
    const handleSendQuestion = async () => {
        if (!question.trim()) return;

        let currentChatId = selectedChatId;
        const tempId = Date.now(); // ID tạm thời cho entry mới
        // // Thêm entry tạm thời vào selectedChatDetails
        setSelectedChatDetails(prev => [...prev, { tempId, question, answer: 'Đang chờ phản hồi...', isLoading: true }]);
        if (isNewChat) {
            try {
                const response = await fetch('http://localhost:2000/api/v1/chat/create-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${localStorage.getItem('token')}` // Thay đổi header phù hợp
                    },
                    body: JSON.stringify({ question: question }) // Điều chỉnh payload phù hợp với API của bạn
                });
                const newChat = await response.json();
                currentChatId = newChat.chat_id;
                //Cập nhật chatSummary để thêm chat mới
                setChatSummary(prevChats => [...prevChats, {
                    chat_id: newChat.chat_id,
                    summary: newChat.summary,
                    createdAt: new Date().toISOString() // Hoặc sử dụng timestamp từ server nếu có
                }]); // Giả sử API trả về chat_id của chat mới
                setIsNewChat(false); // Đặt lại trạng thái isNewChat
            } catch (error) {
                console.error('Lỗi khi tạo chat mới:', error);
                return;
            }
        }

        if (currentChatId) {
            // const newChatEntry = { id: Date.now(), question, answer: 'Đang chờ phản hồi...', isLoading: true };
            // setSelectedChatDetails(chatHistory => [...chatHistory, newChatEntry]);

            try {
                const response = await fetch('http://localhost:2000/api/v1/chat/create-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ chat_id: currentChatId, question })
                });

                const responseData = await response.json();
                if (responseData) {
                    handleServerResponse({ ...responseData, tempId });
                    setQuestion('');
                } else {
                    console.error('Lỗi khi gửi câu hỏi:', responseData.message); // Giả sử API trả về thông điệp lỗi trong responseData.message
                }
            } catch (error) {
                console.error('Lỗi khi kết nối với API:', error);
            }
        }
        setQuestion('');
    };

    const handleQuestionClick = (messageId) => {
        const questionElement = document.getElementById(`chat_${messageId}`);
        if (questionElement) {
            questionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    };


    const handleAddChat = () => {
        setSelectedChatDetails([]); // Xóa nội dung hiển thị ở giữa
        setSelectedChatId(null); // Đánh dấu không có chat nào được chọn
        setIsNewChat(true); // Đặt trạng thái để biết là đang tạo chat mới
        setQuestion(''); // Xóa câu hỏi hiện tại trong input
        setQuestionHistory([])
    };

    return (
        <div className="chat-tuvan-container">
            <div className="chat-summary">
                <button className="add-chat-btn" onClick={handleAddChat}>Thêm Chat</button>
                {chatSummary.map((chat) => (
                    <div key={chat.chat_id} className="chat-item" onClick={() => fetchChatDetails(chat.chat_id)}>
                        <p>{chat.summary}</p>
                        <small>{new Date(chat.createdAt).toLocaleString()}</small>
                        <button className="delete-chat-btn" onClick={() => handleDeleteChat(chat.chat_id)}>Xóa</button>
                    </div>
                ))}
            </div>
            <div className="chat-window">
                {/* Nơi cho chat interface */}
                <div className="chat-messages">
                    {selectedChatDetails.map((detail) => (
                        <div key={detail.message_id} id={`chat_${detail.message_id}`} >
                            <p><strong>Bạn:</strong> {detail.question}</p>
                            <p><strong>Phản hồi:</strong> {detail.isLoading ? <span className="loading-animation"></span> : detail.answer}</p>
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
                    <div key={index} className="question-item" onClick={() => handleQuestionClick(question.message_id)}>
                        <p>{question.summary}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatTuVan;
