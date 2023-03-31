import Image from 'next/image';

export default function Component(props) {
    return (
        <>
             <div class="flex flex-col items-center justify-end p-3 rounded-lg drop-shadow-md bg-white border-2 border-b-[#bfbaba] hover:bg-[#f7f6f6] " >
                <div class="flex justify-center h-full">
                <img class="sm:w-6/2 lg:w-6/12" src={props.item.item_picture} alt={"https://logos-world.net/wp-content/uploads/2021/09/NYU-Logo-700x394.png"}/>
                </div>
                <div className='p-4 w-full  hover:text-[#58048c]'>
                <h3 class="font-medium py-2">Item: {props.item.item_name}</h3>
                <h3 className='font-light'>Category: {props.item.cat}</h3>
                <p className='font-light'>Location: {props.item.item_location}</p>
                <p className='font-light'>Description: {props.item.item_desc}</p>
                <p className='font-light'>Quantity: {props.item.item_quantity}</p>
                <p className='font-light'>Data Sheet: {props.item.item_datasheet}</p>
                </div>
            </div>
        </>
    )
}