import { AuthContext } from "../../context";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import {useState, useContext, useRef, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {MdOutlinePrivacyTip} from "react-icons/md"
import {BiImageAdd} from "react-icons/bi"
import {AiOutlineDown} from "react-icons/ai"
import { setDoc, getDoc, doc, collection, updateDoc, serverTimestamp } from "firebase/firestore";

const MakeAPost = () => {
    const {moodOfTheDay} = useContext(AuthContext)
  const [user, loading] = useAuthState(auth)
    const navigate = useNavigate()
    const [postText, setPostText] = useState("")
    const [privacy, setPrivacy] = useState(false)
    const [privacySettings, setPrivacySettings] = useState("Everyone")
    const textRef = useRef()
    

    const handleInput = () => {
        setPostText(textRef.current.innerText)
    }

    const textCountClass = postText.length >= 300 ? "text-red-900" : "text-dGreen"
    const textCount = postText? `${postText.length}/300` : "0/300"

    const today = new Date()

    useEffect(()=> {
        const saveDailyData = async() => {
            try{
            const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
            const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData"), revToday)
          
            const docSnapshot = await getDoc(dailyDataRef);
            const time = new Date().toLocaleTimeString()
      
            if (docSnapshot.exists() && docSnapshot.data().moods) {
              const existingData = docSnapshot.data();
              const existingPosts = existingData.posts || [];
              const updatedPosts = [...existingPosts, { postText, time, moodAsAtPost: moodOfTheDay, privacySettings}];
        
              await updateDoc(dailyDataRef, { posts: updatedPosts });
            } else {
              const initialData = {
                initialLogIn: serverTimestamp(),
                posts: [{ postText, time, moodAsAtPost: moodOfTheDay, privacySettings }],
              };
      
             await setDoc(dailyDataRef, initialData)
              .then('Daily data saved successfully!')};
           
          } catch (error) {
            console.error('Error saving daily data:', error);
          }}
         
          const handleClick = () => {
            if(postText.length <= 300){
            saveDailyData()
            textRef.current.innerText = ""
            setPostText("")}
          }

          const button = document.getElementById('savePostBtn');
          button.addEventListener('click', handleClick);
      
          return () => {
            button.removeEventListener('click', handleClick);
          };
      
      
        }, [postText, today]);
   
  return (
    <div className="">
    <div className="mx-10 bg-white rounded-xl relative">
        <div className="pt-4 border-b-dGreen border-b-[1.5px] rounded-b-xl">

            <div className="min-h-[80px] h-auto">
            {!postText && <span className="absolute text-gray-400 pointer-events-none p-5">Why are you feeling {moodOfTheDay} today?</span>}
            
            <div contentEditable="true" 
            spellCheck="true" 
            className="outline-none mt-[-12px] p-5 break-words" 
            ref={textRef}
            onInput={handleInput}
            ></div>

            <div className="flex justify-between items-center pl-3 pr-5">

             <div className="">
            <button className="flex text-[13px] gap-1 px-2 py-1 items-center text-dGreen font-semibold border border-dGreen rounded-xl"><MdOutlinePrivacyTip/> <span>{privacySettings} can see this</span> <AiOutlineDown onClick={() => setPrivacy(!privacy)}/> </button>
            </div>

            <div className="p-2 flex gap-2 items-center">
                <p className={`text-[13px] ${textCountClass}`}>{
                textCount
                }</p>
                <BiImageAdd className="text-xl text-dGreen"/>
                <button className={`bg-dGreen px-5 py-1 text-white text-sm rounded-2xl ${postText.length > 300 ? "bg-[#94f7c8] cursor-not-allowed" : ""}`} id="savePostBtn">Post</button>
            </div>
            </div>
            </div>
        </div>

        { privacy && <div className="text-sm text-dGreen absolute bg-white top-[110px] rounded-xl">
                <div className="flex flex-col p-2">
                    <p className="hover:shadow-xl hover:rounded-b-lg cursor-pointer p-2"
                    onClick={() => setPrivacySettings("Everyone")}>Everyone</p>
                    <p className="hover:shadow-lg hover:rounded-b-lg cursor-pointer p-2"
                    onClick={() => setPrivacySettings("Only you")}>Only you</p>
                </div>
            </div> }  
    </div>

    
    </div>
  )
}
  

export default MakeAPost
