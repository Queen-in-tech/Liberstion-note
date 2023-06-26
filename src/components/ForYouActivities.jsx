import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {CgProfile} from "react-icons/cg"
import {BsThreeDots} from "react-icons/bs"
import { getDocs, collection, query, orderBy, onSnapshot, limit, collectionGroup } from "firebase/firestore";
import { useState, useEffect, useContext } from 'react';
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"


import Timeago from "react-timeago";
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { AuthContext } from "../../context";


const ForYouActivities = () => {
  const [user, loading] = useAuthState(auth)
  const {likePost, postLikedBy, setPostsData, postsData, setPostLikedBy, postLikedObj} = useContext(AuthContext)

  const formatter = buildFormatter({
    prefixAgo: '',
    prefixFromNow: '',
    suffixAgo: '',
    suffixFromNow: '',
    second: '1s',
    seconds: '%ds',
    minute: '1m',
    minutes: '%dm',
    hour: '1h',
    hours: '%dh',
    day: '1d',
    days: '%dd',
    week: '1w',
    weeks: '%dw',
    month: '1mo',
    months: '%dmo',
    year: '1y',
    years: '%dy',
  });


  useEffect( () => {
    const getCurentUserPost = async () => {
    const q = query(collection(db, "users", user.uid, "dailyData"), orderBy("posts", "asc"));
    const querySnapshot = await getDocs(q);
    const jsonData = [];


    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jsonData.push(data);
    });

    const postsArray = [];

    jsonData.forEach((obj) => {
      if (obj.posts) {
        postsArray.push(...obj.posts.sort((a, b) => b.time - a.time))
      }
    });

    setPostsData(postsArray);   
    }

    getCurentUserPost();

    const unsubscribe = onSnapshot(
      query(collection(db, "users", user.uid, "dailyData"), orderBy("posts", "asc")),
      (snapshot) => {
        getCurentUserPost();
      }
    );
  
    return () => {
      unsubscribe();
    };
    
    
}, [])


  return (
    <>
    <div className='p-5 w-auto flex flex-col gap-3'> 

    {
      postsData.sort((a, b) => b.time - a.time).map((post) => (
        <div className="bg-white p-4 text-gray-500 text-sm rounded-xl" key={post.time}>
          <div className="flex gap-2">
        {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-8 h-8 rounded-full bg-white' /> : <CgProfile className="w-8 h-8 rounded-xl mr-1"></CgProfile>} 
        
        <div className="mt-1 w-full">
        <div className=" flex justify-between">
        <div className="flex gap-2 mb-2 items-center">
        <p className="font-bold capitalize">
          {user.displayName}
        </p> 
        <span className="text-[13px]">
          <Timeago date={new Date(post.time?.toDate()).toLocaleString()} formatter={formatter}/>
        </span>
        </div>
        <div className="text-lg flex justify-end md:items-center">
        <BsThreeDots/> 
      </div>
      </div>

      <p className="leading-7 md:max-w-[500px]">{post.postText}</p>


      <div className="grid grid-cols-2 gap-2 md:w-[500px]">
      {post.postImage && post.postImage.map((url, index) => (
        <img src={url} key={index} className="object-cover pt-1 rounded-xl"/>
      )) }
      </div>

      </div>
      </div>
      <div className="px-10">
        <div className="py-1 text-xl flex cursor-pointer gap-1" onClick={() => {
          likePost(post, index)}}>
          {postLikedBy.includes(post.id) ? (<AiFillHeart className="text-red-700" onClick={() =>{
          setPostLikedBy(postLikedBy.filter(id => id !== post.id))
        }}/>) : (<AiOutlineHeart onClick={() => {
          setPostLikedBy([...postLikedBy, post.id])
          }}/>)
        }
         {<p className="text-xs text-red-700">{postLikedObj.find(like => like.id === post.id)?.initCount}</p>}
        </div>
        </div>
      </div>

      
      ))
    }
      
    </div>
    </>
  )
}

export default ForYouActivities
