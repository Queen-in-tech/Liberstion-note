import { useEffect, useState } from "react"
import SidebarCalender from "./SidebarCalender"
import {IoMdSpeedometer} from "react-icons/io"
import {MdOutlineExplore} from "react-icons/md"
import {AiOutlineCalendar} from "react-icons/ai"
import {AiOutlineHome} from "react-icons/ai"
import { Link, useLocation } from "react-router-dom"

const DairySidebar = () => {
    const [openCalender, setOpenCalender] = useState(true)

    const location = useLocation();


    const openCalenderClass = openCalender ? "w-[auto]" : "w-[25.5vw]"
    const activeClass = openCalender ? "border-[#ffff76] border-l-[6px] shadow-xl" : ""
   
  return (
    <div className={`flex flex-col gap-1 h-[97vh] bg-[#292b4c] py-6 my-2 ml-2 rounded-xl min-w-[auto] ${openCalenderClass}`}>
    <p className={`text-white text-2xl px-3 font-bold ${openCalender? "mb-4" : "mb-8"}`}>Liberation Notes</p>

    <Link 
    to="/dairy" 
    className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dairy" && openCalender === false ? "border-[#ffff76] border-l-[6px] shadow-xl ": ""} `}
    onClick={() => setOpenCalender(false)}>
       <AiOutlineHome className="text-xl"/>
       <span className="">Home</span>
       </Link> 
    
    <div 
    className= {`text-white p-3 font-light flex gap-2 items-center cursor-pointer hover:shadow-xl ${activeClass}`}
    onClick={() => setOpenCalender(!openCalender)}>
       <AiOutlineCalendar className="text-xl "/>
       <span className="text-white">Calender</span>
       </div>
       
     {openCalender && <SidebarCalender/>}

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <IoMdSpeedometer className="text-xl "/>
       <span className="">Dashboard</span>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/explore" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <MdOutlineExplore className="text-xl"/>
       <span className="">Explore</span>
       </Link> 

    </div>
  )
}

export default DairySidebar
