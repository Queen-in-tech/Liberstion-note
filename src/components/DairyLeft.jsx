import { useContext } from "react"
import Comments from "./Comments"
import { MsgContext } from "../../chatContext"
import Massage from "./Massage"

const DairyLeft = () => {
const {openComments, currentPostIndex, openMessage} = useContext(MsgContext)

  return (
  <div className={`${openComments[currentPostIndex] || openMessage ? "fixed" : "hidden"} right-0 left-0 top-0 bottom-0 w-full h-screen bg-white z-50 md:block text-black md:w-[27vw] md:h-[84vh] md:mr-4 p-4 md:bg-dGreen md:rounded-xl md:sticky md:top-24`}>
    {openComments[currentPostIndex] && <Comments/>}
    {!openComments[currentPostIndex] && <Massage/>}
    </div>
  )
}

export default DairyLeft
