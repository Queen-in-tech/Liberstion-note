import React, { useContext, useEffect, useState } from 'react'
import {AiOutlineSend} from "react-icons/ai"
import { MsgContext } from '../../chatContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../utils/firebase'
import { collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore'
import { CgProfile } from 'react-icons/cg'
import Timeago from "react-timeago";
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {AiOutlineArrowLeft} from 'react-icons/ai'

const Comments = () => {
    const [comment, setComment] = useState("")
    const {currentPostComment, currentPostIndex, setOpenComments} = useContext(MsgContext)
    const [user, loading] = useAuthState(auth)
    const [commentsData, setCommentsData] = useState([]);
    const [comments, setComments] = useState([])

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

    const getAllPostComment = async () => {
        const allComments = query(collectionGroup(db, 'comments'))
        const querySnapshot = await getDocs(allComments);
        const postComment = []
        querySnapshot.forEach((doc) => {
          const commentData = doc.data()
          const commentId = doc.id
         postComment.push({[commentId]: commentData})
        });
        setCommentsData(postComment)
    }

    useEffect(() => {     
            const unsubscribe = onSnapshot(
              query(collectionGroup(db, 'comments')),
              (snapshot) => {
                getAllPostComment();
              }
            );

            getAllPostComment()

          
            return () => {
              unsubscribe();
            };
    }, [currentPostComment])

    useEffect(() => {
        const allPostComment = []

        commentsData.map((data) => {
            if(data[currentPostComment.id]) {
                data[currentPostComment.id]["comment"].map((stuff) => {
                allPostComment.push(stuff)
                })
            }
        })
        setComments(allPostComment)
      

      }, [commentsData, currentPostComment]);

    const commentOnPost = async (post) => {
        const today = new Date(post.time.toDate())
        const username = user.displayName
        const displayPhoto = user.photoURL
        const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData",  revToday, "comments"), post.id)
        const docSnapshot = await getDoc(dailyDataRef) 
          try{
            if( comment !== "") {
              if (docSnapshot.exists()) {
                const existingData = docSnapshot.data();
                const existingComments = existingData.comment || []
                const updatedComments = [...existingComments, { username, displayPhoto, commentText:comment, time: new Date()}];
          
                await updateDoc(dailyDataRef, { comment: updatedComments }).then(
                    setComment("")
                )
              } else {
                const data = [{
                  username,
                  displayPhoto,
                  commentText: comment,
                  time: new Date()
                 }]
                  await setDoc(dailyDataRef, {comment: data}).then(
                    setComment("")
                )
               }
            }
        } catch (error) {
          console.error('Error saving daily data:', error);
        }
      } 

  return (
    <div className='flex flex-col h-full relative'>
      <div className='flex gap-2 items-center'>
      <AiOutlineArrowLeft  className='text-lg md:text-white' onClick={() => setOpenComments((prevStatus) => {
      const updatedState = [...prevStatus]
      updatedState[currentPostIndex] = false;
      return updatedState
    })}/>
      <p className='text-dBlue md:text-white font-bold text-xl'>Commments</p>
      </div>
        <div className='flex flex-col gap-2 overflow-y-scroll pt-3 pb-16'>
        {comments.sort((a, b) => b.time - a.time).map((comment, index) => (
            <div className='bg-dGreen md:bg-white p-3 rounded-md flex gap-2 items-start' key={index}>
                {comment.displayPhoto ? <img src={comment.displayPhoto} alt="user dp" className='w-8 h-8 rounded-full object-cover' /> : <CgProfile className="w-8 h-8 rounded-full mr-1 text-dBlue "></CgProfile>} 
                <div className='flex flex-col gap-1 w-[80%] text-dBlue md:text-black'>
                  <div className='flex gap-2 items-center'>
                <p className='text-sm capitalize'>{comment.username}</p><span className="text-[13px]">
          <Timeago className="text-xs" date={new Date(comment.time?.toDate()).toLocaleString()} formatter={formatter}/>
        </span></div>
                <p className='text-dBlue w-full break-words font-semibold text-sm'>{comment.commentText}</p>
                </div>
            </div>
        ))}

        {comments.length === 0 && <div>
          <p className="md:text-white">No comments yet</p>
          </div>}
        </div>

      <div className='flex bg-white rounded-lg px-2 py-1 items-center absolute bottom-0 right-0 left-0 border-1 border-dBlue md:border-none'>
      {user.photoURL ? <img src={user.photoURL} alt="user dp" className='w-8 h-8 rounded-full bg-white object-cover' /> : <CgProfile className="w-8 h-8 text-dBlue rounded-xl mr-1 md:text-black "></CgProfile>} 
        <textarea cols={2} type="text" value={comment} onChange={(e) => setComment(e.target.value)} className='w-full pl-2 rounded-lg outline-none bg-gray-50'/>
        <button className='text-2xl text-dGreen' onClick={() => commentOnPost(currentPostComment)}><AiOutlineSend/></button>
      </div>
    </div>
  )
}

export default Comments
