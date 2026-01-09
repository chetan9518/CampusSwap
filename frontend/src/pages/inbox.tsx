import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageCircle, ArrowLeft, Plus, Search } from 'lucide-react';

interface Conversation {
  conversationId: string;
  item: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
  lastMessage: string;
  updatedAt: string;
  otherUser: {
    id: string;
    fullName: string;
  };
}

interface Item {
  id: string;
  title: string;
  price: number;
  images: string[];
  seller: {
    id: string;
    fullName: string;
  };
}

function Inbox() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error: any) {
      console.error('Error fetching inbox:', error);
      // Show user-friendly error message
      if (error.response?.status === 401) {
        // Token expired or invalid - will be handled by protected route
      }
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const token = localStorage.getItem('jwt_token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_URL}/items?search=${encodeURIComponent(query)}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSearchResults(response.data.items || []);
      }
    } catch (error) {
      console.error('Error searching items:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchItems(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'now' : `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  const handleContactSeller = async (item: Item) => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Please login to contact seller');
        return;
      }

      // Create or get existing conversation
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/messages`,
        {
          itemId: item.id,
          text: "Hi, is this item still available?"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Navigate to chat
        navigate(`/chat/${response.data.conversationId}`);
      }
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to start conversation. Please try again.';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top App Bar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
        <button
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Inbox</h1>
        <button
          onClick={() => setShowNewChat(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start pt-20 z-50">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items to contact sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setShowNewChat(false)}
                className="mt-3 text-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>

            {/* Search Results */}
            <div className="p-4">
              {searchLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">Searching...</p>
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items found</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Tap to contact seller:</p>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleContactSeller(item)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images[0] || '/placeholder.jpg'}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            ₹{item.price} • {item.seller.fullName}
                          </p>
                        </div>
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Search for items to start conversations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inbox List */}
      <div className="pb-20">
        {conversations.length === 0 ? (
          // Empty Inbox State
          <div className="flex flex-col items-center justify-center py-32 px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No conversations yet
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Messages will appear when someone contacts you
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start New Conversation
            </button>
          </div>
        ) : (
          // Conversation List
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.conversationId}
                onClick={() => handleConversationClick(conversation.conversationId)}
                className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                {/* Item Image (Avatar) */}
                <div className="relative">
                  <img
                    src={conversation.item.image}
                    alt={conversation.item.title}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                  {/* Unread indicator */}
                  {/* TODO: Add unread logic later */}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  {/* Item Title */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {conversation.item.title}
                  </h3>
                  
                  {/* Last Message Preview */}
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>

                {/* Right Side */}
                <div className="text-right">
                  {/* Price */}
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    ₹{conversation.item.price}
                  </p>
                  
                  {/* Time */}
                  <p className="text-gray-500 text-xs">
                    {formatTime(conversation.updatedAt)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;