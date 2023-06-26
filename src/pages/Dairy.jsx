import DairySidebar from "../components/DairySidebar"
import DairyBody from "../components/DairyBody"
import BodyHeader from "../components/BodyHeader";

//import { auth} from "../utils/firebase";
//import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "../../context";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";


const Dairy = () => {
  //const [user, loading] = useAuthState(auth)
  // const {moodOfTheDay} = useContext(AuthContext)
  // const navigate = useNavigate()

  // useEffect(() => {
  //  if(!moodOfTheDay) {
  //   navigate("/mood") 
  // }
  // },[moodOfTheDay])


  return (
    <div className="flex bg-gray-100 relative">
      <DairySidebar />
      <div className="md:w-[80%] relative">
        <div className="sticky bg-gray-100 z-20 top-0">
        <BodyHeader />
        </div>
        <div>
        <DairyBody />
        </div>
      </div>
    </div>
  )
}

export default Dairy
