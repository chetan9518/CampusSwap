import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, MapPin, Clock, User, Phone, Mail, Star, Shield, Truck } from "lucide-react";
import { useState, useEffect } from 'react';

interface ItemDetails {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    seller: {
        name: string;
        email: string;
        phone: string;
        hostel: string;
        year: string;
        rating: number;
        verified: boolean;
    };
    location: string;
    postedDate: string;
    views: number;
    likes: number;
    negotiable: boolean;
    deliveryAvailable: boolean;
}

const dummyItem: ItemDetails = {
    id: 1,
    title: "Introduction to Physics - 1st Year Textbook",
    description: "Excellent condition physics textbook for first-year engineering students. This book covers all fundamental concepts including mechanics, thermodynamics, electromagnetism, and modern physics. Perfect for upcoming semester preparation. I bought it new last semester and barely used it as I had digital copies. No highlights or markings, pages are clean and crisp. Original price was Rs. 1200, selling at half price.",
    price: 600,
    category: "Books",
    condition: "Like New",
    images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop"
    ],
    seller: {
        name: "Rahul Sharma",
        email: "rahul.sharma@campus.edu",
        phone: "+91 98765 43210",
        hostel: "Boys Hostel A",
        year: "2nd Year",
        rating: 4.8,
        verified: true
    },
    location: "Boys Hostel A, Room 204",
    postedDate: "2 days ago",
    views: 145,
    likes: 23,
    negotiable: true,
    deliveryAvailable: true
};

function Item(){
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleContactSeller = () => {
       
        alert(`Contact ${dummyItem.seller.name} at ${dummyItem.seller.phone}`);
    };

    const handleMakeOffer = () => {
      
        const offer = prompt("Enter your offer amount:");
        if (offer) {
            alert(`Offer of Rs. ${offer} sent to ${dummyItem.seller.name}`);
        }
    };

    // moobile
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
                                src={dummyItem.images[selectedImage]}
                                alt={dummyItem.title}
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                                {dummyItem.images.map((_, index) => (
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
                            {dummyItem.images.map((image, index) => (
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
                                <h1 className="text-lg font-bold text-gray-900 mb-2">{dummyItem.title}</h1>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span>{dummyItem.location}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{dummyItem.postedDate}</span>
                                    </span>
                                    <span>{dummyItem.views} views</span>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-green-600">Rs. {dummyItem.price}</p>
                                {dummyItem.negotiable && (
                                    <p className="text-xs text-gray-500">Negotiable</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {dummyItem.category}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                {dummyItem.condition}
                            </span>
                            {dummyItem.deliveryAvailable && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center space-x-1">
                                    <Truck className="w-3 h-3" />
                                    <span>Delivery</span>
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-base font-semibold mb-2">Description</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{dummyItem.description}</p>
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
                                    <h4 className="font-semibold text-sm">{dummyItem.seller.name}</h4>
                                    {dummyItem.seller.verified && (
                                        <Shield className="w-3 h-3 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-xs font-medium">{dummyItem.seller.rating}</span>
                                    <span className="text-xs text-gray-500">• {dummyItem.seller.hostel}</span>
                                    <span className="text-xs text-gray-500">• {dummyItem.seller.year}</span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-3 h-3" />
                                        <span>{dummyItem.seller.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-3 h-3" />
                                        <span>{dummyItem.seller.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                 
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Safety Tips</h4>
                        <ul className="text-xs text-yellow-700 space-y-1">
                            <li>•Ldai na kre </li>
                             <li>•Ldai na kre </li>
                              <li>•Ldai na kre </li>
                               <li>•Ldai na kre </li>

                           
                        </ul>
                    </div>

               
                    <div className="bg-white mt-2 p-4">
                        <h3 className="text-base font-semibold mb-3">Similar Items</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex space-x-3 pb-3 border-b last:border-b-0">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=60&h=60&fit=crop`}
                                        alt="Similar item"
                                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium line-clamp-2">
                                            Engineering Mathematics - {item === 1 ? '1st' : item === 2 ? '2nd' : '3rd'} Year
                                        </h4>
                                        <p className="text-sm font-bold text-green-600">Rs. {400 + item * 100}</p>
                                        <p className="text-xs text-gray-500">Posted {item} days ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        {dummyItem.negotiable && (
                            <button
                                onClick={handleMakeOffer}
                                className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium text-sm active:bg-blue-50 transition-colors"
                            >
                                Make Offer
                            </button>
                        )}
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
                                src={dummyItem.images[selectedImage]}
                                alt={dummyItem.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="flex space-x-2 p-4 overflow-x-auto">
                            {dummyItem.images.map((image, index) => (
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
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{dummyItem.title}</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{dummyItem.location}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{dummyItem.postedDate}</span>
                                    </span>
                                    <span>{dummyItem.views} views</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">Rs. {dummyItem.price}</p>
                                {dummyItem.negotiable && (
                                    <p className="text-sm text-gray-500">Negotiable</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {dummyItem.category}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {dummyItem.condition}
                            </span>
                            {dummyItem.deliveryAvailable && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center space-x-1">
                                    <Truck className="w-3 h-3" />
                                    <span>Delivery Available</span>
                                </span>
                            )}
                        </div>

                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{dummyItem.description}</p>
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
                                    <h4 className="font-semibold text-lg">{dummyItem.seller.name}</h4>
                                    {dummyItem.seller.verified && (
                                        <Shield className="w-4 h-4 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{dummyItem.seller.rating}</span>
                                    <span className="text-sm text-gray-500">• {dummyItem.seller.hostel}</span>
                                    <span className="text-sm text-gray-500">• {dummyItem.seller.year}</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{dummyItem.seller.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{dummyItem.seller.email}</span>
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
                        {dummyItem.negotiable && (
                            <button
                                onClick={handleMakeOffer}
                                className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                Make an Offer
                            </button>
                        )}
                    </div>

                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Safety Tips</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                             <li>•Ldai na kre </li>
                              <li>•Ldai na kre </li>
                               <li>•Ldai na kre </li>
                                <li>•Ldai na kre </li>
                        </ul>
                    </div>

               
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Similar Items</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex space-x-3 pb-3 border-b last:border-b-0">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1500000000000 + item}?w=80&h=80&fit=crop`}
                                        alt="Similar item"
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium line-clamp-2">
                                            Engineering Mathematics - {item === 1 ? '1st' : item === 2 ? '2nd' : '3rd'} Year
                                        </h4>
                                        <p className="text-sm font-bold text-green-600">Rs. {400 + item * 100}</p>
                                        <p className="text-xs text-gray-500">Posted {item} days ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item;