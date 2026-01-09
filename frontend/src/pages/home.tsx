import { useEffect, useState } from "react";
import ItemsCard from "../components/itemcard";
import { Search, Filter, X, DollarSign, Tag, Star, Sparkles } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useJWTAuth } from "../context/jwtAuthContext";

interface Itemcard {
    id: string,
    title: string,
    description: string,
    price: number,
    condition: string,
    images: string[],
    tags: string[],
    category: string,
    isAvailable: boolean,
    createdAt: string,
    sellerId: string,
    seller?: {
        fullName: string;
        email: string;
        phone: string;
        hostel: string;
        year: string;
        avatar?: string;
    };
}

interface OutletContextType {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

const CATEGORIES = [
    { id: 'All', name: 'All', icon: '📦' },
    { id: 'TextBooks', name: 'Textbooks', icon: '📚' },
    { id: 'Electronics', name: 'Electronics', icon: '💻' },
    { id: 'Furniture', name: 'Furniture', icon: '🪑' },
    { id: 'HostelItems', name: 'Hostel Items', icon: '🏠' },
];

function Homepage() {
    const { activeCategory, setActiveCategory } = useOutletContext<OutletContextType>();
    const { user } = useJWTAuth();
    const [page, setPage] = useState(1);
    const [end, setEnd] = useState(false);
    const [items, setItems] = useState<Itemcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [condition, setCondition] = useState('');
    const [tags, setTags] = useState('');

    const firstName = user?.fullName?.split(' ')[0] || 'there';

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
                console.error("No token found");
                return;
            }
            
