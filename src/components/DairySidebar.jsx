import { useEffect, useState } from "react"
import SidebarCalender from "./SidebarCalender"
import {IoMdSpeedometer} from "react-icons/io"
import {MdOutlineExplore, MdOutlineDeveloperBoard} from "react-icons/md"
import {AiOutlineCalendar} from "react-icons/ai"
import {AiOutlineHome} from "react-icons/ai"
import {AiOutlineMessage, AiOutlineSearch, AiOutlineBell} from "react-icons/ai"
import {BiExit} from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";



const DairySidebar = () => {
    const [openCalender, setOpenCalender] = useState(true)

    const location = useLocation();


    const openCalenderClass = openCalender ? "w-[auto]" : "w-[20.4vw]"
    const activeClass = openCalender ? "border-[#ffff76] border-l-[6px] shadow-xl" : ""
   
  return (
    <div className={`flex flex-col gap-1 h-[100vh] md:h-[97vh] bg-[#292b4c] py-6 md:my-2 md:ml-2 rounded-r-xl md:rounded-xl md:min-w-[15vw] z-20 sticky top-0 md:top-3 ${openCalenderClass}`}>
    <p className={`hidden md:block text-white text-2xl px-3 font-bold ${openCalender? "mb-4" : "mb-8"}`}>Liberation Notes</p>

    <Link 
    to="/dairy" 
    className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dairy" && openCalender === false ? "border-[#ffff76] border-l-[6px] shadow-xl ": ""} ${activeClass} `}
    onClick={() => setOpenCalender(false)}>
       <AiOutlineHome className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Home</span>
       </Link> 
    
    <div 
    className= {`text-white p-3 font-light gap-2 items-center cursor-pointer hover:shadow-xl hidden md:flex`}
    onClick={() => setOpenCalender(!openCalender)}>
       <AiOutlineCalendar className="text-2xl md:text-xl "/>
       <span className="text-white hidden md:block">Calender</span>
       </div>

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} md:hidden`}>
       <AiOutlineMessage className="text-2xl md:text-xl"/>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} md:hidden `}>
       <AiOutlineBell className="text-2xl md:text-xl"/>
       </Link> 

      <div className="hidden md:block">
     {openCalender && <SidebarCalender/>}
     </div>

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <IoMdSpeedometer className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Dashboard</span>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <MdOutlineDeveloperBoard className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Moodboard</span>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/explore" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <MdOutlineExplore className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Explore</span>
       </Link> 

       <button className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/explore" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} ` } onClick={() => {
        signOut(auth)}}>
       <BiExit className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Sign out</span>
       </button> 

    </div>
  )
}

export default DairySidebar
