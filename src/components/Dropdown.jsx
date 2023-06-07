import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { CgProfile } from 'react-icons/cg';
import { VscColorMode } from 'react-icons/vsc';
import { ImExit } from 'react-icons/im';
import { signOut } from 'firebase/auth';
import { Link } from "react-router-dom";


const Dropdown = ({setDashboard}) => {
  const [user, loading] = useAuthState(auth)

  return (
    <div className="px-3 pt-8 right-20 bg-[#5B2333] absolute rounded-md mt-1 z-20">
      <div className="text-[#f3e9dc]">
        <Link to="/dashboard">
        <div className="flex gap-2 items-center">
        {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-8 h-8 rounded-full' /> : <CgProfile className="w-8 h-8"></CgProfile>}
            <div>
                <p className="text-sm">{user.email}</p>
                <p className="text-xs">{user.displayName}</p>
            </div>
        </div>
        </Link>

        <Link to="/dashboard">
        <div className="flex gap-4 items-center mt-5 cursor-pointer">
            <CgProfile className="w-6 h-6 ml-1"/>
            <p className="text-sm">Profile dashboard</p>
        </div>
        </Link>

        <div className="flex gap-4 items-center mt-2 border-b-2 border-[#f3e9dc] pb-4 cursor-pointer">
            <VscColorMode className="w-6 h-6 ml-1"/>
            <p className="text-sm">Theme</p>
        </div>

        <div className="flex gap-4 items-center mt-1 py-4 cursor-pointer" onClick={() => {
        signOut(auth).then(() => {setDashboard(false)})
       }}>
            <ImExit className="w-6 h-6 ml-1"/>
            <p className="text-sm">Log out</p>
        </div>
      </div>
    </div>
  )
}

export default Dropdown
