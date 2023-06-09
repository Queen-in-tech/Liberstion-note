import { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { AuthContext } from "../../context";

import { setDoc, getDoc, doc, collection} from "firebase/firestore";

const SidebarCalender = () => {
    const {moodOfTheDay, setMoodOfTheDay, setAllMoodOfDay} = useContext(AuthContext)
    const [date, setDate] = useState(new Date());
    const [user, loading] = useAuthState(auth)

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDate() === new Date().getDate()) {
        let emoji = '';

      if (moodOfTheDay === 'Happy') {
        emoji = '😊';
      } else if (moodOfTheDay === 'Sad') {
        emoji = '😢';
      } else if (moodOfTheDay === 'Excited') {
        emoji = '🎉';
      }  else if (moodOfTheDay === 'Calm') {
        emoji = '😌';
      }  else if (moodOfTheDay === 'Anxious') {
        emoji = '😰';
      }  else if (moodOfTheDay === 'Angry') {
        emoji = '😡';
      }  else if (moodOfTheDay === 'Annoyed') {
        emoji = '😒';
      }  else if (moodOfTheDay === 'Stressed') {
        emoji = '😫';
      }  else if (moodOfTheDay === 'Other') {
        emoji = '🎉';
      }

        return (
            <div className="emoji">{emoji}</div>
        );
      } else return
    }

    return null;
  };


    useEffect( () => {
        const getMoodOfTheDay = async () => {
        const revToday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const moodRef = doc(collection(db, "users", user.uid, "dailyData"), revToday)
        const moodSnap = await getDoc(moodRef)
        if (moodSnap.exists()) {
            const data = moodSnap.data()
            const presentMood = data.moods[data.moods.length - 1].mood
            const allMood = data.moods.map((moodArray) => {
                return moodArray.mood
            })
            setMoodOfTheDay(presentMood)
            setAllMoodOfDay(allMood.join(" then "))
          } else {

            console.log("No such document!");
          }
        }

        getMoodOfTheDay()
    }, [date, moodOfTheDay])

    

  return (
    <div className=''>
        <div className='px-2'>
        <div className='app'>
            <div className='calendar-container'>
                <Calendar onChange={setDate} value={date} tileContent={tileContent} className="text-center rounded-10"/>
            </div>     
        </div>
        </div>
    </div>

  )
}

export default SidebarCalender
