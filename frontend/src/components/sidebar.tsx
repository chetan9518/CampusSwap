import { BookOpen, Laptop, ShoppingBag, Sofa, Grid3x3 } from "lucide-react";

interface SideBarProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

function SideBar({ activeCategory, onCategoryChange }: SideBarProps){
    const categories = [
        { id: "All", name: "All Categories", icon: Grid3x3 },
        { id: "TextBooks", name: "Textbooks", icon: BookOpen },
        { id: "Electronics", name: "Electronics", icon: Laptop },
        { id: "Furniture", name: "Furniture", icon: Sofa },
        { id: "HostelItems", name: "Hostel Items", icon: ShoppingBag },
    ];
    
    return (
        <div className="w-full h-full bg-gray-50 px-4 py-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Categories
                </h2>

                <div className="space-y-1">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;
                        
                        return (
                            <button 
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-left text-sm transition-all duration-200 ${
                                    isActive
                                        ? "text-blue-700 bg-blue-50 font-semibold shadow-sm"
                                        : "text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900"
                                } focus:outline-none `}
                            >
                              
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"></div>
                                )}
                                
                                <Icon 
                                    className={`w-5 h-5 flex-shrink-0 ${
                                        isActive ? "text-blue-600" : "text-gray-500"
                                    }`} 
                                />
                                <span className="flex-1">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export default SideBar;