import { collectionGroup, getDocs, onSnapshot, query } from "firebase/firestore";
import {  createContext, useEffect, useState } from "react";
import { db } from "./src/utils/firebase";

const MsgContext = createContext()

const MsgProvider = ({children}) => {
    const [openComments, setOpenComments] = useState([])
    const [currentPostComment, setCurrentPostComment] = useState({})
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [commentsData, setCommentsData] = useState([])
    const [openMessage, setOpenMessage] = useState(false)

    const handleOpenComment = (index, post) => {
        setOpenComments((prevStatus) => {
          const updatedState = [...prevStatus]
          updatedState[index] = true;
          return updatedState
        })
        setCurrentPostComment(post)
        setCurrentPostIndex(index)
      }

    const getAllPostComment = async () => {
        const allComments = query(collectionGroup(db, 'comments'))
        const querySnapshot = await getDocs(allComments);
        const postComment = []
        querySnapshot.forEach((doc) => {
          const commentData = doc.data()
          const commentId = doc.id
         postComment.push({[commentId]: commentData})
        });
      
        const concatenatedComments = postComment.reduce((result, comment) => {
          const commentId = Object.keys(comment)[0];
          const commentData = comment[commentId];
        
          const existingEntry = result.find((entry) => Object.keys(entry)[0] === commentId);
        
          if (existingEntry) {
            existingEntry[commentId].comment = existingEntry[commentId].comment.concat(commentData.comment);
          } else {
            result.push(comment);
          }
        
          return result;
        }, []);
        setCommentsData(concatenatedComments);
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
      }, [])
      
      const getCommentLength = (id) => {
        const commentEntry = commentsData.find(comment => comment[id]);
        if (commentEntry) {
          return commentEntry[id]["comment"].length;
        }
        return 0;
      }
    return(
        <MsgContext.Provider value={{
            openComments, setOpenComments, handleOpenComment, currentPostComment, currentPostIndex, getCommentLength, openMessage, setOpenMessage
        }}>
            {children}
        </MsgContext.Provider>
    )
}

export {MsgContext, MsgProvider}