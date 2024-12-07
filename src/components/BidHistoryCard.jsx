const BidHistoryCard = ({item})=>{
    return(
        <div className="flex justify-between items-center px-2 border-green-500 w-[90%] py-1 rounded-xl shadow-lg shadow-gray-300">
            <div className="flex justify-center items-center gap-4">
                <div>
                    <img src={item.image} alt="" className="w-[65px] h-[65px] rounded-full" />
                </div>

                <div className="flex flex-col  justify-center ">
                    <p className=" font-[700] text-[20px]">{item.name}</p>
                    <p className=" font-[700] text-[16px] text-red-600">Base - {item.base}</p>
                    <p className=" font-[400] text-[12px]">{item.status}</p>
                </div>
            </div>

            <div className="flex flex-col">
                <p className="font-[400] text-[12px]">points</p>
                <p className="font-[700] text-[16px]">{item.points}</p>
            </div>
        </div>
    )
}

export default BidHistoryCard