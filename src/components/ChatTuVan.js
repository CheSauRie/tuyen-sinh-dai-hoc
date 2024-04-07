import React, { useState, useEffect } from 'react';
import '../css/ChatTuVan.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Linkify from 'react-linkify';

const ChatTuVan = () => {
    const [question, setQuestion] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedChatDetails, setSelectedChatDetails] = useState([]);
    const [chatSummary, setChatSummary] = useState([]);
    const [questionHistory, setQuestionHistory] = useState([]);
    const [isNewChat, setIsNewChat] = useState(true);
    const navigate = useNavigate();
    const [highlightedQuestionId, setHighlightedQuestionId] = useState(null);
    const [highlightTimeoutId, setHighlightTimeoutId] = useState(null);
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem('token'); // Lấy token
            try {
                const response = await fetch(`${baseURL}api/v1/chat/get-chat`, {
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
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setChatSummary(data); // Lưu data vào cột bên trái
            } catch (error) {
                console.error('Error fetching chat summary:', error);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/dang-nhap');
        }
        fetchChats();
    }, [navigate]);
    useEffect(() => {
        return () => {
            if (highlightTimeoutId) {
                clearTimeout(highlightTimeoutId);
            }
        };
    }, [highlightTimeoutId]);

    const checkScrollPosition = () => {
        const chatWindow = document.querySelector('.chat-window');
        const scrollTop = chatWindow.scrollTop;
        const scrollHeight = chatWindow.scrollHeight;
        const clientHeight = chatWindow.clientHeight;

        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

        setShowScrollButton(!atBottom);
    };
    const scrollToBottom = (e) => {
        e.stopPropagation()
        const chatWindow = document.querySelector('.chat-window');
        chatWindow.scrollTo({
            top: chatWindow.scrollHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const chatWindow = document.querySelector('.chat-window');
        chatWindow.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition();
        return () => {
            chatWindow.removeEventListener('scroll', checkScrollPosition);
        };
    }, []);
    // Hàm lấy chi tiết của 1 đoạn chat
    const fetchChatDetails = async (chatId) => {
        try {
            const url = new URL(`${baseURL}api/v1/chat/detail-message`);
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
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}api/v1/chat/delete-chat?chat_id=${chatId}`, {
                method: 'DELETE',
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
        // Kiểm tra nếu phản hồi có trạng thái lỗi
        if (responseData.error) {
            setSelectedChatDetails(prevDetails =>
                prevDetails.map(detail =>
                    detail.tempId === responseData.tempId ? {
                        ...detail,
                        answer: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                        isLoading: false,
                        isError: true, // Đánh dấu là có lỗi
                        tempId: undefined
                    } : detail
                )
            );
        } else {
            // Xử lý như bình thường nếu không có lỗi
            setSelectedChatDetails(prevDetails =>
                prevDetails.map(detail =>
                    detail.tempId === responseData.tempId ? {
                        ...detail,
                        id: responseData.message_id,
                        answer: responseData.answer,
                        isLoading: false,
                        tempId: undefined
                    } : detail
                ).filter(detail => detail.tempId === undefined || detail.id)
            );
        }
    };


    const handleSendQuestion = async () => {
        if (!question.trim()) return;

        let currentChatId = selectedChatId;
        const tempId = Date.now();
        setSelectedChatDetails(prev => [...prev, { tempId, question, answer: 'Đang chờ phản hồi...', isLoading: true }]);
        const timeoutId = setTimeout(() => {
            toast.info('Vui lòng đợi trong giây lát...');
        }, 30000);
        if (isNewChat) {
            try {
                const response = await fetch(`${baseURL}api/v1/chat/create-chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ question: question })
                });
                const newChat = await response.json();
                currentChatId = newChat.chat_id;
                setChatSummary(prevChats => [...prevChats, {
                    chat_id: newChat.chat_id,
                    summary: newChat.summary,
                    createdAt: new Date().toISOString()
                }]);
                setIsNewChat(false);
                setQuestion('');
                clearTimeout(timeoutId);
            } catch (error) {
                console.error('Lỗi khi tạo chat mới:', error);
                return;
            }
        }

        if (currentChatId) {
            try {
                const response = await fetch(`${baseURL}api/v1/chat/create-message`, {
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
                    setQuestionHistory(prevChats => [...prevChats, {
                        summary: responseData.summary,
                    }]);
                    setQuestion('');
                    clearTimeout(timeoutId);
                } else {
                    console.error('Lỗi khi gửi câu hỏi:', responseData.message);
                }
            } catch (error) {
                console.error('Lỗi khi kết nối với API:', error);
            }
        }
        setQuestion('');
        clearTimeout(timeoutId);
    };

    const handleQuestionClick = (messageId) => {
        // setHighlightedQuestionId(messageId);
        const questionElement = document.getElementById(`chat_${messageId}`);
        if (questionElement) {
            questionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });

            // Clear timeout trước đó nếu có
            if (highlightTimeoutId) {
                clearTimeout(highlightTimeoutId);
            }

            // Đặt timeout mới để highlight câu hỏi sau khi đã scroll
            const newTimeoutId = setTimeout(() => {
                setHighlightedQuestionId(messageId);
            }, 500); // Đặt thời gian chờ là 500ms, tương ứng với thời gian scroll

            setHighlightTimeoutId(newTimeoutId);
        }
    };

    const handleAddChat = () => {
        setSelectedChatDetails([]); // Xóa nội dung hiển thị ở giữa
        setSelectedChatId(null); // Đánh dấu không có chat nào được chọn
        setIsNewChat(true); // Đặt trạng thái để biết là đang tạo chat mới
        setQuestion(''); // Xóa câu hỏi hiện tại trong input
        setQuestionHistory([])
    };

    const confirmAndDeleteChat = async (chatId) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa đoạn chat này không?");
        if (confirm) {
            await handleDeleteChat(chatId);
            toast.success("Xóa đoạn chat thành công!");
        }
    };

    const linkDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    const formatReferencesAndRelatedQuestions = (text) => {
        if (typeof text !== 'string') {
            console.error('Giá trị được cung cấp cho formatReferencesAndRelatedQuestions không phải là chuỗi.');
            return { relatedQuestions: '', references: '' };
        }

        // Sử dụng Regex để tìm kiếm linh hoạt với hoặc không có dấu ngoặc vuông
        const relatedQuestionsRegex = /\[?Related Questions:\]?/;
        const referencesRegex = /\[?Nguồn tham khảo:\]?/;

        const relatedQuestionsMatch = text.match(relatedQuestionsRegex);
        const referencesMatch = text.match(referencesRegex);

        const relatedQuestionsIndex = relatedQuestionsMatch ? text.indexOf(relatedQuestionsMatch[0]) : -1;
        const referencesIndex = referencesMatch ? text.indexOf(referencesMatch[0]) : -1;

        // Lấy phần văn bản trước "Related Questions:" hoặc "Nguồn tham khảo:"
        const mainText = text.substring(0, relatedQuestionsIndex !== -1 ? relatedQuestionsIndex : referencesIndex !== -1 ? referencesIndex : text.length);

        let relatedQuestionsText = "";
        let referencesText = "";

        if (relatedQuestionsIndex !== -1) {
            relatedQuestionsText = text.substring(relatedQuestionsIndex, referencesIndex !== -1 ? referencesIndex : text.length);
        }

        if (referencesIndex !== -1) {
            referencesText = text.substring(referencesIndex);
        }

        // Xử lý và format "Câu hỏi liên quan"
        const relatedQuestions = relatedQuestionsText.split(/\d\./).slice(1).map(q => q.trim());
        const formattedRelatedQuestions = relatedQuestions.map((question, index) => (
            <li key={`rq-${index}`}
                onClick={() => setQuestion(question)} // Khi nhấp vào, đặt câu hỏi vào ô input
                style={{ cursor: 'pointer' }}> {/* Tùy chỉnh style cho đẹp mắt */}
                {question}
            </li>
        ));

        // Xử lý và format "Nguồn tham khảo"
        const references = [];
        const referenceRegex = /(\d+)\.\s(.*?)(https?:\/\/[^\s]+)/g;
        let match;
        while ((match = referenceRegex.exec(referencesText)) !== null) {
            references.push({
                id: match[1],
                title: match[2],
                url: match[3]
            });
        }

        const formattedReferences = references.map((ref, index) => (
            <li key={`ref-${index}`}><a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a></li>
        ));

        return (
            <div>
                <p>{mainText}</p>
                {formattedRelatedQuestions.length > 0 && (
                    <div>
                        <h3>Câu hỏi liên quan:</h3>
                        <ul>{formattedRelatedQuestions}</ul>
                    </div>
                )}
                {formattedReferences.length > 0 && (
                    <div>
                        <h3>Nguồn tham khảo:</h3>
                        <ul>{formattedReferences}</ul>
                    </div>
                )}
            </div>
        );
    };

    const ReferencesAndQuestions = ({ text }) => {
        // Gọi hàm và trả về JSX
        return formatReferencesAndRelatedQuestions(text);
    };

    return (
        <div className="chat-tuvan-container">
            <ToastContainer />
            <div className="chat-summary">
                <button className="add-chat-btn" onClick={handleAddChat}>Thêm Chat</button>
                {chatSummary.map((chat) => (
                    <div key={chat.chat_id} className="chat-item" onClick={() => fetchChatDetails(chat.chat_id)}>
                        <p>{chat.summary}</p>
                        <small>{new Date(chat.createdAt).toLocaleString()}</small>
                        <button className="delete-chat-btn" onClick={() => confirmAndDeleteChat(chat.chat_id)}>Xóa</button>
                    </div>
                ))}
            </div>
            <div className="chat-window">
                {/* Nơi cho chat interface */}
                <div className="chat-messages">
                    {selectedChatDetails.map((detail) => (
                        <div key={detail.message_id} id={`chat_${detail.message_id}`} >
                            <p className={`chat-message-question ${highlightedQuestionId === detail.message_id ? 'highlighted-question' : ''}`}><strong>Bạn:</strong> {detail.question}</p>
                            <p className="chat-message-answer">
                                <strong>Phản hồi:</strong>
                                {detail.isLoading ? (
                                    <span className="loading-animation"></span>
                                ) : detail.isError ? (
                                    // Hiển thị thông báo lỗi với style tùy chỉnh nếu cần
                                    <span className="error-message">{detail.answer}</span>
                                ) : (
                                    <Linkify componentDecorator={linkDecorator}>
                                        <ReferencesAndQuestions text={detail.answer} />
                                    </Linkify>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
                {showScrollButton && (
                    <button className="scroll-to-bottom-btn" onClick={scrollToBottom}>
                        ↓
                    </button>
                )}
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
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
