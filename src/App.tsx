import { useState } from 'react'
import './App.css'
import Calendar from './components/Calendar'

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

function App() {
  const [calendarType, setCalendarType] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(8)
  const [selectedYear, setSelectedYear] = useState(2025)

  return (
    <div className='flex flex-col'>
      <div>
        <button className='border px-10 py-2 rounded-full'>Today</button>
        {/* <h2 className="text-xl">{MONTHS[selectedMonth]} {selectedYear}</h2> */}
      </div>
      <div>
        <Calendar calendarType={calendarType} selectedMonth={selectedMonth} selectedYear={selectedYear}/>
      </div>
    </div>
  )
}

export default App
