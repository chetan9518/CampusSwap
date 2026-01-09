import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, Plus, IndianRupee } from "lucide-react";
import axios from "axios";

interface SellFormData {
  title: string;
  price: string;
  category: string;
  condition: string;
  description: string;
  tags: string[];
  isFree: boolean;
  isAvailable: boolean;
}

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

const CATEGORIES = [
  { id: "TextBooks", name: "📚 Books", icon: "📚" },
  { id: "Electronics", name: "💻 Electronics", icon: "💻" },
  { id: "Furniture", name: "🪑 Furniture", icon: "🪑" },
  { id: "HostelItems", name: "🚲 Hostel Items", icon: "🚲" },
  { id: "Cycles", name: "🚲 Cycles", icon: "🚲" },
  { id: "Others", name: "👕 Others", icon: "👕" }
];

const CONDITIONS = ["New", "Like New", "Used", "Old"];

export default function SellPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SellFormData>({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    tags: [],
    isFree: false,
    isAvailable: true
  });
  
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Image handling
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    const totalImages = [...images, ...newImages];
    if (totalImages.length > 5) {
      setErrors(prev => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }
    
    setImages(totalImages);
    setErrors(prev => ({ ...prev, images: "" }));
  }, [images]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  }, []);

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    const draggedImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setImages(newImages);
  }, [images]);

  const addTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim().replace('#', '');
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput("");
      }
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 60) {
      newErrors.title = "Title must be 60 characters or less";
    }
    
    if (!formData.isFree && !formData.price.trim()) {
      newErrors.price = "Price is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.condition) {
      newErrors.condition = "Condition is required";
    }
    
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image.file);
      });
      
      // Append other fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('price', formData.isFree ? '0' : formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('isAvailable', formData.isAvailable.toString());

      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(`${import.meta.env.VITE_URL}/items`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Error posting item:", error);
      setErrors({ general: error.response?.data?.message || "Failed to post item" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">Post Item</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Image Upload Section - TOP PRIORITY */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">Add photos (up to 5)</span>
            </div>
            <span className="text-sm text-gray-500">First image will be cover</span>
          </div>
          
          {/* Image Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-400" />
          </button>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      const hoverIndex = index;
                      moveImage(dragIndex, hoverIndex);
                    }}
                    className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-1">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.images && (
            <p className="mt-2 text-sm text-red-600">{errors.images}</p>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl p-6 space-y-6">
          
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g. Study Table – Good Condition"
              maxLength={60}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Clear titles get more views</p>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Price
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                disabled={formData.isFree}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                } ${formData.isFree ? 'bg-gray-100' : ''}`}
                placeholder="e.g. 1500"
              />
            </div>
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="free"
                checked={formData.isFree}
                onChange={(e) => setFormData(prev => ({ ...prev, isFree: e.target.checked, price: e.target.checked ? '0' : prev.price }))}
                className="mr-2"
              />
              <label htmlFor="free" className="text-sm text-gray-700">Free</label>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <button
              type="button"
              onClick={() => setShowCategorySheet(true)}
              className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <span>{formData.category ? CATEGORIES.find(c => c.id === formData.category)?.name || formData.category : "Select category"}</span>
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Condition
            </label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, condition }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.condition === condition
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={300}
              placeholder="Mention defects, usage time, reason for selling..."
            />
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/300 characters</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={addTag}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#wood #study #room"
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={formData.isAvailable}
              onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="available" className="text-sm font-medium text-gray-900">
              Item available
            </label>
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-20 md:pb-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || images.length === 0 || !formData.title || (!formData.isFree && !formData.price) || !formData.category || !formData.condition}
          className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          Post Item
        </button>
      </div>

      {/* Category Bottom Sheet - Mobile */}
      {showCategorySheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Category</h3>
              <button
                onClick={() => setShowCategorySheet(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.id }));
                    setShowCategorySheet(false);
                  }}
                  className={`p-4 rounded-lg text-center font-medium ${
                    formData.category === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-sm">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
}
