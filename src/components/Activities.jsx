import ForYouActivities from "./ForYouActivities"
import MakeAPost from "./MakeAPost"
import React, { useContext, useEffect, useState } from "react"
import OthersActivities from "./OthersActivities"
import {AiOutlinePlus} from "react-icons/ai"
import { AuthContext } from "../../context"

const Activities = () => {
  const [toLoadALL, setToLoadAll] = useState(false)
  const [toLoadYours, setToLoadYours] = useState(false)
  const {setMakePostMobile, makePostMobile} = useContext(AuthContext)
  const allPostStyle = toLoadALL && "border-b-4 border-b-dGreen"
  const yourPostStyle = toLoadYours && "border-b-4 border-b-dGreen"

  useEffect(() => {
    setToLoadAll(true)
  }, [])

  return (
    <React.Fragment >
      <div className="w-[87vw] md:w-[60%] relative">
      <div className="hidden md:block">
      <MakeAPost/>
      </div>
      <p className="pt-7 text-2xl text-dBlue font-bold text-center md:hidden">Liberation Notes</p>
      <div className='border-b-[0.2px] border-dGreen mt-5 px-3 md:pt-3 mx-3.5 md:mr-1 text-gray-500 sticky bg-gray-100 z-40 top-0 md:top-20 '>
      <div className="flex justify-around">
        <p className={`md:hover:bg-gray-200 rounded-t-xl py-3 px-3 md:px-24 ${allPostStyle} cursor-pointer`}
        onClick={() => { 
          setToLoadYours(false)
          setToLoadAll(true)
        }}>All Posts</p>
        <p className={`md:hover:bg-gray-200 rounded-t-xl py-3 px-3 md:px-24 ${yourPostStyle} cursor-pointer`}
        onClick={() => { 
          setToLoadYours(true)
          setToLoadAll(false)
        }}>Your posts</p>
      </div>
      </div>
      {toLoadYours && <ForYouActivities/>}
      {toLoadALL && <OthersActivities/>}
      </div>

     <div className="text-2xl fixed right-5 bottom-5 z-20 p-4 bg-dGreen rounded-full text-white md:hidden" onClick={() => setMakePostMobile(true)}><AiOutlinePlus/></div>

     {makePostMobile && <div className="md:hidden fixed z-40 h-screen top-0 bottom-0 right-0 left-0 bg-white">
      <MakeAPost />
     </div>}

    <div>
    </div>
    </React.Fragment>
   
  )
}

export default Activities
