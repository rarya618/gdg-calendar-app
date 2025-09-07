import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, List } from "lucide-react";

import './App.css'
import logo from './assets/logo.png'
import CalendarPage from './components/CalendarPage'


export const MONTHS: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
}

export const buttonStyle = "border border-gdgBlue cursor-pointer rounded-md bg-gdgBlue text-white dark:text-neutral-900 hover:opacity-90"

export function Toggle(
  {
    calendarType, 
    setCalendarType
  }: {
    calendarType: string, 
    setCalendarType: React.Dispatch<React.SetStateAction<string>>
  }) {
  const toggleItems = [
    {id: "calendar", label: "Calendar", icon: Calendar},
    {id: "schedule", label: "Schedule", icon: List},
  ]
  return (
    <div className='flex border border-gdgBlue rounded-full overflow-hidden'>
      {toggleItems.map((item) => {
        return <div 
          id={item.id} 
          className={`flex gap-2 px-4 py-1.5 rounded-none h-full cursor-pointer ${calendarType == item.id ? "bg-gdgBlue text-white dark:text-neutral-900" : "text-gdgBlue"}`}
          onClick={() => setCalendarType(item.id)}>
        <div className='my-auto'>
          <item.icon size={16} className="flex-shrink-0 align-middle" />
        </div>
        <label className="text-xs select-none cursor-pointer align-middle my-auto hidden md:inline">{item.label}</label>
      </div>
      })}
    </div>
  )
}

function App() {
  const [calendarType, setCalendarType] = useState('calendar')
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(2025)

  const prevMonth = () => {
    if (selectedMonth > 1) {
      setSelectedMonth(selectedMonth - 1)
    } else {
      setSelectedMonth(12)
      setSelectedYear(selectedYear - 1)
    }
  }

  const nextMonth = () => {
    if (selectedMonth < 12) {
      setSelectedMonth(selectedMonth + 1)
    } else {
      setSelectedMonth(1)
      setSelectedYear(selectedYear + 1)
    }
  }

  const backToToday = () => {
    let today = new Date()
    setSelectedMonth(today.getMonth() + 1)
    setSelectedYear(today.getFullYear())
  }

  const controlsStyle = "border border-gdgBlue rounded-md flex"

  return (
    <div className={`flex flex-col w-screen ${calendarType == "calendar" ? "h-screen" : ""} px-2 pt-0 pb-2 select-none`}>
      {/* hidden div just to register colors */}
      <div className='bg-gdgBlue bg-gdgRed bg-gdgYellow bg-gdgGreen color-gdgBlue color-gdgRed color-gdgYellow color-gdgGreen border border-gdgBlue border-gdgRed border-gdgYellow border-gdgGreen hidden'></div>

      {/* Header controls */}
      <div className='flex justify-between w-full sticky top-0 py-2 bg-white dark:bg-neutral-900'>
        <div className='flex gap-3'>
          <button onClick={backToToday} className={`${buttonStyle} text-xs px-7 py-0`}>Today</button>

          <div className='flex gap-2'>
            <div className={`${controlsStyle} w-32 justify-between`}>
              <button onClick={prevMonth} className='px-2 py-1.5 text-blue-500 cursor-pointer'>
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-xs text-blue-500 align-middle my-auto mx-1">{MONTHS[selectedMonth]}</h2>
              <button onClick={nextMonth} className='px-2 py-1.5 text-blue-500 cursor-pointer'>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className={`${controlsStyle}`}>
              <button onClick={() => setSelectedYear(selectedYear - 1)} className='px-2 py-1 text-blue-500 cursor-pointer'>
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-xs text-blue-500 align-middle my-auto mx-2">{selectedYear}</h2>
              <button onClick={() => setSelectedYear(selectedYear + 1)} className='px-2 py-1.5 text-blue-500 cursor-pointer'>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <Toggle calendarType={calendarType} setCalendarType={setCalendarType}/>
        </div>
        <div className='hidden sm:flex gap-1.5 py-0 px-3 rounded-lg'>
          <img src={logo} className='h-7'/>
          <span className='text-sm my-auto text-neutral-500 hidden lg:inline'>GDG University of Sydney</span>
        </div>
      </div>

      {/* Calendar takes the rest of the space */}
      <div className="flex-1">
        <CalendarPage
          calendarType={calendarType}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  )

}

export default App
