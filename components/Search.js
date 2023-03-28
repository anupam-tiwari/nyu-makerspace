import Image from 'next/image'
import React from 'react'

export default function Search() {
    const [query, setQuery] = React.useState("")
    const [mode, setMode] = React.useState("OFF")

    function search() {
        console.log(query)
    }

    function set_mode(){
        if(mode == "OFF"){
            setMode("ON")
        }
        if(mode == "ON"){
            setMode("OFF")
        }
    }

    return (<>
        <div class="flex flex-row items-center">
            <div class="p-2 hidden sm:block">
                <Image
                    src="/logo.png"
                    alt="NYU maker space"
                    width={300}
                    height={300}
                />
            </div>
            <div class="flex flex-row items-center p-2 w-full justify-center">
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" class=" block w-full right-2.5 bottom-2.5 p-2 pl-10 text-sm text-gray-900 rounded-lg " placeholder="Search Items, Sensors..." value={query} onChange={(event) => setQuery(event.target.value)} required></input></div>
                <div class="flex p-2"><button class="text-white  bg-[#58048c] hover:bg-[#350254] font-medium rounded-lg text-sm px-4 py-2" type='submit' onClick={search}>Search</button></div>
                <div class="flex p-2"><button class="text-white  bg-[#58048c] hover:bg-[#350254] font-medium rounded-lg text-sm px-4 py-2" type='submit' onClick={set_mode}>AI:{mode}</button></div>
               

                {/* <div>
                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="search" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required></input>

                    </div>
                </div> */}
            </div>
        </div>
    </>)
}