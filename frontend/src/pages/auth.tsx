import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";
import { googleLogin } from "../firebase/auth";
import { motion } from "framer-motion";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

interface FormData {
    email: string;
    password: string;
    confirmPassword?: string;
    fullName: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    fullName?: string;
    general?: string;
}

export default function AuthNew() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
    const { login } = useJWTAuth();

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!isLogin) {
            if (!formData.fullName) {
                newErrors.fullName = "Full name is required";
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        try {
            setIsLoading(true);
            
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${import.meta.env.VITE_URL}${endpoint}`, {
                email: formData.email,
                password: formData.password,
                fullName: !isLogin ? formData.fullName : undefined
            });

            if (response.data.success) {
                login(response.data.token, response.data.user);
                
                // Check if user needs onboarding
                if (response.data.isNewUser) {
                    navigate("/onBoarding");
                } else {
                    navigate("/home");
                }
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            const message = error.response?.data?.message || "Authentication failed";
            setErrors({ general: message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            
            // Get Firebase token
            const result = await googleLogin();
            const firebaseToken = await result.user.getIdToken();
            
            // Send to backend
            const response = await axios.post(`${import.meta.env.VITE_URL}/auth/google`, {
                firebaseToken
            });

            if (response.data.success) {
                login(response.data.token, response.data.user);
                
                // Check if user needs onboarding
                if (response.data.isNewUser || !response.data.user.hostel || !response.data.user.year) {
                    navigate("/onBoarding");
                } else {
                    navigate("/home");
                }
            }
        } catch (error: any) {
            console.error("Google auth error:", error);
            const message = error.response?.data?.message || "Google login failed";
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#111827] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                    {/* Logo and Tagline */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img 
                                src="/logo.png" 
                                alt="CampusSwap Logo" 
                                className="w-auto h-12"
                            />
                        </div>
                        <p className="text-gray-400 text-sm">Trade easily, live better</p>
                    </div>

                    {/* Google Login Button - Primary */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors space-x-3 mb-6 h-12"
                    >
                        {isLoading ? (
                            <LoadingSpinner size="sm" text="" icon="refresh" />
                        ) : (
                            <img src="/google.png" className="w-5 h-5 rounded" alt="Google" />
                        )}
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm font-medium text-slate-900"
                        >
                            Continue with Google
                        </motion.span>
                    </motion.button>

                    {/* Clear OR Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-gray-400 font-medium">OR</span>
                        </div>
                    </div>

                    {/* General Error Message */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
                            <p className="text-sm text-red-300 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                            errors.fullName ? 'border-red-500' : 'border-gray-700'
                                        } text-gray-200 placeholder-gray-500`}
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-300 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                        errors.email ? 'border-red-500' : 'border-gray-700'
                                    } text-gray-200 placeholder-gray-500`}
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-300 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full pl-10 pr-10 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                        errors.password ? 'border-red-500' : 'border-gray-700'
                                    } text-gray-200 placeholder-gray-500`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-300 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2 bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                                        } text-gray-200 placeholder-gray-500`}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-300 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 transition-all duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center mt-5"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" text="" icon="refresh" />
                            ) : (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {isLogin ? "Sign In" : "Sign Up"}
                                </motion.span>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                }}
                                className="ml-1 text-blue-300 hover:text-blue-400 font-medium transition-colors"
                                disabled={isLoading}
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
