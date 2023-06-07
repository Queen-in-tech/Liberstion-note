import { Link } from 'react-router-dom'
import '../css/home.css'
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';

import Nav from '../components/Nav';


const Home = () => {
  const [user, loading] = useAuthState(auth)


  return (

    <>

    <div className='bg-[#aed09e] h-full min-h-screen md:hidden'>
    <Nav/>

      <p className='text-center text-2xl text-[#292b4c] font-bold capitalize pt-12'>welcome to liberation notes</p>
      <div className='flex justify-center'>
      <img src="undraw-people.svg" alt="" className='w-full h-[60vh] object-center'  />
      </div>
      <div className='flex justify-center pt-8'>
      <button className='py-4 w-[90%] border-2 bg-[#292b4c] text-white rounded-2xl'>
      {user? <Link to="/mood">Start writting</Link> : <Link to="/signin">Get started</Link>}</button>
      </div>
      {user? <p onClick= { () => signOut(auth)}  className='text-center mt-1 text-[#292b4c] font-bold text-[1rem]'> sign out </p> : <p  className='text-center mt-1 text-[#292b4c] font-medium text-[1rem]'>Already have an account? <Link to="/login" className='font-extrabold'> Log in </Link> </p> }
     </div>


    <div className='bg-[#aed09e] hidden md:block'>
      <Nav/>
    <div className='  h-[92vh] max-h-screen md:flex justify-around px-12 items-start pt-24 gap-5'>
    <div>
    <div className='text-[#292b4c] font-semibold mt-16'>
        <p className=' text-xl text-bold pb-3'>Write your way to liberation.</p>
        <p className=' text-[0.8rem] w-[45vw] py-3'>Your personal online diary where you can express your thoughts and feelings freely and without fear of judgment. This is your space to share your deepest thoughts, record your experiences, and reflect on your journey..</p>
      </div>
    <div className='flex justify-start gap-4 pt-4'>
    <button className='py-3 px-8 bg-[#292b4c] text-white rounded-2xl text-sm'>
    {user? <Link to="/mood">Start writting</Link> : <Link to="/signin">Get started</Link>}</button>
    <button className='py-3 px-8 text-sm bg-[#292b4c] text-white rounded-2xl'>Connect with others</button>
    </div>
    </div>
    <div className='flex justify-center'>
    <img src="undraw-people.svg" alt="" className='w-[80%] h-[40%] object-center'  />
    </div>
    </div>
    </div>
</>
  )
}

export default Home
