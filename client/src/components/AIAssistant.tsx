import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const responses = [
  "Hello! How can I help you today?",
  "That's a great question! Tell me more about it.",
  "I'm here to assist you with any questions about programming or web development.",
  "Feel free to ask me anything about React, TypeScript, or web technologies!",
  "I can help you understand coding concepts and best practices.",
  "What would you like to know more about?",
  "That's interesting! Can you elaborate?",
  "I'm always happy to help with your learning journey!",
];

const arabicResponses = [
  "مرحباً! كيف يمكنني مساعدتك اليوم؟",
  "هذا سؤال رائع! أخبرني المزيد عنه.",
  "أنا هنا لمساعدتك في أي أسئلة حول البرمجة وتطوير الويب.",
  "لا تتردد في سؤالي عن React أو TypeScript أو تقنيات الويب!",
  "يمكنني مساعدتك على فهم مفاهيم البرمجة وأفضل الممارسات.",
  "ماذا تريد أن تعرف المزيد عنه؟",
  "هذا مثير للاهتمام! هل يمكنك توضيح أكثر؟",
  "أنا دائماً سعيد بمساعدتك في رحلة التعلم الخاصة بك!",
];

export default function AIAssistant() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: language === "ar" ? "مرحباً! أنا عمر، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟" : "Hi! I'm Omar, your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const isArabic = /[\u0600-\u06FF]/.test(inputValue);
      const responseList = isArabic ? arabicResponses : responses;
      const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isMinimized ? "w-80" : "w-96"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            O
          </div>
          <div>
            <h3 className="font-bold">{language === "ar" ? "عمر" : "Omar"}</h3>
            <p className="text-xs text-blue-100">{language === "ar" ? "مساعد ذكي" : "AI Assistant"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMinimized && (
        <>
          <div className="bg-slate-900 h-96 overflow-y-auto p-4 space-y-4 border-x border-slate-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                      : "bg-slate-700 text-slate-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-slate-800 rounded-b-2xl p-4 border-x border-b border-slate-700 shadow-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg p-2 transition-all duration-300 hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
