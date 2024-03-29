import { useContext, useEffect, useState } from "react"
import SidebarCalender from "./SidebarCalender"
import {IoMdSpeedometer} from "react-icons/io"
import {MdOutlineExplore, MdOutlineDeveloperBoard} from "react-icons/md"
import {AiOutlineCalendar} from "react-icons/ai"
import {AiOutlineHome} from "react-icons/ai"
import {AiOutlineMail, AiOutlineBell} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"
import {BiExit} from "react-icons/bi"
import { Link, useLocation } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { MsgContext } from "../../chatContext"


const DairySidebar = () => {
    const [openCalender, setOpenCalender] = useState(false)
    const {openMessage, setOpenMessage} = useContext(MsgContext)
    
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

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${openMessage ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} md:hidden`} onClick={() => setOpenMessage(true)}>
       <AiOutlineMail className="text-2xl md:text-xl"/>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} md:hidden `}>
       <AiOutlineBell className="text-2xl md:text-xl"/>
       </Link> 

      <div className="hidden md:block">
     {openCalender && <SidebarCalender/>}
     </div>

       <Link to="/dashboard" className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/dashboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <CgProfile className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Dashboard</span>
       </Link> 

       <Link className={`p-3 text-white font-light flex gap-2 items-center  hover:shadow-xl ${location.pathname === "/moodboard" ? "border-[#ffff76] border-l-[6px] shadow-xl": ""} `}>
       <MdOutlineDeveloperBoard className="text-2xl md:text-xl"/>
       <span className="hidden md:block">Moodboard</span>
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
