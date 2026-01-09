import { useState } from "react";
import { Phone, Home, Calendar, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";
import axios from "axios";

interface FormData {
    hostel: string;
    year: string;
    phone: string;
}

interface FormErrors {
    hostel?: string;
    year?: string;
    phone?: string;
    general?: string;
}

export default function OnboardingNew() {
    const [formData, setFormData] = useState<FormData>({
        hostel: "",
        year: "",
        phone: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { token } = useJWTAuth();

    const hostels = [
        "BH-1", "BH-2", "BH-3", "BH-4", "BH-5", "BH-6",
        "GH-1", "GH-2", "GH-3", "GH-4", "GH-5", "GH-6"
    ];

    const years = [
        "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"
    ];

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.hostel) {
            newErrors.hostel = "Please select your hostel";
        }

        if (!formData.year) {
            newErrors.year = "Please select your year";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            setIsLoading(true);
            
            const response = await axios.post(
                `${import.meta.env.VITE_URL}/auth/complete-profile`,
                {
                    hostel: formData.hostel,
                    year: formData.year,
                    phone: formData.phone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                navigate("/home");
            }
        } catch (error: any) {
            console.error("Profile completion error:", error);
            const message = error.response?.data?.message || "Failed to complete profile";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSkip = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Friendly Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome, {token ? 'User' : 'Friend'} 👋
                        </h1>
                        <p className="text-gray-600">
                            Let's complete your profile
                        </p>
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {errors.general}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="9876543210"
                                    maxLength={10}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Hostel */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hostel
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                <select
                                    value={formData.hostel}
                                    onChange={(e) => handleInputChange('hostel', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                        errors.hostel ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={isLoading}
                                >
                                    <option value="">Select your hostel</option>
                                    {hostels.map(hostel => (
                                        <option key={hostel} value={hostel}>
                                            {hostel}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.hostel && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.hostel}
                                </p>
                            )}
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year of Study
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                                <select
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                        errors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={isLoading}
                                >
                                    <option value="">Select your year</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.year}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Complete Setup"
                            )}
                        </button>
                    </form>

                    {/* Skip Option */}
                    <div className="text-center mt-6">
                        <button
                            onClick={handleSkip}
                            type="button"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            I'll do this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
