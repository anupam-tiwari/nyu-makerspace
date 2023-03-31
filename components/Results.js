import React from 'react'
import Component from './Component';
export default function Main(props) {
    var list_items = props.item_render
    return (
        <>
            <div class="p-5" >
                {list_items && <div className='grid m-auto grid-cols-3 gap-4'>{list_items.map((item) => (
                    <Component key={Math.floor(Math.random() * 1000000)} item={item} ></Component>
                ))}
                </div>}
            </div>
        </>
    )
}

//key={props.item.item_name}