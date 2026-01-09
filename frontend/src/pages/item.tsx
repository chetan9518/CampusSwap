import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, Clock, User, Phone, Mail, Star } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ItemDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    seller: {
        fullName: string;
        email: string;
        phone: string;
        hostel: string;
        year: string;
        avatar?: string;
    };
    isAvailable: boolean;
    createdAt: string;
}

interface SimilarItem {
    id: string;
    title: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    createdAt: string;
}

function Item(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(true);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = localStorage.getItem("jwt_token");
                const response = await axios.get(`${import.meta.env.VITE_URL}/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setItem(response.data.item);
                } else {
                    setError("Item not found");
                }
            } catch (error: any) {
                console.error("Error fetching item:", error);
                setError(error.response?.data?.message || "Failed to fetch item");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    useEffect(() => {
        const fetchSimilarItems = async () => {
            if (!id) return;
            try {
                setLoadingSimilar(true);
                const token = localStorage.getItem("jwt_token");
                const response = await axios.get(`${import.meta.env.VITE_URL}/items/${id}/similar`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setSimilarItems(response.data.items || []);
                } else {
                    setSimilarItems([]);
                }
            } catch (error) {
                console.error("Error fetching similar items:", error);
                setSimilarItems([]);
            } finally {
                setLoadingSimilar(false);
            }
        };

        fetchSimilarItems();
    }, [id]);

    const handleContactSeller = async () => {
        if (!item) return;
        
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

    const handleMakeOffer = () => {
        if (item) {
            const offer = prompt("Enter your offer amount:");
            if (offer) {
                alert(`Offer of Rs. ${offer} sent to ${item.seller.fullName}`);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || "This item doesn't exist or has been removed."}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // mobile
    if (isMobile) {
        return (
            <div className="min-h-screen bg-gray-50">
              
                <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between p-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-lg active:bg-gray-100 transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                            <button 
                                onClick={() => setIsLiked(!isLiked)}
                                className="p-2 rounded-lg active:bg-gray-100 transition-colors"
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                            </button>
                        </div>
                    </div>
                </div>

               
                <div className="pb-20">
                    
                    <div className="bg-white">
                        <div className="relative">
                            <img
                                src={item.images[selectedImage] || '/placeholder.jpg'}
                                alt={item.title}
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                                {item.images.map((_: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-1 h-1 rounded-full transition-colors ${
                                            selectedImage === index ? 'bg-white' : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-2 p-4 overflow-x-auto">
                            {item.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                   
                    <div className="bg-white mt-2 p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h1 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h1>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDate(item.createdAt)}</span>
                                    </span>
                                    <span>{item.isAvailable ? 'Available' : 'Sold'}</span>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-green-600">Rs. {item.price}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {item.category}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {item.condition}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-2">Description</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    </div>

                  
                    <div className="bg-white mt-2 p-4">
                        <h3 className="text-base font-semibold mb-3">Seller Information</h3>
                        <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-sm">{item.seller.fullName}</h4>
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-xs text-gray-500">• {item.seller.hostel}</span>
                                    <span className="text-xs text-gray-500">• {item.seller.year}</span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-3 h-3" />
                                        <span>{item.seller.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-3 h-3" />
                                        <span>{item.seller.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                 
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Safety Tips for Safe Deals</h4>
                        <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Meet in a busy, well-lit place on campus (library, canteen, main gate).</li>
                            <li>Bring a friend with you when meeting someone you don't know well.</li>
                            <li>Check the item carefully before paying, especially electronics and gadgets.</li>
                            <li>Prefer UPI or cash on delivery; avoid full advance payments to strangers.</li>
                            <li>Never share OTPs, passwords or banking details with anyone.</li>
                        </ul>
                    </div>

               
                    <div className="bg-white mt-2 p-4">
                        <h3 className="text-base font-semibold mb-3">Similar Items</h3>
                        {loadingSimilar ? (
                            <p className="text-xs text-gray-500">Loading similar items...</p>
                        ) : similarItems.length === 0 ? (
                            <p className="text-xs text-gray-500">No similar items found right now. Check back later!</p>
                        ) : (
                            <div className="space-y-3">
                                {similarItems.map((sim) => (
                                    <div
                                        key={sim.id}
                                        className="flex space-x-3 pb-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg -mx-2 px-2"
                                        onClick={() => navigate(`/items/${sim.id}`)}
                                    >
                                        <img
                                            src={sim.images?.[0] || '/placeholder.jpg'}
                                            alt={sim.title}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium line-clamp-2">
                                                {sim.title}
                                            </h4>
                                            <p className="text-sm font-bold text-green-600">Rs. {sim.price}</p>
                                            <p className="text-xs text-gray-500">
                                                {sim.category} • {sim.condition} • {formatDate(sim.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

              
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleContactSeller}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm active:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Contact</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // dsesktop
    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={() => setIsLiked(!isLiked)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               
                <div className="lg:col-span-2 space-y-6">
               
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                            <img
                                src={item.images[selectedImage] || '/placeholder.jpg'}
                                alt={item.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="flex space-x-2 p-4 overflow-x-auto">
                            {item.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(item.createdAt)}</span>
                                    </span>
                                    <span>{item.isAvailable ? 'Available' : 'Sold'}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">Rs. {item.price}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {item.category}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {item.condition}
                            </span>
                        </div>

                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-lg">{item.seller.fullName}</h4>
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm text-gray-500">• {item.seller.hostel}</span>
                                    <span className="text-sm text-gray-500">• {item.seller.year}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{item.seller.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{item.seller.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              
                <div className="space-y-6">
                
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-3">
                        <button
                            onClick={handleContactSeller}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span>Contact Seller</span>
                        </button>
                        {item.isAvailable && (
                            <button
                                onClick={handleMakeOffer}
                                className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                Make an Offer
                            </button>
                        )}
                    </div>

                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Safety Tips for Safe Deals</h4>
                        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                            <li>Always meet on campus in a public, well-lit place with CCTV if possible.</li>
                            <li>Try to bring a friend when meeting a new seller or buyer.</li>
                            <li>Inspect and test the item fully before you pay (screen, charger, buttons, etc.).</li>
                            <li>Use trusted payment methods (UPI, cash on delivery) and avoid sharing card details.</li>
                            <li>Do not share OTPs, passwords, or personal documents over chat.</li>
                        </ul>
                    </div>

               
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Similar Items</h3>
                        {loadingSimilar ? (
                            <p className="text-sm text-gray-500">Loading similar items...</p>
                        ) : similarItems.length === 0 ? (
                            <p className="text-sm text-gray-500">No similar items found in this category yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {similarItems.map((sim) => (
                                    <div
                                        key={sim.id}
                                        className="flex space-x-3 pb-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg -mx-2 px-2"
                                        onClick={() => navigate(`/items/${sim.id}`)}
                                    >
                                        <img
                                            src={sim.images?.[0] || '/placeholder.jpg'}
                                            alt={sim.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium line-clamp-2">
                                                {sim.title}
                                            </h4>
                                            <p className="text-sm font-bold text-green-600">Rs. {sim.price}</p>
                                            <p className="text-xs text-gray-500">
                                                {sim.category} • {sim.condition} • {formatDate(sim.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item;