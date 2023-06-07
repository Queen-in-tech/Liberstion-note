import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { setDoc, getDoc, doc, collection} from "firebase/firestore";

const Dairy = () => {
    const [date, setDate] = useState(new Date());
    const [moodOfTheDay, setMoodOfTheDay] = useState("")
    const [allMoodOfDay, setAllMoodOfDay] = useState([])
    const [user, loading] = useAuthState(auth)

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDate() === new Date().getDate() ) {
        let emoji = '';

      if (moodOfTheDay === 'Happy') {
        emoji = '😊';
      } else if (moodOfTheDay === 'Sad') {
        emoji = '😢';
      } else if (moodOfTheDay === 'Excited') {
        emoji = '🎉';
      }

        return (

            <div className="tile-content">
            <div className="emoji">{emoji}</div>
          </div>
       
        );
      }
    }

    return null;
  };


    useEffect( () => {
        const getMoodOfTheDay = async () => {
        const revToday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const moodRef = doc(collection(db, "users", user.uid, "dailyData"), revToday)
        const moodSnap = await getDoc(moodRef)
        if (moodSnap.exists()) {
           // console.log("Document data:", moodSnap.data());
            const data = moodSnap.data()
            const presentMood = data.moods[data.moods.length - 1].mood
            const allMood = data.moods.map((moodArray) => {
                return moodArray.mood
            })
            setMoodOfTheDay(presentMood)
            setAllMoodOfDay(allMood.join(" then "))
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
        }

        getMoodOfTheDay()
    }, [date, moodOfTheDay])

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

  return (
    <div>
        <div className='flex'>
            <div className='flex flex-col h-[97.7vh] bg-[#292b4c] pt-4 mt-2 ml-1 rounded-xl'>
                <div className='p-2'>
                <div className='app'>
                    <div className='calendar-container'>
                        <Calendar onChange={setDate} value={date} tileContent={tileContent} className="text-center rounded-10"/>
                    </div>
                    
                </div>
                </div>

            </div>

            <div>
                {isToday ? (
                    <p className="capitalize">Hello {user.displayName}, why are you feeling {moodOfTheDay}?</p>
                ) : (
                    <p className="capitalize"></p>
                )}
            </div>
        </div>
    </div>
  )
}

export default Dairy
