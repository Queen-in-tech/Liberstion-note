import { collection, collectionGroup, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../utils/firebase"
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai"
import {BsThreeDots} from "react-icons/bs"
import  Picker  from "@emoji-mart/react";
import { BiImageAdd } from "react-icons/bi"
import { VscSmiley } from "react-icons/vsc"

const Chat = ({otherUser, setStartChat, roomId}) => {
  const [user, loading] = useAuthState(auth)
  const [showEmoji, setShowEmoji] = useState(false)
  const [messageInput, setMessageInput] = useState(false)
  const [message, setMessage] = useState("")
  const [messageData, setMessageData] = useState([])
    const textRef = useRef()
    const imgRef = useRef()
    const scrollRef = useRef()
    
  const otherUserName = otherUser.firstPersonName? otherUser.firstPersonName : otherUser.secondPersonName || otherUser.username
  const otherPhoto = otherUser.firstPersonPhoto? otherUser.firstPersonPhoto: otherUser.secondPersonPhoto || otherUser.photoURL

  const handleStartChat = () => {
    setMessageInput(true)
  }

  const handleInput = () => {
    setMessage(textRef.current.innerText)
    }

    const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    textRef.current.innerText = textRef.current.innerText + emoji
    }
  
    const today = new Date()

    useEffect(() => {

        const getConvo = async () => {
        const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const q = doc(collection(db, "chatRooms", roomId, "convos"), revToday )

        const querySnapshot = await getDoc(q)
        if(!querySnapshot.exists()){
            await setDoc(q, {})   
        }

        const allMessages = await getDocs(query(collection(db, "chatRooms", roomId, "convos")))
        const msgArray = []
      
        allMessages.docs.forEach((doc) => {
            const dataArr = doc.data().messages
            dataArr?.map((doc2) => {
                const data = doc2
                msgArray.push(data)
           })
            setMessageData(msgArray)}           
        )

    }

    getConvo()

    const unsubscribe = onSnapshot(
        query((collection(db, "chatRooms", roomId, "convos"))),
        (snapshot) => {
          getConvo();
        }
      );
  
    
      return () => {
        unsubscribe();
      };
    }, [roomId])

    useEffect(() => {
        const updateLastMessage = async () => {
        const lastMsg = messageData[messageData.length - 1]
        const roomRef = doc(collection(db, "chatRooms"), roomId)
        const room = await getDoc(roomRef)
        const existingDoc = room.data()
        const updatedDoc = {...existingDoc, lastMessage: lastMsg.message, lastMessageBy: lastMsg.from, lastMessageTime: lastMsg.time}
        await updateDoc(roomRef, updatedDoc)}

        messageData.length > 0 && updateLastMessage()
    }, [messageData])

    const sendMessage = async () => {
        textRef.current.innerText = ""
        const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const q = doc(collection(db,"chatRooms", roomId, "convos"), revToday )

        try{
            const querySnapshot = await getDoc(q)
                if (querySnapshot.exists()) {
                    const existingData = querySnapshot.data();
                    const existingMessages = existingData.messages || []
                    const updatedData = [...existingMessages, {
                        message,
                        time: new Date(),
                        from: user.displayName,
                    }];
                    await updateDoc(q, {messages: updatedData})
                } else {
                    const initialData = {
                    messages:[
                    {message,
                    time: new Date(),
                    from: user.displayName,
                }]
                };
            
                await setDoc(q, initialData)
                .then('Daily data saved successfully!')}; 
            }
            catch(err){
                console.log(err)
            }
        
    }

    useLayoutEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messageData]);

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 z-10 md:rounded-2xl bg-dGreen  p-4">
      <div>
        <div className="flex justify-between ">
             <AiOutlineArrowLeft className='text-lg text-white' onClick={() => setStartChat(false)}/>

            <div className="flex flex-col gap-1 justify-center items-center">
                <img src={otherPhoto} alt="" className="h-8 w-8 rounded-full"/>
                <p className="text-white font-semibold text-lg capitalize">{otherUserName}</p>
            </div>

            <BsThreeDots className="text-lg text-white"/>
        </div>

        <div className="flex flex-col gap-2 mt-3 h-[61vh] overflow-y-scroll">
            {messageData && messageData.map((message, index) => {
                return <div key={index} className={`flex ${message.from === user.displayName? "justify-end" : " justify-start" }`}  ref={index === messageData.length - 1 ? scrollRef : null}>
                    <div className={`p-2 w-auto max-w-[70%] ${message.from === user.displayName? "bg-dBlue rounded-l-lg rounded-tr-lg" : "bg-white/40 rounded-r-lg rounded-tl-lg" }`}>
                    <p className="text-white">{message.message}</p>
                    </div>
                </div>
            })}
        </div>
        <div className="flex flex-col gap-2 absolute bottom-2 right-2 left-2 z-20 bg-white/30  rounded-xl py-2 pb-4 px-2">
        {messageInput && <div contentEditable="true" 
            spellCheck="true" 
            autoFocus={true}
            className="outline-none break-words text-white" 
            ref={textRef}
            onInput={handleInput}
            ></div>}
        <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
        <VscSmiley className="text-2xl cursor-pointer text-white" onClick={() => setShowEmoji(!showEmoji)}/>
        <BiImageAdd className="text-2xl cursor-pointer text-white" onClick={() => imgRef.current.click()}/>

        <div
            className={`outline-none break-words text-white ${messageInput && "hidden"}`}
            onClick={handleStartChat}
            >Start a message</div>

        <input type="file" name="file" className="hidden" ref={imgRef}  multiple />
        </div>
        <AiOutlineSend className="text-white font-bold text-2xl" onClick={sendMessage}/>
        </div>
        </div>
      </div>

      {
         showEmoji && <div className="text-sm text-white absolute bg-white bottom-10 z-30">
            <Picker onEmojiSelect={addEmoji} emojiButtonSize={28} emojiSize={18}/>
          </div>
        }
    </div>
  )
}

export default Chat
