import Activities from "./Activities";
import DairyLeft from "../components/DairyLeft"

import React from "react";

const DairyBody = () => {
  return (
    <div className='w-full'>
         <div className="flex md:gap-5 w-full relative">
          <React.Fragment>
          <Activities/>
          </React.Fragment>
          <div>
          <DairyLeft/>
          </div>
         </div>
    </div>
  )
}

export default DairyBody
