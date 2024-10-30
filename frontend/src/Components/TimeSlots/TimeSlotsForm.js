import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { saveTimeSlots } from "../../Services/API/DoctorAPI";
import HeaderSwitcher from "../Header/HeadSwitcher";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

function TimeSlotForm() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [openSlots, setOpenSlots] = useState({});
  const [savedSlots, setSavedSlots] = useState([]);
  const [showSavedSlots, setShowSavedSlots] = useState(false);
  const navigate = useNavigate();

  const resetTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const handleDateChange = (date) => {
    const today = resetTime(new Date());

    if (resetTime(date) < today) {
      toast.error("Cannot select past dates.");
      return;
    }

    const alreadySelected = selectedDates.some(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );
    if (alreadySelected) {
      setSelectedDates(
        selectedDates.filter((d) => d.getTime() !== date.getTime())
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const toggleSlotChooser = (date) => {
    const dateString = date.toDateString();
    setOpenSlots((prevOpenSlots) => ({
      ...prevOpenSlots,
      [dateString]: !prevOpenSlots[dateString],
    }));
  };


  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setStartTime(startTime);
    const startDateTime = new Date(`1970-01-01T${startTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const hours = endDateTime.getHours().toString().padStart(2, '0');
    const minutes = endDateTime.getMinutes().toString().padStart(2, '0');
    setEndTime(`${hours}:${minutes}`);
  }

  
  const addTimeSlot = (e, date) => {
    e.preventDefault();
    const dateString = date.toDateString();
    const slot = { start: startTime, end: endTime };

    if (!startTime || !endTime) {
      toast.error("Please select both start time and end time.");
      return;
    }
    if (startTime >= endTime) {
      toast.error("Start time must be earlier than the end time.");
      return;
    }

    const currentDateTime = new Date();
    const selectedStartDateTime = new Date(`${dateString} ${startTime}`);
    const selectedEndDateTime = new Date(`${dateString} ${endTime}`);

    if (
      selectedStartDateTime < currentDateTime ||
      selectedEndDateTime < currentDateTime
    ) {
      toast.error("Cannot select time slots in the past.");
      return;
    }

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    //time diff 1hr
    const timeDiff = (end - start) / (1000 * 60 * 60);
    if (timeDiff !== 1) {
      toast.error("Time slot duration must be exactly 1 hour.");
      return;
    }

    const existingSlots = timeSlots[dateString] || [];

    // Check for overlapping slots
    const isOverlapping = existingSlots.some((existingSlot) => {
      const existingStart = new Date(`1970-01-01T${existingSlot.start}:00`);
      const existingEnd = new Date(`1970-01-01T${existingSlot.end}:00`);

      // Check for any overlap conditions
      return start < existingEnd && end > existingStart;
    });

    if (isOverlapping) {
      toast.error("This time slot overlaps with an existing slot.");
      return;
    }

    //duplicates checking
    const isDuplicate = existingSlots.some(
      (existingSlot) =>
        existingSlot.start === startTime && existingSlot.end === endTime
    );

    if (isDuplicate) {
      toast.error("This time slot already exists for the selected date.");
      return;
    }

    setTimeSlots((prevTimeSlots) => ({
      ...prevTimeSlots,
      [dateString]: prevTimeSlots[dateString]
        ? [...prevTimeSlots[dateString], slot]
        : [slot],
    }));

    setStartTime("");
    setEndTime("");
  };

  const removeSlot = (dateString, slotIndex) => {
    setTimeSlots((prevTimeSlots) => {
      const updatedSlots = [...prevTimeSlots[dateString]];
      updatedSlots.splice(slotIndex, 1);
      return {
        ...prevTimeSlots,
        [dateString]: updatedSlots,
      };
    });
  };

  const removeSavedSlot = (dateString, slotIndex) => {
    setSavedSlots((prevSavedSlots) => {
      return prevSavedSlots
        .map((slotData) => {
          if (slotData.date === dateString) {
            const updatedSlots = [...slotData.slots];
            updatedSlots.splice(slotIndex, 1);
            return { ...slotData, slots: updatedSlots };
          }
          return slotData;
        })
        .filter((slotData) => slotData.slots.length > 0);
    });
  };

  const handleSaveSlots = () => {
    const slotsArray = Object.entries(timeSlots).map(([date, slots]) => ({
      date,
      slots,
    }));
    if (slotsArray.length === 0) {
      toast.error("Select some time slots");
      return;
    }
    setSavedSlots(slotsArray);
    setShowSavedSlots(true);
  };

  const handleSave = async () => {
    const slotsArray = Object.entries(timeSlots).map(([date, slots]) => ({
      date,
      slots,
    }));
    try {
      const result = await saveTimeSlots(slotsArray);
      if (result.success) {
        toast.success("Time slots saved successfully");
        navigate("/planner");
      } else {
        toast.error("Failed to save time slots");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <HeaderSwitcher />
      <div className="flex flex-col md:flex-row justify-center justify-around mt-20 mb-10">
        {/* Left Section: Time Slot Selector */}
        <div className="flex flex-col items-center p-8 border shadow bg-[#DDD0C8]">
          <h2 className="text-2xl font-bold mb-7 text-center text-gray-800">
            Generate Time Slots for Multiple Dates
          </h2>

          <form>
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              highlightDates={selectedDates}
              inline
              shouldCloseOnSelect={false}
            />

            <div className="mt-4 text-center">
              <p className="text-xl font-bold">Selected Dates:</p>
              <ul>
                {selectedDates.map((date, index) => {
                  const dateString = date.toDateString();
                  return (
                    <li key={index}>
                      <div>
                        <strong>{dateString}</strong>
                        <button
                          className="ml-2 text-blue-500"
                          type="button"
                          onClick={() => toggleSlotChooser(date)}
                        >
                          {openSlots[dateString] ? "Close" : "Add Slots"}
                        </button>
                      </div>

                      {openSlots[dateString] && (
                        <div className="mt-2 flex flex-col">
                          <label className="mb-1">Start Time:</label>
                          <input
                            type="time"
                            value={startTime}
                            //onChange={(e) => setStartTime(e.target.value)}
                            onChange={handleStartTimeChange}
                            className="border border-gray-300 px-2 py-1 rounded"
                          />

                          <label className="mt-2 mb-1">End Time:</label>
                          <input
                            type="time"
                            value={endTime}
                           // onChange={(e) => setEndTime(e.target.value)}
                           readOnly
                            className="border border-gray-300 px-2 py-1 rounded"
                          />

                          <button
                            className="mt-4 bg-[#323232] text-white px-4 py-2 rounded"
                            onClick={(e) => addTimeSlot(e, date)}
                          >
                            Add Time Slot
                          </button>
                        </div>
                      )}

                      {timeSlots[dateString] && (
                        <ul className="mt-2">
                          {timeSlots[dateString].map((slot, idx) => (
                            <li key={idx} className="flex items-center">
                              <span>
                                {slot.start} - {slot.end}
                              </span>
                              <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => removeSlot(dateString, idx)}
                              >
                                ✖
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handleSaveSlots}
                className="bg-[#323232] text-white px-4 py-2 rounded"
              >
                Save Time Slots
              </button>
            </div>
          </form>
        </div>

        {/* Right Section: Saved Time Slots */}
        <div
          className="flex flex-col md:w-1/2 p-8 mb-10 border bg-[#DDD0C8] shadow"
          style={{ height: "400px", overflowY: "auto" }}
        >
          <h2 className="text-2xl font-bold mb-7 text-center text-gray-800">
            Saved Time Slots
          </h2>

          {savedSlots.length === 0 ? (
            <p className="text-center text-[#323232]-500 text-xl">
              No slots selected.
            </p>
          ) : (
            savedSlots.map((slotData, dateIndex) => (
              <div key={dateIndex} className="mb-4">
                <h3 className="text-lg font-bold">{slotData.date}</h3>
                <ul>
                  {slotData.slots.map((slot, slotIndex) => (
                    <li
                      key={slotIndex}
                      className="mt-2 flex justify-between items-center"
                    >
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() =>
                          removeSavedSlot(slotData.date, slotIndex)
                        }
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          {savedSlots.length > 0 && (
            <button
              className="bg-[#323232] text-white px-4 py-2 rounded mt-4"
              onClick={handleSave}
            >
              Final Save
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TimeSlotForm;
