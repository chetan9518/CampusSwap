import { useState } from "react";
import { Phone, Building, GraduationCap, ArrowRight, AlertCircle, Check } from "lucide-react";
import Auth from "../firebase/firebase";

interface OnboardingData {
    phone: string;
    hostel: string;
    year: string;
}

interface FormErrors {
    phone?: string;
    hostel?: string;
    year?: string;
}

function Onboarding() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const currentUser = Auth.currentUser;
    const uid = currentUser?.uid;
    const email = currentUser?.email;
    const name= currentUser?.displayName;
    const photoUrl = currentUser?.photoURL;
    
    const [formData, setFormData] = useState<OnboardingData>({
        phone: "",
        hostel: "",
        year: ""
    });

    const hostels = [
        "Boys Hostel A",
        "Boys Hostel B", 
        "Girls Hostel A",
        "Girls Hostel B",
        "PG Hostel 1",
        "PG Hostel 2"
    ];

    const years = [
        "1st Year",
        "2nd Year", 
        "3rd Year",
        "4th Year",
        "M.Tech 1st Year",
        "M.Tech 2nd Year",
        "PhD"
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        if (!formData.hostel) {
            newErrors.hostel = "Please select your hostel";
        }

        if (!formData.year) {
            newErrors.year = "Please select your year";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        
        setTimeout(() => {
            setIsLoading(false);
            alert(`Onboarding complete! Welcome to CampusSwap!`);
        }, 2000);
    };

    const handleInputChange = (field: keyof OnboardingData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && formData.phone) {
            setCurrentStep(2);
        } else if (currentStep === 2 && formData.hostel) {
            setCurrentStep(3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const isStepComplete = (step: number) => {
        switch(step) {
            case 1: return formData.phone && !errors.phone;
            case 2: return formData.hostel && !errors.hostel;
            case 3: return formData.year && !errors.year;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Progress Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                                <img src="/logo.png" className="h-8 w-auto" />
                                <span className="text-xl font-bold">CampusSwap</span>
                            </div>
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                Step {currentStep} of 3
                            </span>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-6">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                        step === currentStep 
                                            ? "bg-white text-blue-600" 
                                            : isStepComplete(step)
                                                ? "bg-green-500 text-white"
                                                : "bg-white/30 text-white"
                                    }`}>
                                        {isStepComplete(step) ? <Check className="w-4 h-4" /> : step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-16 h-1 mx-2 transition-colors ${
                                            isStepComplete(step) ? "bg-green-500" : "bg-white/30"
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
                        <p className="text-blue-100 text-sm">
                            {currentStep === 1 && "Add your phone number for secure communication"}
                            {currentStep === 2 && "Select your hostel for local item discovery"}
                            {currentStep === 3 && "Tell us about your academic year"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Step 1: Phone Number */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg ${
                                                errors.phone ? "border-red-500" : "border-gray-300"
                                            }`}
                                            placeholder="Enter your 10-digit phone number"
                                            maxLength={10}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.phone}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        We'll use this for secure item exchanges and notifications
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!formData.phone || !!errors.phone}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <span>Next</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Step 2: Hostel */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Hostel
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={formData.hostel}
                                            onChange={(e) => handleInputChange("hostel", e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none text-lg ${
                                                errors.hostel ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Select your hostel</option>
                                            {hostels.map(hostel => (
                                                <option key={hostel} value={hostel}>{hostel}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.hostel && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.hostel}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        This helps you find items nearby and connect with neighbors
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.hostel || !!errors.hostel}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <span>Next</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Year */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Year of Study
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={formData.year}
                                            onChange={(e) => handleInputChange("year", e.target.value)}
                                            className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none text-lg ${
                                                errors.year ? "border-red-500" : "border-gray-300"
                                            }`}
                                        >
                                            <option value="">Select your year</option>
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.year && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.year}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Helps us show you relevant items for your curriculum
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !formData.year || !!errors.year}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Completing...</span>
                                            </>
                                        ) : (
                                            <span>Complete Setup</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Skip Option */}
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Skip for now →
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p className="mt-1">Made with ❤️ for college students</p>
                </div>
            </div>
        </div>
    );
}

export default Onboarding;
