import ReactMarkdown from 'react-markdown';
const ContentDisplay = ({ content }) => {
    // Hàm kiểm tra xem chuỗi có phải là HTML không
    const isHtml = (input) => /<\/?[a-z][\s\S]*>/i.test(input);

    if (isHtml(content)) {
        // Nếu là HTML, hiển thị như HTML
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    } else {
        // Nếu là Markdown, hiển thị dùng ReactMarkdown
        return <ReactMarkdown>{content}</ReactMarkdown>;
    }
}

export default ContentDisplay