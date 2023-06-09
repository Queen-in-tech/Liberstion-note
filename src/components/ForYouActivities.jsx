import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {CgProfile} from "react-icons/cg"
import {BsThreeDots} from "react-icons/bs"
import { setDoc, getDocs, getDoc, doc, collection, query, where, orderBy, Timestamp, } from "firebase/firestore";
import { useState, useEffect, useContext } from 'react';


const ForYouActivities = () => {
  const [user, loading] = useAuthState(auth)
  const [postsData, setPostsData] = useState([])

  useEffect( () => {
    const getCurentUserPost = async () => {
    const q = query(collection(db, "users", user.uid, "dailyData"));
    const querySnapshot = await getDocs(q);
    const jsonData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jsonData.push(data);
    });

    const postsArray = [];

    jsonData.forEach((obj) => {
      if (obj.posts) {
        postsArray.push(...obj.posts)
      }
    });

    setPostsData(postsArray);
    
    }
    getCurentUserPost()
    
    
}, [])

  return (
    <div className='p-5 w-[650px] flex flex-col gap-3'> 

    {
      postsData.slice().reverse().map((post) => (
        <div className="flex justify-between items-start bg-white p-4 text-gray-500 text-sm rounded-xl">
          <div className="flex gap-2">
        {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-10 h-10 rounded-full bg-white' /> : <CgProfile className="w-8 h-8 rounded-xl mr-1"></CgProfile>} 
        
        <div className="mt-1">
        <div className="flex gap-2 mb-2">
        <p className="font-bold capitalize">{user.displayName}</p> <span>{post.time} {post.privacySettings}</span> <span>{post.moodAsAtPost}</span>
        </div>
        <p className="leading-7 max-w-[500px]">{post.postText}</p>
      </div>
      </div>

      <div className="text-lg">
        <BsThreeDots/>
      </div>
      </div>
      ))
    }
      
    </div>
  )
}

export default ForYouActivities
