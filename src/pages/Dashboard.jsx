import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react";
import { AiFillEdit } from 'react-icons/ai';
import { VscColorMode } from 'react-icons/vsc';
import { ImExit } from 'react-icons/im';
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context";



const Dashboard = () => {
  const [user, loading] = useAuthState(auth)
  const { dashboard, setDashboard } = useContext(AuthContext)

  useEffect(() => {
    if(dashboard){
      setDashboard(false)
    }
  }, [])

  return (
  <div className='flex gap-10'>
      <div className='py-6 px-6 h-screen border-r-2 border-red ml-20 flex flex-col gap-4 text-lg text-red-800'>
      <Link to="/dashboard">
        <div className="flex gap-4 items-center mt-5 cursor-pointer">
            <AiFillEdit className="w-6 h-6 ml-1"/>
            <p className="text-[16px]">Edit profile</p>
        </div>
        </Link>

        <div className="flex gap-4 items-center mt-2 border-b-2 border-[#f3e9dc] pb-4 cursor-pointer">
            <VscColorMode className="w-6 h-6 ml-1"/>
            <p className="text-[16px]">Theme</p>
        </div>

        <div className="flex gap-4 items-center mt-1 py-4 cursor-pointer" onClick={() => {
        signOut(auth)}}>
            <ImExit className="w-6 h-6 ml-1"/>
            <p className="text-[16px]">Log out</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="shadow-md py-3 px-4 mt-5">
          <p className="">Username</p>
          <span className="mt-2 ml-2">{user.displayName}</span>
        </div>

        <div className="shadow-md py-3 px-4">
          <p className="">Email</p>
          <span className="mt-2 ml-2">{user.email}</span>
        </div>

        <div className="shadow-md py-3 px-4">
          <p className="">Email verification</p>
          <span className="mt-2 ml-2">{user.emailVerified ? "Yes" : "No"}</span>
        </div>

        <div className="shadow-md py-3 px-4">
          <p className="">Phone number</p>
          <span className="mt-2 ml-2">{user.phoneNumber ? user.phoneNumber : "Null"}</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
