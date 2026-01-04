import { useNavigate } from "react-router-dom";

  interface Itemcard{
       id:number,
        imageurl :string,
        title:string,
        price:number,
        hostel:string,
        date:Date,
        year:string
        
    }
    interface ItemsCardProps {
  x: Itemcard;
}
function ItemsCard({x}:ItemsCardProps){
    const navigate = useNavigate();
    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm active:shadow-md transition flex flex-col">
            <img
                src={x.imageurl}
                className="h-28 md:h-40 w-full object-cover rounded-t-lg"
                alt={x.title}
            />
            <div className="p-2 md:p-3 flex flex-col flex-1">
                <h3 className="text-xs md:text-[15px] font-medium line-clamp-2 mb-0.5 md:mb-1">
                   {x.title}
                </h3>
                <p className="text-green-600 text-sm md:text-lg font-bold mt-0.5 md:mt-1">
                    Rs. {x.price}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
                    {x.hostel} | {x.year}
                </p>
                <button 
                onClick={()=>{navigate(`/items/:${x.id}`)}}
                className="mt-auto w-full rounded-md bg-blue-600 active:bg-blue-700 text-white text-[10px] md:text-sm py-1.5 md:py-2 font-medium mt-2 md:mt-3 transition-colors">
                    View Item
                </button>
            </div>
        </div>
    )
}
export default ItemsCard;