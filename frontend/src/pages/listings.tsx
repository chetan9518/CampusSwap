import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit, EyeOff, Package, Plus } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

interface Item {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  isAvailable: boolean;
  createdAt: string;
}

interface StatusBadgeProps {
  status: 'available' | 'sold' | 'hidden';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return { color: 'bg-green-100 text-green-700', icon: '🟢', text: 'Available' };
      case 'sold':
        return { color: 'bg-gray-100 text-gray-700', icon: '🔴', text: 'Sold' };
      case 'hidden':
        return { color: 'bg-yellow-100 text-yellow-700', icon: '🟡', text: 'Hidden' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: '🔴', text: 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {config.text}
    </span>
  );
};

const ItemCard: React.FC<{ item: Item; onEdit: (id: string) => void; onDelete: (id: string) => void; onStatusToggle: (id: string) => void; }> = ({ 
  item, 
  onEdit, 
  onDelete, 
  onStatusToggle 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusToggle = () => {
    onStatusToggle(item.id);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
    setShowDeleteConfirm(false);
    setShowActions(false);
  };

  const firstImage = item.images?.[0] || '/placeholder.jpg';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Item?</h3>
            <p className="text-gray-600 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left Side - Image */}
        <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Details */}
        <div className="flex-1 p-3">
          {/* Top Row */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-blue-600">₹{item.price}</span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              
              {/* Actions Menu */}
              {showActions && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                  <button
                    onClick={() => onEdit(item.id)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleStatusToggle}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <EyeOff className="w-4 h-4" />
                    {item.isAvailable ? 'Mark as Sold' : 'Mark as Available'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Package className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Second Row */}
          <div className="text-xs text-gray-500 mb-2">
            {item.category} • {item.condition}
          </div>

          {/* Third Row - Status Badge */}
          <div className="mb-3">
            <StatusBadge status={item.isAvailable ? 'available' : 'sold'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ListingsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`${import.meta.env.VITE_URL}/items/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setItems(response.data.items || response.data);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const handleEdit = (id: string) => {
    // Navigate to item detail page for now
    // TODO: Implement edit functionality or remove edit button
    navigate(`/items/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      await axios.delete(`${import.meta.env.VITE_URL}/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleStatusToggle = async (id: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const item = items.find(item => item.id === id);
      if (!item) return;

      const response = await axios.put(
        `${import.meta.env.VITE_URL}/items/${id}`,
        { isAvailable: !item.isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setItems(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, isAvailable: !item.isAvailable }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Pull-to-refresh handler
  let startY = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    
    if (diff > 50) { // Pulled down 50px
      handleRefresh();
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <LoadingSpinner 
          size="lg" 
          text="Loading your listings..." 
          icon="package"
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      {/* Top App Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between h-14">
        <button
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">My Listings</h1>
        <button
          onClick={() => navigate('/sell')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Post Item
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h2>
            <p className="text-gray-600 mb-6">Post your first item to get started</p>
            <button
              onClick={() => navigate('/sell')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post Item
            </button>
          </div>
        ) : (
          /* Item Grid */
          <div className="space-y-4">
            {refreshing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center py-2"
              >
                <LoadingSpinner size="sm" text="" icon="refresh" />
              </motion.div>
            )}
            
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05 // Stagger animation
                }}
              >
                <ItemCard
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusToggle={handleStatusToggle}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}