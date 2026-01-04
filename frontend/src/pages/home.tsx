import { useState } from "react";
import ItemsCard from "../components/itemcard";
import { BookOpen, Laptop, ShoppingBag, Sofa, Search } from "lucide-react";

interface Itemcard {
    id: number,
    imageurl: string,
    title: string,
    price: number,
    hostel: string,
    date: Date,
    year: string
}

function Homepage() {
        const [activeCategory, setCategory] = useState("TextBooks");
    const categories = [
        { id: "TextBooks", name: "Textbooks", icon: BookOpen },
        { id: "Electronics", name: "Electronics", icon: Laptop },
        { id: "Furniture", name: "Furniture", icon: Sofa },
        { id: "HostelItems", name: "Hostel Items", icon: ShoppingBag },
    ];

    const [items] = useState<Itemcard[]>([
        {
            id: 1,
            imageurl:
                "/dummy.jpg",
            title: "Engineering Mathematics Textbook",
            price: 300,
            hostel: "Hostel 3",
            date: new Date("2025-01-01"),
            year: "2nd Year",
        },
        {
            id: 2,
            imageurl:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
            title: "Physics for Engineers",
            price: 450,
            hostel: "Hostel 1",
            date: new Date("2025-01-03"),
            year: "1st Year",
        },
        {
            id: 3,
            imageurl:
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
            title: "Data Structures & Algorithms",
            price: 600,
            hostel: "Hostel 2",
            date: new Date("2025-01-05"),
            year: "3rd Year",
        },
        {
            id: 4,
            imageurl:
                "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
            title: "Operating Systems Concepts",
            price: 520,
            hostel: "Hostel 4",
            date: new Date("2025-01-07"),
            year: "3rd Year",
        },
        {
            id: 5,
            imageurl:
                "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
            title: "Computer Networks",
            price: 480,
            hostel: "Hostel 5",
            date: new Date("2025-01-09"),
            year: "2nd Year",
        },
        {
            id: 6,
            imageurl:
                "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
            title: "Hostel Study Table",
            price: 1200,
            hostel: "Hostel 6",
            date: new Date("2025-01-10"),
            year: "Final Year",
        },
        {
            id: 7,
            imageurl:
                "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
            title: "Ergonomic Study Chair",
            price: 1500,
            hostel: "Hostel 2",
            date: new Date("2025-01-11"),
            year: "Final Year",
        },
        {
            id: 8,
            imageurl:
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
            title: "Scientific Calculator",
            price: 650,
            hostel: "Hostel 1",
            date: new Date("2025-01-12"),
            year: "1st Year",
        },
        {
            id: 9,
            imageurl:
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
            title: "Programming Laptop (Used)",
            price: 22000,
            hostel: "Hostel 7",
            date: new Date("2025-01-13"),
            year: "3rd Year",
        },
        {
            id: 10,
            imageurl:
                "https://images.unsplash.com/photo-1583223667854-86c2a2b2c6a6?auto=format&fit=crop&w=600&q=80",
            title: "Backpack for College",
            price: 900,
            hostel: "Hostel 4",
            date: new Date("2025-01-14"),
            year: "2nd Year",
        },
    ]);

    return (
        <div className="w-full flex flex-col">
            <div className="md:hidden mb-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        className="w-full pl-10 pr-4 h-8 rounded-lg text-sm text-gray-800 placeholder-gray-500 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="Search items in your campus..."
                    />
                </div>
            </div>

            <div className="md:hidden mb-3">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-gray-900">
                        Categories
                    </h2>
                    <select className="rounded border border-gray-300 bg-white text-gray-800 px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>Sort by: Recent</option>
                        <option>Old</option>
                    </select>
                </div>
                <div className="space-y-1 w-50 p-2 shadow-lg rounded-lg">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setCategory(category.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
                                    isActive
                                        ? "text-white bg-blue-600 font-semibold"
                                        : "text-gray-700 font-medium hover:bg-gray-100"
                                } focus:outline-none`}
                            >
                                <Icon
                                    className={`w-5 h-5 flex-shrink-0 ${
                                        isActive ? "text-white" : "text-gray-500"
                                    }`}
                                />
                                <span className="flex-1 text-sm">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="hidden md:flex items-center shadow-sm border border-gray-200 bg-white p-5 rounded-lg justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-2xl">Available items in IIIT Agartala</h2>
                <select className="rounded-lg border border-gray-300 bg-white text-gray-800 px-4 py-2 text-sm font-medium shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <option>Recent</option>
                    <option>Old</option>
                </select>
            </div>

            <div className="md:hidden mb-3">
                <h2 className="font-bold text-gray-900 text-base">Available items in IIIT Agartala</h2>
            </div>

            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 pb-4 md:pb-6">
                {items.map((item) => (
                    <ItemsCard key={item.id} x={item} />
                ))}
            </div>
        </div>
    )

}
export default Homepage;