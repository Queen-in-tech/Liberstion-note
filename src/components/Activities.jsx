import ForYouActivities from "./ForYouActivities"
import MakeAPost from "./MakeAPost"
import React, { useEffect, useState } from "react"
import OthersActivities from "./OthersActivities"

const Activities = () => {
  const [toLoadALL, setToLoadAll] = useState(false)
  const [toLoadYours, setToLoadYours] = useState(false)
  const [active, setActive] = useState(false)

  const allPostStyle = toLoadALL && "border-b-4 border-b-dGreen"
  const yourPostStyle = toLoadYours && "border-b-4 border-b-dGreen"

  useEffect(() => {
    setToLoadAll(true)
  }, [])

  return (
    <React.Fragment >
      <div className="w-[60%]">
      <MakeAPost/>
      <div className='border-b-[0.2px] border-dGreen mt-5 px-3 pt-3 mx-5 text-gray-500'>
      <div className="flex justify-around">
        <p className={`hover:bg-gray-200 rounded-t-xl py-3 px-24 ${allPostStyle}`}
        onClick={() => { 
          setToLoadYours(false)
          setToLoadAll(true)
        }}>All Posts</p>
        <p className={`hover:bg-gray-200 rounded-t-xl py-3 px-24 ${yourPostStyle}`}
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
