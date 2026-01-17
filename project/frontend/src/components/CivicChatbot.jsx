import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, AlertTriangle } from 'lucide-react';

const CivicChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(`user_${Date.now()}`);
    const messagesEndRef = useRef(null);
    const API_BASE_URL = 'http://localhost:8000';

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize chat with greeting when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            sendInitialGreeting();
        }
    }, [isOpen]);

    const sendInitialGreeting = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Hi, I would like to report a civic issue.',
                    user_id: sessionId
                })
            });

            const data = await response.json();
            if (data.response) {
                setMessages([
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: data.response
                    }
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages([
                {
                    id: Date.now(),
                    type: 'bot',
                    text: '⚠️ Unable to connect to chatbot. Please make sure the server is running on port 5000.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!inputValue.trim() || loading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message to chat
        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                type: 'user',
                text: userMessage
            }
        ]);

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    user_id: sessionId
                })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: `❌ Error: ${data.error}`
                    }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        type: 'bot',
                        text: data.response
                    }
                ]);

                // If user wants to submit, show success message
                if (data.should_submit) {
                    setTimeout(() => {
                        setMessages(prev => [
                            ...prev,
                            {
                                id: Date.now(),
                                type: 'bot',
                                text: '✅ Your civic issue has been successfully reported! You can track it using the reference number provided.'
                            }
                        ]);
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    type: 'bot',
                    text: '⚠️ Connection error. Please check if the server is running.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/clear-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: sessionId })
            });
            setSessionId(`user_${Date.now()}`);
            setMessages([]);
            sendInitialGreeting();
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {isOpen ? (
                <div className="w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-green-200 dark:border-green-900/30 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">YPC Civic Assistant</h3>
                            <p className="text-xs text-green-100">Powered by AI</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                            title="Close chatbot"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-slate-500 dark:text-slate-400">Loading...</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-lg ${msg.type === 'user'
                                                ? 'bg-green-500 text-white rounded-br-none'
                                                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {msg.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
                        <form onSubmit={sendMessage} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Describe your issue..."
                                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:text-white"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !inputValue.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>

                        <button
                            onClick={handleNewChat}
                            className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 py-2 border-t border-slate-200 dark:border-slate-700"
                        >
                            Start New Chat
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    title="Open chatbot"
                >
                    <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default CivicChatbot;