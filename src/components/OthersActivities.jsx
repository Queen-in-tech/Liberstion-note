import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {CgProfile} from "react-icons/cg"
import {BsThreeDots} from "react-icons/bs"
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import { getDocs, getDoc, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useState, useEffect, useContext } from 'react';

import Timeago from "react-timeago";
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { AuthContext } from "../../context";

const OthersActivities = () => {
  const [user, loading] = useAuthState(auth)
  const [userIds, setUserIds] = useState([])
  const [userDetails, setUserDetails] = useState()
  const {likePost, postLikedBy, setPostsData, postsData, postLikedObj, setPostLikedBy} = useContext(AuthContext)

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
    const getUsersPosts = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
  
      const userIds = querySnapshot.docs.map((doc) => doc.id);
      setUserIds(userIds);

  
      setUserDetails(querySnapshot.docs.reduce((users, doc) => {
        users[doc.id] = doc.data();
        return users;
      }, {}));

      const jsonData = await Promise.all(
        userIds.map(async (id) => {
          const q = query(
            collection(db, "users", id, "dailyData"),
            orderBy("posts", "asc"),
          );
          const querySnapshot = await getDocs(q);

          const userPosts = querySnapshot.docs.reduce((posts, doc) => {
            const userData = doc.data();

            if (userData.posts) {
              posts.push(
                ...userData.posts.sort((a, b) => b.time - a.time)
              );
            }

            return posts;
          }, []);

          return userPosts;
        })
      );

      const flattenedPosts = jsonData.flat();
      setPostsData(flattenedPosts);
    }

    if(user){
    getUsersPosts()

    }

    const unsubscribe = onSnapshot(
      query(collection(db, "users", user.uid, "dailyData"), orderBy("posts", "asc")),
      (snapshot) => {
        getUsersPosts();
      }
    );
  
    return () => {
      unsubscribe();
    };
    
}, [user, ])

  return (
    <div className='p-5 flex flex-col gap-3'> 
    {
      postsData.sort((a, b) => b.time - a.time).map((post, index) => {
        const postUser = userDetails && userDetails[post?.uid];

        return post.privacySettings === "Everyone" && <div className="flex flex-col md:block bg-white px-2 py-4 md:p-4 text-gray-500 text-sm rounded-xl md:shrink-0" key={post.id}>
        <div className="flex gap-2 pb-5">
        {userDetails && postUser.photoURL ? <img src={postUser.photoURL} alt="user dp" className='w-10 h-10 rounded-full bg-white' /> : <CgProfile className="w-8 h-8 rounded-xl mr-1"></CgProfile>} 
        
        <div className="mt-1">
        <div className=" flex justify-between">
        <div className="flex gap-2 mb-2 items-center">
        <p className="font-bold capitalize">
          {userDetails && post.uid && postUser.username}
        </p> 
        <span className="text-[13px]">
          <Timeago date={new Date(post.time?.toDate()).toLocaleString()} formatter={formatter}/>
        </span>
        </div>
        <div className="hidden md:block text-lg items-center">
        <BsThreeDots/> 
      </div>
      </div>

        <p className="leading-7 md:max-w-[500px] ">{post.postText}</p>

        <div className="grid grid-cols-2 gap-2  md:min-w-[500px] md:w-[500px] ">
      {post.postImage && post.postImage.map((url, index) => (
        <img src={url} key={index} className="object-cover pt-1 rounded-xl"/>
      )) } 
        </div>
        
      </div>
      <div className="md:hidden text-lg items-center">
        <BsThreeDots/> 
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

})
    }
      
    </div>
  )
}

export default OthersActivities
