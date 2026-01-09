import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Send } from 'lucide-react';
import { useJWTAuth } from '../context/jwtAuthContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  item: {
    id: string;
    title: string;
    price: number;
    category: string;
  };
}

function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useJWTAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = user?.id || null;

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token || !conversationId) return;

      const response = await axios.get(
        `${import.meta.env.VITE_URL}/messages/conversation/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
        setConversation(response.data.conversation);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending || !conversationId) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/messages`,
        {
          conversationId,
          text: messageText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Add the new message immediately for better UX
        const newMsg: Message = {
          id: response.data.message.id,
          senderId: response.data.message.senderId,
          text: response.data.message.text,
          createdAt: response.data.message.createdAt
        };
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message if send failed
      setNewMessage(messageText);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const isMyMessage = (message: Message) => {
    if (!currentUserId) return false;
    return message.senderId === currentUserId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversation not found</h2>
          <button
            onClick={() => navigate('/inbox')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Inbox
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar - Item Context */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
        <button
          onClick={() => navigate('/inbox')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <div className="flex-1 text-center">
          <h2 className="font-semibold text-gray-900 text-sm">{conversation.item.title}</h2>
          <p className="text-gray-600 text-xs">
            ₹{conversation.item.price} • {conversation.item.category}
          </p>
        </div>
        
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  isMyMessage(message)
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    isMyMessage(message) ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