            setLoading(true);
            try {
                // Build query parameters
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: '10'
                });

                // Add filters to query params
                if (searchTerm) params.append('search', searchTerm);
                if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
                if (sortBy !== 'recent') params.append('sortBy', sortBy);
                if (priceRange.min) params.append('minPrice', priceRange.min);
                if (priceRange.max) params.append('maxPrice', priceRange.max);
                if (condition) params.append('condition', condition);
                if (tags) params.append('tags', tags);

                const result = await axios.get(`${import.meta.env.VITE_URL}/items?${params}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (result.status === 200 && result.data) {
                    const itemsData = result.data.success && result.data.items ? result.data.items : [];
                    const pagination = result.data.pagination || {};
                    
                    if (itemsData.length > 0) {
                        if (page === 1) {
                            setItems(itemsData);
                        } else {
                            setItems(prev => [...prev, ...itemsData]);
                        }
                        
                        setTotalItems(pagination.total || 0);
                        
                        if (itemsData.length < 10 || page >= (pagination.pages || 1)) {
                            setEnd(true);
                        } else {
                            setPage(page + 1);
                        }
                    } else {
                        if (page === 1) {
                            setItems([]);
                        }
                        setTotalItems(0);
                        setEnd(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching items:", error);
                if (page === 1) {
                    setItems([]);
                }
                setEnd(true);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [page, searchTerm, activeCategory, sortBy, priceRange, condition, tags]);

    const handleLoadMore = () => {
        if (!loading && !end) {
            setPage(prev => prev + 1);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setEnd(false);
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        setPage(1);
        setEnd(false);
        setLoading(true);
    };

    const applyFilters = () => {
        setShowFilterPopup(false);
        setPage(1);
        setEnd(false);
        setLoading(true);
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        setCondition('');
        setTags('');
        setSearchTerm('');
        setActiveCategory('All');
        setSortBy('recent');
        setShowFilterPopup(false);
        setPage(1);
        setEnd(false);
    };

    const hasActiveFilters = () => {
        return !!(priceRange.min || priceRange.max || condition || tags || searchTerm || (activeCategory && activeCategory !== 'All'));
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (priceRange.min || priceRange.max) count++;
        if (condition) count++;
        if (tags) count++;
        if (searchTerm) count++;
        if (activeCategory && activeCategory !== 'All') count++;
        return count;
    };

    return (
        <div className="w-full flex flex-col">
            {/* Mobile greeting + search banner */}
            <div className="md:hidden mb-3 px-4 pt-2">
                <p className="text-xs text-gray-500 mb-2">
                    Hi <span className="font-medium text-gray-800">{firstName}</span>,{" "}
                    browse and search items in your campus.
                </p>
            </div>

            {/* Enhanced Filter Bar - Responsive Layout */}
            <div className="bg-white border-b border-gray-200 p-4 mb-4">
                {/* Search - Full Width Row */}
                <form onSubmit={handleSearch} className="mb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            id="mobile-search-input"
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </form>

                {/* Text below search bar */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">items in your campus</h3>
                </div>

                {/* Mobile Categories Section - Only show on mobile */}
                <div className="md:hidden mb-4">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id || (cat.id === 'All' && (!activeCategory || activeCategory === 'All'));
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setActiveCategory(cat.id);
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.icon} {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Filters Chips - Show when filters are active */}
                {hasActiveFilters() && (
                    <div className="mb-3 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {activeCategory && activeCategory !== 'All' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {CATEGORIES.find(c => c.id === activeCategory)?.icon} {CATEGORIES.find(c => c.id === activeCategory)?.name}
                                <button
                                    onClick={() => {
                                        setActiveCategory('All');
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(priceRange.min || priceRange.max) && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                                <button
                                    onClick={() => {
                                        setPriceRange({ min: '', max: '' });
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {condition && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {condition}
                                <button
                                    onClick={() => {
                                        setCondition('');
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {tags && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                Tags: {tags.split(',')[0]}
                                <button
                                    onClick={() => {
                                        setTags('');
                                        setPage(1);
                                        setEnd(false);
                                    }}
                                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-xs text-red-600 font-medium hover:text-red-700 underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Filters and Sort - Desktop: Right aligned, Mobile: Full width */}
                <div className="flex gap-3 items-center justify-end">
                    {/* Enhanced Filter Button */}
                    <button
                        onClick={() => setShowFilterPopup(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors relative"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filters</span>
                        {getActiveFilterCount() > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </button>

                    {/* Sort Options */}
                    <select 
                        value={sortBy} 
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="recent">Sort: Recent</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="popular">Popular</option>
                    </select>
                </div>
            </div>

            {/* Enhanced Filter Popup */}
            <AnimatePresence>
                {showFilterPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowFilterPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                                <button
                                    onClick={() => setShowFilterPopup(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    Price Range (₹)
                                </label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Min price"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex items-center text-gray-400">-</div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Max price"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Leave empty for no limit</p>
                            </div>

                            {/* Condition */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    Condition
                                </label>
                                <select
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">All Conditions</option>
                                    <option value="Like New">✨ Like New</option>
                                    <option value="Very Good">⭐ Very Good</option>
                                    <option value="Good">👍 Good</option>
                                    <option value="Used">🔄 Used</option>
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <Tag className="w-4 h-4 text-purple-500" />
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., urgent, negotiable, brand new"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-2">Separate multiple tags with commas (e.g., urgent, negotiable)</p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {['urgent', 'negotiable', 'brand new', 'warranty'].map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => {
                                                const currentTags = tags ? tags.split(',').map(t => t.trim()) : [];
                                                if (currentTags.includes(tag)) {
                                                    setTags(currentTags.filter(t => t !== tag).join(', '));
                                                } else {
                                                    setTags([...currentTags, tag].join(', '));
                                                }
                                            }}
                                            className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                                                tags.toLowerCase().includes(tag)
                                                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                                >
                                    Apply Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="hidden md:flex items-center shadow-sm border border-gray-200 bg-white p-5 rounded-lg justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-2xl">
                    Available items in IIIT Agartala {totalItems > 0 && `(${totalItems})`}
                </h2>
            </div>

            <AnimatePresence>
                {loading && items.length === 0 ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-full flex flex-col items-center justify-center py-16"
                    >
                        <LoadingSpinner 
                            size="lg" 
                            text="Loading amazing items..." 
                            icon="search"
                        />
                    </motion.div>
                ) : items.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-full flex flex-col items-center justify-center py-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", damping: 20, stiffness: 300 }}
                            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                        >
                            <Sparkles className="w-8 h-8 text-gray-400" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="text-xl font-semibold text-gray-900 mb-2"
                        >
                            {totalItems === 0 ? "No items available yet" : "No more items to load"}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="text-gray-600 mb-6 text-center"
                        >
                            {totalItems === 0 ? "Be the first to post an item!" : "Check back later for more items"}
                        </motion.p>
                        {totalItems === 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                onClick={() => window.location.href = '/sell'}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Sell Item
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="items"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-8 px-4 md:px-0"
                    >
                        {items.map((e, index) => (
                            <motion.div
                                key={e.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ 
                                    duration: 0.3, 
                                    delay: index * 0.05 // Stagger animation
                                }}
                            >
                                <ItemsCard x={e} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {items.length > 0 && !end && (
                <div className="flex justify-center mt-8 mb-4 px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="group relative w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-blue-600 via-blue-650 to-blue-700 text-white font-semibold sm:font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-200 sm:duration-300 flex items-center justify-center gap-2 sm:gap-3 border border-blue-500/20 hover:border-blue-400/40 backdrop-blur-sm min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] max-w-md sm:max-w-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <LoadingSpinner size="sm" text="" icon="refresh" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1, ease: 'linear' }}
                                >
                                    <svg 
                                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-200 group-hover:rotate-180 flex-shrink-0" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                                <span className="truncate">Load More Items</span>
                            </>
                        )}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-650 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Homepage;