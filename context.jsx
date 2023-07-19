import { useReducer, createContext } from "react";
import { getDocs, getDoc, collection, query, onSnapshot, doc, setDoc, updateDoc, deleteDoc, collectionGroup } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { auth, db } from "./src/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";



const AuthContext = createContext();

const initialState = {
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    error: false,
    errorMsg: ""
  }
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case"setEmail":
        return {...state, email: action.payload}
      case"setUsername":
        return {...state, username: action.payload}
      case"setPassword":
        return {...state, password: action.payload}
      case"setConfirmPassword":
        return {...state, confirmPassword: action.payload}  
      case "passwordValidation":
       if(state.password.length < 5){
          return {...state, error: true, errorMsg: "Password must be at least 6 characters long."}
        } else {
          return {...state, error: false};
        }
      case "confirmPasswordValidation":
       if(state.password !== state.confirmPassword){
          return {...state, error: true, errorMsg: "Passwords does not match."}
        } else {
          return {...state, error: false};
        }
      case "setError":
          return {...state, error: true, errorMsg: action.payload}
      case "clearErrorMsg":
          return {...state, errorMsg: action.payload}  
      case "clearField":
          return {...state, email: "", password: "", confirmPassword: "", username: ""};
      case "wrongCredential": 
        return {...state, error: true, errorMsg: action.payload};
      default:
        return state;
    }
  }

const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [mood, setMood] = useState("")
  const [moodColor, setMoodColor] = useState("")
  const [moodOfTheDay, setMoodOfTheDay] = useState("")
  const [allMoodOfDay, setAllMoodOfDay] = useState([])
  const [postLikedBy, setPostLikedBy] = useState([])
  const [allPostLiked, setAllPostLiked] = useState([])
  const [postLikedObj, setPostLikedObj] = useState([])
  const [postsData, setPostsData] = useState([])
  const [user, loading] = useAuthState(auth)
  const [makePostMobile, setMakePostMobile] = useState(false)

  useEffect(() => {
    const getPostLikedByUser = async () => {
      const likesQuery = query(
        collection(db, "users", user.uid, "dailyData")
      );
    
      const querySnapshot = await getDocs(likesQuery);
      
      const likedPostsPromises = querySnapshot.docs.map( (doc) => {
        const likeQuery = query(
          collection(db, "users", user.uid, "dailyData", doc.id, "likes")
        );
    
        return getDocs(likeQuery)
         
      });
      const likedPosts = []
    
      const likedPostsSnapshots = await Promise.all(likedPostsPromises);
       likedPostsSnapshots.map((snapshot) => snapshot.docs.map((doc) => likedPosts.push(doc.id)));
      setPostLikedBy(likedPosts);
    }
  
    if(user?.uid){
    getPostLikedByUser()
    }
    
  }, [user?.uid])
  
  useEffect(() => {
    const getAllPostLiked = async () => {
      const allLikes = query(collectionGroup(db, 'likes'))
      const querySnapshot = await getDocs(allLikes);
      const likesCount = []
      querySnapshot.forEach((doc) => {
        const likedData = doc.id
        likesCount.push(likedData)
        setAllPostLiked(likesCount)
      });}
  
      getAllPostLiked()
  
      const unsubscribe = onSnapshot(
        query(collectionGroup(db, 'likes')),
        (snapshot) => {
          getAllPostLiked();
        }
      );
    
      return () => {
        unsubscribe();
      };
  
  }, [])
  
    const checkPostLikes = () => {
      const count = []
     const postLikes = postsData.map(post => {
      const initCount = allPostLiked.filter((likedId) => likedId === post.id).length;
  
  
      return { id: post.id, initCount };
      }) 
  
      count.push(...postLikes)
      setPostLikedObj(count)
    }
  
    useEffect(() => {
    checkPostLikes()
  
    const unsubscribe = onSnapshot(
      query(collectionGroup(db, 'likes')),
      (snapshot) => {
        checkPostLikes();
      }
    );
  
    return () => {
      unsubscribe();
    }
  
    }, [allPostLiked, postsData])
  
    const likePost = async (post) => {
      const today = new Date(post.time.toDate())
      const username = user.displayName
      const displayPhoto = user.photoURL
      const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData",  revToday, "likes"), post.id)
      const docSnapshot = await getDoc(dailyDataRef)
      if(!postLikedBy.includes(post.id)){ 
        try{
        
        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data();
          const existingLikes = existingData.likes || []
          const updatedLikes = [...existingLikes, { username, displayPhoto}];
    
          await updateDoc(dailyDataRef, { likedPosts: updatedLikes })
        } else {
          const data = [{
            username,
            displayPhoto
           }]
            await setDoc(dailyDataRef, {likedPosts: data})
         }
       
      } catch (error) {
        console.error('Error saving daily data:', error);
      }
    } else {
      const docRef = doc(db, "users", user.uid, "dailyData", revToday, "likes", post.id)
      await deleteDoc(docRef)
      }
    } 

  return(
    <AuthContext.Provider value={{state, dispatch, mood, setMood, moodColor, setMoodColor, moodOfTheDay, setMoodOfTheDay, allMoodOfDay, setAllMoodOfDay, likePost, allPostLiked, postLikedBy, setPostLikedBy, postLikedObj, setPostsData, postsData, makePostMobile, setMakePostMobile}}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext}