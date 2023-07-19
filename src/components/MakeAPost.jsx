import { AuthContext } from "../../context";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import {useState, useContext, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import {MdOutlinePrivacyTip} from "react-icons/md"
import {BiImageAdd} from "react-icons/bi"
import {FaTimes} from "react-icons/fa"
import {VscSmiley} from "react-icons/vsc"
import {AiOutlineDown} from "react-icons/ai"
import { setDoc, getDoc, doc, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { v4 as uuid } from 'uuid'
import  Picker  from "@emoji-mart/react";


const MakeAPost = () => {
    const {moodOfTheDay, setMakePostMobile} = useContext(AuthContext)
  const [user, loading] = useAuthState(auth)
    const [postText, setPostText] = useState("")
    const [privacy, setPrivacy] = useState(false)
    const [privacySettings, setPrivacySettings] = useState("Everyone")
    const [imgUrl, setImgUrl] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)
    const textRef = useRef()
    const imgRef = useRef()
    const storage = getStorage();

    
    const handleImageUpload = async(e) => {

      const files = imgRef.current.files;
      try {
        for(let i = 0; i < files.length; i++){
          const file = imgRef.current.files[i]
          const storageRef = ref(storage, "post-images/" + file.name);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
   
          setImgUrl((prevImageUrl) => [...prevImageUrl, imageUrl])
        }
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }

    const removeImg = async (index) => {
      try {

  //     console.log(imgRef.current.files[index].name)


  //     const filesArray = Array.from(imgRef.current.files);

     
  //     const fileName = imgRef.current.files[index].name


  //   // Filter out the file with the given fileName
  //   const updatedFiles = filesArray.filter(file => file.name != fileName);

  //   const dataTransfer = new DataTransfer();
  //   updatedFiles.forEach((file) => {
  //     dataTransfer.items.add(file);
  //   });

  //   // Update the value of the input element with the updated files
  //   imgRef.current.files = dataTransfer.files;

  //  handleImageUpload()


    } catch (error) {
      console.error("Error deleting photo", error);
    }
  }
    

    const handleInput = () => {
        setPostText(textRef.current.innerText)
    }

    const addEmoji = (e) => {
      let sym = e.unified.split("-");
      let codesArray = [];
      sym.forEach((el) => codesArray.push("0x" + el));
      let emoji = String.fromCodePoint(...codesArray);
      textRef.current.innerText = textRef.current.innerText + emoji
    }

    const textCountClass = postText.length > 300 ? "text-red-900" : "text-dGreen"
    const textCount = postText? `${postText.length}/300` : "0/300"

    const today = new Date()

        const saveDailyData = async() => {
            try{
            const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
            const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData"), revToday)
          
            const docSnapshot = await getDoc(dailyDataRef);
            const time = new Date()
            const id = uuid()
      
            if (docSnapshot.exists()) {
              const existingData = docSnapshot.data();
              const existingPosts = existingData.posts || [];
              const updatedPosts = [...existingPosts, { postText, time, moodAsAtPost: moodOfTheDay, privacySettings, uid:user.uid, id, postImage: imgUrl}];
        
              await updateDoc(dailyDataRef, { posts: updatedPosts });
            } else {
              const initialData = {
                initialLogIn: serverTimestamp(),
                posts: [{ postText, time, moodAsAtPost: moodOfTheDay, privacySettings, uid:user.uid ,id, postImage: imgUrl}],
              };
      
             await setDoc(dailyDataRef, initialData)
              .then('Daily data saved successfully!')};
           
          } catch (error) {
            console.error('Error saving daily data:', error);
          }}
         
          const handleClick = () => {
            if(postText.length <= 300 && postText.length != 0){
            saveDailyData()
            textRef.current.innerText = ""
            setPostText("")
            setImgUrl([])
          }
          }
         

   
  return (
    <div className="">
    <div className="mx-3 md:mx-10 bg-white rounded-xl relative">
        <div className="pt-4 md:border-b-dGreen border-b-[1.5px] rounded-b-xl">

          <div className="flex justify-between px-2 pt-2 pb-4 md:hidden">
            <p className="text-dBlue" onClick={() => setMakePostMobile(false)}>Cancel</p>
            <button className={`bg-dGreen px-5 py-1 md:hidden text-white text-sm rounded-2xl ${postText.length > 300 && "bg-[#94f7c8] cursor-not-allowed"}`} onClick={handleClick}>Post</button>
          </div>

            <div className="md:min-h-[80px] h-auto">
            {!postText && <span className="absolute text-gray-400 pointer-events-none p-5">Why are you feeling {moodOfTheDay} today?</span>}
            
            <div contentEditable="true" 
            spellCheck="true" 
            className="outline-none mt-[-12px] pb-20 pt-5 px-5 md:p-5 break-words text-gray-700" 
            ref={textRef}
            onInput={handleInput}
            ></div>

            <div className="grid grid-cols-2 px-5 gap-2">
            {imgUrl && imgUrl.map((url, index) => (
              <div className="relative">
              <img src={url} className="object-cover rounded-xl" key={index}/>
              <FaTimes className="absolute top-1 left-2 bg-black text-xl p-1 cursor-pointer rounded-full text-white " onClick={() => removeImg(index)}/>
              </div>
            ))}
            </div>            

            <div className="flex justify-between items-center pl-3 pr-5">

             <div className="">
            <button 
            className="flex text-[13px] gap-1 px-2 py-1 items-center text-dGreen font-semibold border border-dGreen rounded-xl"
            onClick={() => setPrivacy(!privacy)}><MdOutlinePrivacyTip/> <span>{privacySettings} can see this</span> <AiOutlineDown /> </button>
            </div>

            <input type="file" name="file" className="hidden" ref={imgRef}  multiple onChange={handleImageUpload}/>

            <div className="p-2 flex gap-2 items-center">
                <p className={`text-[13px] ${textCountClass}`}>{
                textCount
                }</p>
                <VscSmiley className="text-2xl cursor-pointer text-dGreen" onClick={() => setShowEmoji(!showEmoji)}/>
                <BiImageAdd className="text-2xl cursor-pointer text-dGreen" onClick={() => imgRef.current.click()}/>
                <button className={`bg-dGreen px-5 py-1 hidden md:block text-white text-sm rounded-2xl ${postText.length > 300 && "bg-[#94f7c8] cursor-not-allowed"}`}onClick={handleClick}>Post</button>
            </div>
            </div>
            </div>
        </div>

        {
         showEmoji && <div className="text-sm text-dGreen absolute bg-white top-[105px] z-50">
            <Picker onEmojiSelect={addEmoji} emojiButtonSize={28} emojiSize={18}/>
          </div>
        }

        { privacy && <div className="text-sm text-dGreen absolute bg-white top-[105px] rounded-xl z-50">
                <div className="flex flex-col p-4">
                    <p className="hover:shadow-xl hover:rounded-b-lg cursor-pointer py-2"
                    onClick={() => {
                    setPrivacySettings("Everyone") 
                    setPrivacy(false)}
                    }>Everyone</p>
                    <p className="hover:shadow-lg hover:rounded-b-lg cursor-pointer py-2"
                    onClick={() =>{
                    setPrivacySettings("Only you")
                    setPrivacy(false)}
                    }>Only you</p>
                </div>
            </div> }  
    </div>

    
    </div>
  )
}
  

export default MakeAPost
