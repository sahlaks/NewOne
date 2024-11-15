import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RRule } from "rrule";
import { axiosInstanceDoctor } from "../../../Services/AxiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderSwitcher from "../../../Components/Header/HeadSwitcher";
import { useNavigate } from "react-router-dom";

const CreateSlot = () => {
  const [frequency, setFrequency] = useState("WEEKLY");
  const [interval, setInterval] = useState(1);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [count, setCount] = useState(null);
  const [untilDate, setUntilDate] = useState(null);
  const [rules, setRules] = useState([]);
  const [createdSlots, setCreatedSlots] = useState([]);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate()

  
  const dayOptions = [
    { label: "Sunday", value: RRule.SU },
    { label: "Monday", value: RRule.MO },
    { label: "Tuesday", value: RRule.TU },
    { label: "Wednesday", value: RRule.WE },
    { label: "Thursday", value: RRule.TH },
    { label: "Friday", value: RRule.FR },
    { label: "Saturday", value: RRule.SA },
  ];

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addRule = () => {
    const newRule = {
      frequency,
      interval,
      selectedDays,
      startTime,
      endTime,
      count,
      untilDate,
    };
    setRules((prevRules) => [...prevRules, newRule]);
    
    // Reset fields after adding rule
    setFrequency("WEEKLY");
    setInterval(1);
    setSelectedDays([]);
    setStartTime(new Date());
    setEndTime(new Date());
    setCount(null);
    setUntilDate(null);
  };
  
  const isSlotValid = (slot) => {
    const duration = (new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / (1000 * 60 * 60);
    if (duration !== 1) {
      toast.error("Each slot must have a 1-hour duration.");
      return false;
    }
    return true;
  };

  const hasOverlap = (newSlot, existingSlots) => {
    return existingSlots.some((slot) => {
      const newStart = new Date(newSlot.startTime).getTime();
      const newEnd = new Date(newSlot.endTime).getTime();
      const existingStart = new Date(slot.startTime).getTime();
      const existingEnd = new Date(slot.endTime).getTime();
  
      return (newStart < existingEnd && newEnd > existingStart); 
    });
  };

  const handleCreateSlot = async () => {
    const allSlots = [];
    for (const rule of rules) {
      const {
        frequency,
        interval,
        selectedDays,
        startTime,
        endTime,
        count,
        untilDate,
      } = rule;
  
      if (endTime <= startTime) {
        toast.error("End time must be after start time.");
        return;
      }
  
      const ruleOptions = {
        freq: RRule[frequency],
        interval: interval,
        byweekday: selectedDays,
        count: count || undefined,
        until: untilDate ? new Date(untilDate) : undefined,
      };
  
      const ruleInstance = new RRule(ruleOptions);
  
      const parsedData = {
        freq: frequency.toUpperCase(),
        interval,
        days: selectedDays.map((day) =>
          day.toString().substring(0, 2).toUpperCase()
        ),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        count: count || undefined,
        until: untilDate ? new Date(untilDate).toISOString() : undefined,
      };
  
      try {
        const response = await axiosInstanceDoctor.post(
          "/api/doctor/rruleslots",
          parsedData,
          { withCredentials: true }
        );
        const createdOnes = response.data.data
        for (const slot of createdOnes) {
          if (!isSlotValid(slot)) return;
  
          if (hasOverlap(slot, allSlots)) {
            toast.error("Duplicate or overlapping slots are not allowed.");
            return;
          }
          allSlots.push(slot);
        }
      } catch (error) {
        toast.error("Failed to create slots");
      }
    }
  
    setCreatedSlots(allSlots);
    setCreated(true);
    toast.success("Slots created successfully!");
  };
  
  const handleRemoveRule = (index) => {
    setRules((prevRules) => prevRules.filter((_, i) => i !== index));
  };

  
  const handleSaveSlots = async () => {
    const res = await axiosInstanceDoctor.post('/api/doctor/saveslots',createdSlots,{withCredentials:true})
    if(res.data.success)
      toast.success('Slots Saved!!')
      navigate('/planner')
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#FAF5E9",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <HeaderSwitcher />
      <div
        style={{
          border: "2px solid #323232",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#fff",
          marginTop: "15px",
        }}
      >
        <h2
          style={{
            color: "#323232",
            textAlign: "center",
            marginBottom: "20px",
          }}
          className="text-2xl font-bold"
        >
          Create Recurring Slot
        </h2>

      
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            Frequency:
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #323232",
              backgroundColor: "#fff",
              marginTop: "8px",
            }}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            Interval:
          </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              min="1"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value))}
              style={{
                width: "80px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #323232",
                backgroundColor: "#fff",
              }}
            />
            <span style={{ marginLeft: "10px", color: "#323232" }}>
              (Every {interval} {frequency.toLowerCase()})
            </span>
          </div>
        </div>

      
        {frequency === "WEEKLY" && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{ display: "block", color: "#323232", fontWeight: "bold" }}
            >
              Select Days:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {dayOptions.map((day) => (
                <label
                  key={day.value}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.value)}
                    onChange={() => toggleDaySelection(day.value)}
                    style={{ marginRight: "5px" }}
                  />
                  <span style={{ color: "#323232" }}>{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            Start Time:
          </label>
          <DatePicker
            selected={startTime}
            onChange={(time) => setStartTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>

        
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            End Time:
          </label>
          <DatePicker
            selected={endTime}
            onChange={(time) => setEndTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>

        
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            Number of Occurrences (Count):
          </label>
          <input
            type="number"
            min="1"
            value={count || ""}
            onChange={(e) =>
              setCount(e.target.value ? parseInt(e.target.value) : null)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #323232",
              backgroundColor: "#fff",
              marginTop: "8px",
            }}
          />
        </div>

      
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", color: "#323232", fontWeight: "bold" }}
          >
            Until Date:
          </label>
          <DatePicker
            selected={untilDate}
            onChange={(date) => setUntilDate(date)}
            dateFormat="yyyy/MM/dd"
            placeholderText="Select a date"
          />
        </div>

        
        <button
          onClick={addRule}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
          }}
        >
          Add Rule
        </button>

        
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#323232" }}>Rules Added:</h3>
          <ul>
            {rules.map((rule, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              >
                <p>Frequency: {rule.frequency}</p>
                <p>Interval: {rule.interval}</p>
                <p>Days: {rule.selectedDays.join(", ")}</p>
                <p>Start Time: {rule.startTime.toLocaleTimeString()}</p>
                <p>End Time: {rule.endTime.toLocaleTimeString()}</p>
                <p>Count: {rule.count}</p>
                <p>
                  Until Date:{" "}
                  {rule.untilDate ? rule.untilDate.toLocaleDateString() : "N/A"}
                </p>
                <button
                  onClick={() => handleRemoveRule(index)}
                  style={{
                    backgroundColor: "#FF6347",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Remove Rule
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Create Slots */}
        <button
          onClick={handleCreateSlot}
          style={{
            backgroundColor: "#323232",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            width: "100%",
          }}
        >
          Create Slots
        </button>
      </div>

      <div>
  {createdSlots.length > 0 && (
    <div className="mt-10">
      <h3 className="font-[#323232] text-xl font-bold">Created Slots:</h3>
      <ul>
        {createdSlots.map((slot, index) => (
          <li key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '10px', backgroundColor: '#ffffff' }}>
            <p><strong>Day:</strong> {slot.day}</p>
            <p><strong>Start Time:</strong> {new Date(slot.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(slot.endTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSaveSlots}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
          width: '100%',
        }}
      >
        Save Slots
      </button>
    </div>
  )}
</div>
       
    </div>
  );
};

export default CreateSlot;    
