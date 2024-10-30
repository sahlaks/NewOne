import React, { useState } from 'react'
import HeaderSwitcher from '../../../Components/Header/HeadSwitcher'
import Loading from '../../../Components/Loading/Loading'
import TimeSlotForm from '../../../Components/TimeSlots/TimeSlotsForm'
import DoctorHeader from '../../../Components/Header/DoctorHeader'

function PlanningSlots() {
    const [loading,setLoading] = useState(false)

    
  return (
    <div>
        <div className="min-h-screen p-6 flex flex-col">
            <DoctorHeader/>
            {loading ? (
                <Loading/>
            ) : (
                <div className="min-h-screen p-10 flex mt-5">
                    <div >
                        <TimeSlotForm/>
                    </div>
                    <div>
                    
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default PlanningSlots