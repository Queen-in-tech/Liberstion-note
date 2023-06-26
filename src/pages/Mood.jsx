import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { AiOutlineRight } from 'react-icons/ai';
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context";
import { Link } from "react-router-dom";
import { setDoc, getDoc, doc, collection, updateDoc, serverTimestamp } from "firebase/firestore";


import Nav from "../components/Nav";



const moodButtons = [
  { label: "Sad", color: "#0000FF" },
  { label: "Happy", color: "#00FF00" },
  { label: "Stressed", color: "#FFA500" },
  { label: "Calm", color: "#00FFFF" },
  { label: "Angry", color: "#FF0000" },
  { label: "Excited", color: "#FF1493" },
  { label: "Anxious", color: "#800080" },
  { label: "Annoyed", color: "#FFFF00" }

];

const Mood = () => {
  const [user, loading] = useAuthState(auth)
  const [activeIndex, setActiveIndex] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const { mood,setMood } = useContext(AuthContext)

  
  const bgColor = (index, activeMood) => {
      setMood(activeMood)
      setActiveIndex(index)
      setIsActive(true)
  }


   const active = activeIndex === 0 ? `bg-gray-600` : activeIndex === 1 ? `bg-[#eff542]` : activeIndex === 2? `bg-[#f54260]` : activeIndex===3? `bg-[#f58142]` : activeIndex===4? `bg-[#f5cb42]` : activeIndex===5? `bg-[#7e42f5]` : activeIndex===6? `bg-[#e642f5]`: activeIndex===7?`bg-[#42f5bc]`: "bg-gray-100"

  const today = new Date()

  useEffect(()=> {
  const saveDailyData = async() => {
      try{
      const revToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
      const dailyDataRef = doc(collection(db, "users", user.uid, "dailyData"), revToday)
    
      const docSnapshot = await getDoc(dailyDataRef);
      const time = new Date().toLocaleTimeString()

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();
        const existingMoods = existingData.moods || []
        const updatedMoods = [...existingMoods, { mood, time }];
  
        await updateDoc(dailyDataRef, { moods: updatedMoods });
      } else {
        const initialData = {
          initialLogIn: serverTimestamp(),
          moods: [{ mood, time }],
        };

       await setDoc(dailyDataRef, initialData)
        .then('Daily data saved successfully!')};
     
    } catch (error) {
      console.error('Error saving daily data:', error);
    }}
   
    const button = document.getElementById('saveMoodBtn');
    button.addEventListener('click', saveDailyData);

    return () => {
      button.removeEventListener('click', saveDailyData);
    };


  }, [mood, today]);



  return (
    <>
    <Nav/>
    <div className="flex flex-col md:flex-row justify-center items-center mt-10 md:items-start md:mt-28 h-screen  px-10 md:justify-between md:gap-20">
      <div className="flex flex-col justify-center items-center  md:w-[50vw]">
      <img src="undraw-smiley-face.svg" alt="" className="shrink-0 w-[80%] sm:w-[60%] md:w-[100%] lg:w-[80%]" />
      <img src="blob-egg.svg" alt="" className="absolute -z-10 top-10 ml-10 md:w-[700px] md:top-36 lg:top-32"/>
      <p className=" md:hidden text-xl text-center lg:text-center mt-2 font-semibold text-[#292b4c] lg:text-2xl">How are you feeling today, <br /> {user.displayName}?</p>
      </div>

    <div>
      <div className="md:w-[40vw] lg:w-[50vw] md:flex md:flex-col md:justify-center md:items-center md:gap-10">
      <p className="hidden md:block text-xl text-center lg:text-center mt-2 font-semibold text-[#292b4c] lg:text-2xl">How are you feeling today, <br /> {user.displayName}?</p>
      <div className="mt-20 md:mt-0 grid grid-rows-3 grid-cols-3 gap-y-5 gap-x-2">
      {moodButtons.map((moodButton, index) => (
          <button className={activeIndex === index && isActive? `mood ${active}` : `mood bg-gray-100`}
          onClick={() => bgColor(index, moodButton.label)}
          key={index}
         >
          {moodButton.label}
          </button>   
      ))}
      </div> 
      </div>


    <div className="flex justify-center">

      <button className=" pr-4 py-2 w-[75%] md:w-[85%] lg:w-[55%] text-white font-bold text-lg bg-[#89c6a9] mt-4 md:m-12 rounded-xl"
      id="saveMoodBtn"
      >
      <Link to="/dairy" className="flex text-center items-center justify-end gap-16 md:gap-28">Continue <AiOutlineRight/></Link>
      </button>
    </div>
    </div>
    </div>
    </>

  )
}

export default Mood
