import {useState} from 'react'
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import {AiOutlineMessage, AiOutlineSearch, AiOutlineBell} from "react-icons/ai"
import {CgProfile} from "react-icons/cg"

const BodyHeader = () => {
    const [date, setDate] = useState(new Date());
    const [user, loading] = useAuthState(auth)


    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

  return (
    <div className='p-7 flex justify-between items-center'>
        <div>
        {isToday && <p className="capitalize text-xl font-bold text-gray-500"> Hello {user.displayName} !</p>
         }
        </div>

      <div className='bg-white flex justify-center items-center px-2 rounded-xl'>
        <input type="text" className='outline-none border-none w-full p-2 bg-white text-gray-500 rounded-xl' />
        <AiOutlineSearch className='text-xl text-gray-500'/>
      </div>

      <div className='flex gap-2 justify-center items-center text-gray-500'>
        <AiOutlineMessage className='w-8 h-8 p-1 rounded-xl bg-white'/>
        <AiOutlineBell className='w-8 h-8 p-1 rounded-xl bg-white'/>
        {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-6 h-6 rounded-full bg-white' /> : <CgProfile className="w-8 h-8 bg-white p-1 rounded-xl"></CgProfile>}
      </div>
    </div>
  )
}

export default BodyHeader
