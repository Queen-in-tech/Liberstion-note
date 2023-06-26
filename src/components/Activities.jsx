import ForYouActivities from "./ForYouActivities"
import MakeAPost from "./MakeAPost"
import React, { useEffect, useState } from "react"
import OthersActivities from "./OthersActivities"

const Activities = () => {
  const [toLoadALL, setToLoadAll] = useState(false)
  const [toLoadYours, setToLoadYours] = useState(false)

  const allPostStyle = toLoadALL && "border-b-4 border-b-dGreen"
  const yourPostStyle = toLoadYours && "border-b-4 border-b-dGreen"

  useEffect(() => {
    setToLoadAll(true)
  }, [])

  return (
    <React.Fragment >
      <div className="w-[84vw] md:w-[60%] relative">
      <MakeAPost/>
      <p className="pt-7 text-2xl text-dBlue font-bold text-center md:hidden">Liberation Notes</p>
      <div className='border-b-[0.2px] border-dGreen mt-5 px-3 md:pt-3 mx-3.5 mr-1 text-gray-500 sticky bg-gray-100 z-40 top-0 md:top-20'>
      <div className="flex justify-around">
        <p className={`hover:bg-gray-200 rounded-t-xl py-3 px-3 md:px-24 ${allPostStyle} cursor-pointer`}
        onClick={() => { 
          setToLoadYours(false)
          setToLoadAll(true)
        }}>All Posts</p>
        <p className={`hover:bg-gray-200 rounded-t-xl py-3 px-3 md:px-24 ${yourPostStyle} cursor-pointer`}
        onClick={() => { 
          setToLoadYours(true)
          setToLoadAll(false)
        }}>Your posts</p>
      </div>
      </div>
      {toLoadYours && <ForYouActivities/>}
      {toLoadALL && <OthersActivities/>}
      </div>
    <div>
     
    </div>
    </React.Fragment>
   
  )
}

export default Activities
