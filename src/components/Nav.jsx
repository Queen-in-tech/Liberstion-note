import '../css/nav.css'
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom'
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "../../context";
import { useContext, useState } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { signOut } from "firebase/auth";


import { AiOutlineDown } from 'react-icons/ai';
import Dropdown from './Dropdown';


const Nav = () => {
  const [user, loading] = useAuthState(auth)
  const { dashboard, setDashboard } = useContext(AuthContext)

  return (
    <nav className="bg-transparent flex justify-between px-12 pt-3 md:pt-12">
     <Link to="/" className='hidden md:block'>
     <h1 className='text-2xl text-[#292b4c] font-extrabold'>Liberation Notes</h1>
     </Link>

    <div className='hidden md:block'>
     {
      user ? <div className='text-[#292b4c] flex gap-1 mr-10 items-center justify-center'> 
       <p className='capitalize z-60 hidden md:block'>Hi! {user.displayName}</p>
        {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-8 h-8 rounded-full' /> : <CgProfile className="w-8 h-8"></CgProfile>}
        <button onClick={() => {
        signOut(auth)}}>sign out</button>
      </div> :
      <div className='mr-8'>
      <button className='py-2 px-8 border-2 border-[#292b4c] text-[#292b4c] rounded-2xl text-sm mr-4'>
     <Link to="/login"> Log In </Link>
      </button>
      <button className='py-2 px-8  bg-[#292b4c] text-white rounded-2xl text-sm'>
       <Link to="/signin"> Create free account </Link>
      </button>
    </div>
     }
     </div>

     <div className='md:hidden flex justify-center mx-auto items-top bg-transparent border-2 border-black p-2 rounded-2xl w-[50vw]'>
    <div className='flex gap-3 items-center justify-center'>
     <Link to="/" className=''>
     <h1 className='text-lg text-[#292b4c] font-extrabold'>Liberation Notes</h1>
     </Link>
     
    {user && user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-6 h-6 cursor-pointer rounded-full'/> : <CgProfile className="w-6 h-6 relative cursor-pointer"></CgProfile>}
    <VscColorMode className="w-6 h-6"/>
   
     </div>
     </div>
    </nav>
  )
}

export default Nav
