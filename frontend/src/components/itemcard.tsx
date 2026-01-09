import { useNavigate } from "react-router-dom";

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
interface ItemsCardProps {
  x: Itemcard;
}
function ItemsCard({x}:ItemsCardProps){
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm active:shadow-md transition flex flex-col overflow-hidden">
            {/* Image: square on mobile, slightly taller on desktop */}
            <div className="relative w-full pb-[100%] md:pb-[70%] overflow-hidden">
                <img
                    src={x.images[0] || '/placeholder.jpg'}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={x.title}
                    onClick={()=>{navigate(`/items/${x.id}`)}}
                />
            </div>
            <div className="p-2 md:p-3 flex flex-col flex-1">
                <h3 className="text-sm md:text-[15px] font-bold leading-5 line-clamp-2 mb-1">
                   {x.title}
                </h3>
                <p className="text-green-600 text-base md:text-lg font-bold mb-1">
                    Rs. {x.price}
                </p>
                <p className="hidden md:block text-[10px] md:text-xs text-gray-500">
                    {x.condition}
                </p>
                <button 
                    onClick={()=>{navigate(`/items/${x.id}`)}}
                    className="hidden md:block mt-auto w-full rounded-md bg-blue-600 active:bg-blue-700 text-white text-[10px] md:text-sm py-1.5 md:py-2 font-medium mt-2 transition-colors">
                    View Item
                </button>
            </div>
        </div>
    )
}
export default ItemsCard;