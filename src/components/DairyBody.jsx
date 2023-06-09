import BodyHeader from "./BodyHeader";
import Activities from "./Activities";
import OthersActivities from "./OthersActivities";
import React from "react";

const DairyBody = () => {
  return (
    <div className='w-full'>
         <BodyHeader/>
         <div className="flex justify-between w-full">
          <React.Fragment>
          <Activities/>
          </React.Fragment>
          <div></div>
         </div>
    </div>
  )
}

export default DairyBody
