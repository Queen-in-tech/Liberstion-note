import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useContext, useState, useRef } from "react";
import { AiFillEdit } from 'react-icons/ai';
import { AuthContext } from "../../context";
import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import DairySidebar from "../components/DairySidebar";
import { CgProfile } from "react-icons/cg";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Dashboard = () => {
  const [user, loading] = useAuthState(auth)
  const [update, setUpdate] = useState(false)
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const [image, setImage] = useState(`${user.photoURL}`)
  const [name, setName] = useState(`${user.displayName}`)
  const imgRef = useRef()
  const storage = getStorage();


  const handleImageUpload = async() => {

    try {
        const file = imgRef.current.files[0]

        const storageRef = ref(storage, "profile-image/" + file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
 
        setImage(imageUrl)
    } catch (error) {
      console.error("Error uploading image", error);
    }
  }

  const handleUpdateProfile = () => {
    try {
      updateProfile(user, {
        displayName: `${name}`, photoURL: `${image}`
      }).then( () => 
        {setUpdate(false)
        toast.success('Profile updated successfully.')}
      )
    } catch (error) {
      toast.success('Profile updated was not successfull, Try again.')
    }   
  }

  const handleEmailVerification = () => {
    try{
      sendEmailVerification(user)
    .then(() => {
      toast.success(`Verification email sent to ${user.email}, please check your inbox`)
    });
    } catch (error) {
      toast.error('An error occured, please try again later.')
    } 
  }

  return (
  <div className='flex gap-10 relative'>
    <DairySidebar />

    {update && <div className="absolute bg-black/70 top-0 right-0 left-0 bottom-0 z-50">
      <div className="flex justify-center items-center h-screen ">
        <div className="bg-white py-8 px-4 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
        <img src={image}/>
        <div className="flex flex-col">
            <label htmlFor="image">Image</label>
            <input type="file" id="image" ref={imgRef} className="border-2 border-black px-1 py-2 ml-2" onChange={handleImageUpload}/>
          </div>

          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" defaultValue={user.displayName} className="border-2 border-black px-1 py-2 ml-2" onChange={(e) => setName(e.target.value)}/>
          </div>
        </div>

        <div className="flex gap-4 justify-center items-center">
        <button className="py-2 px-5 font-medium bg-red-600 text-white rounded-md" onClick={() => setUpdate(false)}>Cancel</button>
        <button className="py-2 px-5 bg-dGreen text-white rounded-md font-medium" onClick={handleUpdateProfile}>Update</button>
        </div>
        </div>
      </div>
      </div>}

    {confirmDeactivate && <div className="absolute bg-black/70 px-2 top-0 right-0 left-0 bottom-0 z-50">
      <div className="flex justify-center items-center h-screen ">
        <div className="bg-white py-8 px-4 flex flex-col gap-6">
        <p className="text-black text-center bg-white text-lg">Are you sure you want to <b>PERMANENTLY deactivate</b> your account?</p>
        <div className="flex gap-6 justify-center items-center">
        <button className="py-2 px-5 font-medium bg-dGreen text-white rounded-md" onClick={() => setConfirmDeactivate(false)}>Cancel</button>
        <button className="p-2 bg-red-600 text-white rounded-md font-medium">Confirm deactivation</button>
        </div>
        </div>
      </div>
      </div>}

      <div className="flex flex-col gap-5 py-12">
        { user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-56 h-56 cursor-pointer rounded-full object-cover'/> : <CgProfile className="w-56 h-56 relative cursor-pointer text-gray-700"></CgProfile>}
        <div className="md:w-[30vw] flex flex-col gap-3">
        <div className="shadow-md py-3 px-4 mt-5 text-dBlue">
          <p className="">Username</p>
          <span className="mt-2 ml-2 font-semibold">{user.displayName}</span>
        </div>

        <div className="shadow-md py-3 px-4 text-dBlue">
          <p className="">Email</p>
          <span className="mt-2 ml-2 font-semibold">{user.email}</span>
        </div>

        <div className="shadow-md py-3 px-4 text-dBlue flex justify-between">
          <div>
          <p className="">Email verification</p>
          <span className="mt-2 ml-2 font-semibold">{user.emailVerified ? "Yes" : "No"}</span>
          </div>
         {!user.emailVerified && <button className="rounded-md text-dGreen font-semibold hover:text-dGreen/80" onClick={handleEmailVerification}>Verify now</button>}
        </div>

        <div className="shadow-md py-3 px-4 text-dBlue">
          <p className="">Phone number</p>
          <span className="mt-2 ml-2 font-semibold">{user.phoneNumber ? user.phoneNumber : "Null"}</span>
        </div>
        </div>

        <div className="flex gap-6 w-full mt-5">
        <button className=" p-2 bg-dGreen text-white rounded-md" onClick={() => setUpdate(true)}>Update profile</button>
        <button className=" p-2 bg-red-600 text-white rounded-md font-medium" onClick={() => setConfirmDeactivate(true)}>Deactivate account</button>
        </div>
      </div>
      <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
    </div>
  )
}

export default Dashboard
