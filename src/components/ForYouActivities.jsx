import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {CgProfile} from "react-icons/cg"
import {BsThreeDots} from "react-icons/bs"
import {GrEdit} from "react-icons/gr"
import {MdDeleteOutline} from "react-icons/md"
import { getDocs, collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useContext } from 'react';
import {AiOutlineHeart, AiFillHeart} from "react-icons/ai"
import {VscSmiley} from "react-icons/vsc"


import  Picker  from "@emoji-mart/react";

import Timeago from "react-timeago";
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { AuthContext } from "../../context";
import { MsgContext } from "../../chatContext";



const ForYouActivities = () => {
  const [user, loading] = useAuthState(auth)
  const {likePost, postLikedBy, setPostsData, postsData, setPostLikedBy, postLikedObj} = useContext(AuthContext)
  const { handleOpenComment, getCommentLength} = useContext(MsgContext)
  const [editBox, setEditBox] = useState([])
  const [newText, setNewText] = useState("")
  const [showEmoji, setShowEmoji] = useState(false)

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
   setNewText(newText = emoji)
  }

  const [postOptions, setPostOptions] = useState(-1);

  const handleToggleOptions = (index) => {
    setPostOptions(index === postOptions? -1 : index);
  };

  const openEditBox = (index) => {
    setEditBox((prevBox) => {
      const updatedBox = [...prevBox];
      updatedBox[index] = !updatedBox[index];
      return updatedBox;
    })
  setPostOptions(-1)

  }

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

  const textCountClass = newText.length > 300 ? "text-red-900" : "text-dGreen"
  const textCount = newText ? `${newText.length}/300` : "0/300"

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

const deletePost = async (post) => {
  const today = new Date(post.time.toDate())
  const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData"),  (revToday))
  const docSnapshot = await getDoc(dailyDataRef)
  if (docSnapshot.exists()) {
    const dailyData = docSnapshot.data();
    if (dailyData && dailyData.posts) {
      const updatedPosts = dailyData.posts.filter((eachPost) => eachPost.id !== post.id);
      await updateDoc(dailyDataRef, { posts: updatedPosts }).then(
      setPostOptions(-1)
      )
    } else {
      console.log("Post data or posts array is missing.");
    }}
}

const editPost = async (post, index) => {
  const today = new Date(post.time.toDate())
  const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData"),(revToday))
  const docSnapshot = await getDoc(dailyDataRef)
  if (docSnapshot.exists()) {
    const dailyData = docSnapshot.data();
    if (dailyData && dailyData.posts) {
        const updatedPosts = dailyData.posts.map((eachPost) => {
          if (eachPost.id === post.id) {
          return { ...eachPost, postText: newText, edited:"edited" };
          }
          return eachPost;
        });
      await updateDoc(dailyDataRef, { posts: updatedPosts }).then(
        setEditBox((prevBox) => {
          const updatedBox = [...prevBox];
          updatedBox[index] = !updatedBox[index];
          return updatedBox;
        })
      )
    } else {
      console.log("Post data or posts array is missing.");
    }}
}

  return (
    <>
    <div className='p-5 w-auto flex flex-col gap-3'> 
    {showEmoji && <div className="text-sm text-dGreen absolute bg-white bottom-0 right-0 z-20">
            <Picker onEmojiSelect={addEmoji} emojiButtonSize={28} emojiSize={18}/>
          </div>
        }

    {
      postsData.sort((a, b) => b.time - a.time).map((post, index) => (
        <div className="bg-white p-4 text-gray-500 text-sm rounded-xl" key={post.time}>
          <div className="flex gap-2 relative">
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
        <div className="text-lg flex justify-end md:items-center " onClick={() => handleToggleOptions(index)}>
        <BsThreeDots/> 
      </div>
      </div>

      {postOptions === index && <div className="absolute top-5 right-0 bg-white shadow-md p-4 flex flex-col gap-3 rounded-xl z-20 ">
        <div className="text-dGreen font-bold flex justify-between items-center gap-2" onClick={() => openEditBox(index)}>
          <p> Edit post </p>
          <GrEdit/>
          </div>
          <hr />
        <div className="text-red-600 font-bold flex justify-between items-center gap-2"
        onClick={() => deletePost(post)}
        >
          <p> Delete post </p>
          <MdDeleteOutline/>
        </div>
        </div>}


      <div className="leading-7 md:max-w-[500px]">{post.postText}</div>


      <div className="grid grid-cols-2 gap-2 md:w-[500px]">
      {post.postImage && post.postImage.map((url, index) => (
        <img src={url} key={index} className="object-cover pt-1 rounded-xl"/>
      )) }
      </div>

      </div>

  {editBox[index] && <div  className="bg-gray-200 py-5 px-2 fixed z-30 h-auto bottom-5 rounded-xl right-3">
    <div>
        <textarea cols={5} type="text" autoFocus defaultValue={post.postText} className="h-20 w-64 p-2 outline-none rounded-md"
        onChange={(e) => setNewText(e.target.value)}/>
  </div>
  <div className="flex items-end gap-2 justify-end">
  <p className={`text-[14px] ${textCountClass}`}>{
                textCount
                }</p>
                <VscSmiley className="text-2xl cursor-pointer text-dGreen" onClick={() => setShowEmoji(!showEmoji)}/>
  <button onClick={() => editPost(post, index)} className="bg-dGreen px-6 py-2 mt-1 rounded-md text-white/90 font-bold">Update</button>
  </div>
</div>
}

      </div>
      <div className="px-10">
        <div className="pt-6 text-xl flex cursor-pointer gap-3" >
          <div className="flex">
          {postLikedBy.includes(post.id) ? (<AiFillHeart className="text-red-700" onClick={() =>{
          likePost(post, index)
          setPostLikedBy(postLikedBy.filter(id => id !== post.id))
        }}/>) : (<AiOutlineHeart onClick={() => {
          likePost(post, index)
          setPostLikedBy([...postLikedBy, post.id])
          }}/>)
        }
         <p className="text-xs text-red-700">{postLikedObj.find(like => like.id === post.id)?.initCount}</p></div>
         <p className="text-sm font-semibold text-dBlue" onClick={() => handleOpenComment(index, post)}>Comments <span className="text-xs text-start font-normal">{getCommentLength(post.id)}</span></p>
         <p className="text-sm">{post.edited && post.edited}</p>
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
