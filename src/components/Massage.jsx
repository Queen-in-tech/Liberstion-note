import { collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chat from './Chat';
import { MsgContext } from '../../chatContext';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import {CgProfile} from "react-icons/cg"

const Massage = () => {
  const [searchInput, setSearchInput] = useState("")
  const [userData, setUserData] = useState([])
  const [user, loading] = useAuthState(auth)
  const [chatList, setChatList] = useState([])
  const [startChat, setStartChat] = useState(false)
  const [otherUser, setOtherUser] = useState("")
  const [key, setKey] = useState("")
  const {openMessage, setOpenMessage} = useContext(MsgContext)


  const handleSearchUser = async (e) => {
    if(e.key === "Enter"){
      
    const q = query(collection(db, "users"), where("username", "==", `${searchInput}`));

    const querySnapshot = await getDocs(q)
      const dataInArray = []
      querySnapshot.forEach((doc) => {
        dataInArray.push(doc)
      })
     setUserData(dataInArray);

     setSearchInput("");

    }
  }

  const handleRooms = async (searchedUser, userId) => {
    setUserData([])
    const roomID = user.uid > userId ? user.uid+userId : userId+user.uid 
    setKey(roomID)
    setStartChat(true)
    setOtherUser(searchedUser)
    const roomRef = doc(collection(db, "chatRooms"), roomID)
    const querySnap = await getDoc(roomRef)
    const firstPersonName = user.displayName
    const firstPersonPhoto = user.photoURL
    const secondPersonName = searchedUser.username
    const secondPersonPhoto = searchedUser.photoURL
    try{
    if(!querySnap.exists()){
      await setDoc(roomRef, {
        chatInitiatedOn: serverTimestamp(),
        firstPerson:{
          firstPersonName,
          firstPersonPhoto
        },
        secondPerson:{
         secondPersonName,
         secondPersonPhoto
        },
        lastMessage:""
       })
    }}
    catch(error){
      console.log("error occured", error)
    }
  }


  useEffect(() => {
    const getChatList = async () => {
      const openChatList =  query(collectionGroup(db, 'chatRooms'))
        const querySnapshot = await getDocs(openChatList);
        const chat = []
        
        querySnapshot.forEach((doc) => {
         const chatData = doc.data()
         
          const chatId = doc.id
          if(chatId.includes(user.uid)){
         chat.push({[chatId]: chatData})}
        });
        setChatList(chat.sort((a,b) => a - b))
    }

    const unsubscribe = onSnapshot(
      query(collectionGroup(db, 'chatRooms')),
      (snapshot) => {
        getChatList();
      }
    );

    getChatList()

  
    return () => {
      unsubscribe();
    };
  }, [])

const renderDateTime = (date) => {

  const time =  date.toDate()
  const hours =   time.getHours();
  const minutes =  time.getMinutes();
  const amPm = time.toLocaleString().slice(-2);
  const msgTime = `${hours}:${minutes}${amPm}`;
  const isToday = () => {
    const today = new Date();
    return time.toDateString() === today.toDateString();
  };
  
  const formatDate = () => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return time.toLocaleDateString(undefined, options);
  };

  if (isToday()) {

    return msgTime;
  } else {

    return formatDate();
  }
};
  
  return (
    <div className=''>
      <div className='flex justify-between items-center'>
      <AiOutlineArrowLeft  className='text-dBlue text-lg md:text-white block md:hidden' onClick={() => setOpenMessage(false)}/>
      <p className='text-dBlue md:text-white text-xl font-bold'>Messages</p>
      <div></div>
      </div>
      <div className="" onKeyDown={(e) => handleSearchUser(e)}>
      <input type="text" placeholder='Search User' className=" py-2 rounded-2xl bg-dBlue/30 md:bg-white/30 text-center w-full placeholder:text-dBlue md:placeholder:text-white placeholder:text-lg text-dBlue md:text-white my-2 outline-none" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
      </div>

      {
        userData && userData.map((user, index) => {
         return <div className='flex items-center gap-2 py-4' key={index} onClick={() => handleRooms(user.data(), user.id)}>
            {user.data().photoURL ? <img src={user.data().photoURL} alt="user dp" className='w-8 h-8 rounded-full object-cover'/> : <CgProfile className="w-8 h-8"></CgProfile>}
            <p className="text-dBlue md:text-white font-semibold capitalize">{user.data().username}</p>
          </div>
        })
      }
      {chatList? 
        <div className='py-3 flex flex-col gap-4'>
       { chatList.sort((a,b) => b[Object.keys(b)].lastMessageTime - a[Object.keys(a)].lastMessageTime).map((chat, index) => {
          for (const key in chat){
            const doc = chat[key]
            const person = doc.firstPerson.firstPersonName !== user.displayName ? doc.firstPerson : doc.secondPerson
            const personName = doc.firstPerson.firstPersonName !== user.displayName ? doc.firstPerson.firstPersonName : doc.secondPerson.secondPersonName
            const personPhoto = doc.firstPerson.firstPersonPhoto !== user.photoURL ? doc.firstPerson.firstPersonPhoto : doc.secondPerson.secondPersonPhoto
           
            return <div className='flex justify-between shadow-md p-2' key={key} onClick={() => {
              setStartChat(true)
              setOtherUser(person)
              setKey(key)
            }}>
            <div className="flex gap-2 items-center">
            {personPhoto ? <img src={personPhoto} alt="user dp" className='w-9 h-9 rounded-full object-cover'/> : <CgProfile className="w-8 h-8"></CgProfile>}
            <div>
            <p className="text-dBlue md:text-white capitalize flex-row items-center justify-between">{personName}</p>
            {doc.lastMessage && <p className="text-dBlue/50 md:text-white/80 text-sm">{doc.lastMessageBy === user.displayName ? "You:  " : ""}{doc.lastMessage}</p>}
            </div>
            </div>
            <span className="lowercase text-sm text-dBlue/50 md:text-white/80 text-center">{`${doc.lastMessageTime? renderDateTime(doc.lastMessageTime) : ""}`}</span>
            </div>
          } 
         })}
        
        </div>
       : <p className='text-white font-bold py-2'>No open chats yet</p>}

       {startChat && <Chat otherUser={otherUser} roomId={key} setStartChat={setStartChat}/>}
    </div>
  )
}

export default Massage
