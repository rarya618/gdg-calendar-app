import { MONTHS } from "../App"
import type { CalendarEvent, SubCalendarProps } from "./Calendar"

interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
}

function generateMonthMatrix(year: number, month: number, events: CalendarEvent[]): CalendarDay[][] {
  const firstDay = new Date(year, month - 1, 1);
  console.log(firstDay)
  const lastDay = new Date(year, month, 0);
  const matrix: CalendarDay[][] = [];
  let week: CalendarDay[] = [];

  // Start from Sunday of the first week
  let current = new Date(firstDay);
  let dayOfWeek = (current.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  current.setDate(current.getDate() - dayOfWeek);
  console.log(current)

  while (current <= lastDay || current.getDay() !== 0) {
    const dayEvents = events.filter(
      (e) =>
        e.start.getFullYear() === current.getFullYear() &&
        e.start.getMonth() === current.getMonth() &&
        e.start.getDate() === current.getDate()
    );

    week.push({ date: new Date(current), events: dayEvents });

    if ((current.getDay() + 6) % 7 === 6) {
      matrix.push(week);
      week = [];
    }

    current.setDate(current.getDate() + 1);
  }

  if (week.length) matrix.push(week);
  return matrix;
}


function MonthlyCalendar(props : SubCalendarProps) {
  const today = new Date();
  const monthMatrix: CalendarDay[][] = generateMonthMatrix(props.selectedYear, props.selectedMonth, props.events);

  // return (
  //   <div className="border grid grid-rows-6">
  //     <div className='border grid grid-cols-7'>
  //       <div>Mon</div>
  //       <div>Tue</div>
  //       <div>Wed</div>
  //       <div>Thu</div>
  //       <div>Fri</div>
  //       <div>Sat</div>
  //       <div>Sun</div>
  //     </div>
  //     <div className='border grid grid-cols-7'>
  //       <div>28</div>
  //       <div>29</div>
  //       <div>30</div>
  //       <div>31</div>
  //       <div>1</div>
  //       <div>2</div>
  //       <div>3</div>
  //     </div>
  //     <div className='border grid grid-cols-7'>
  //       <div>4</div>
  //       <div>5</div>
  //       <div>6</div>
  //       <div>7</div>
  //       <div>8</div>
  //       <div>9</div>
  //       <div>10</div>
  //     </div>
  //     <div className='border grid grid-cols-7'>
  //       <div>11</div>
  //       <div>12</div>
  //       <div>13</div>
  //       <div>14</div>
  //       <div>15</div>
  //       <div>16</div>
  //       <div>17</div>
  //     </div>
  //     <div className='border grid grid-cols-7'>
  //       <div>18</div>
  //       <div>19</div>
  //       <div>20</div>
  //       <div>21</div>
  //       <div>22</div>
  //       <div>23</div>
  //       <div>24</div>
  //     </div>
  //     <div className='border grid grid-cols-7'>
  //       <div>25</div>
  //       <div>26</div>
  //       <div>27</div>
  //       <div>28</div>
  //       <div>29</div>
  //       <div>30</div>
  //       <div>31</div>
  //     </div>
  //   </div> 
  // )
  return (
    // <div>
    //   <h2 className="text-xl">{MONTHS[props.selectedMonth]} {props.selectedYear}</h2>
    //   <div className="mt-4 grid grid-cols-3 gap-5">
    //     {props.events.map((event) => (<>
    //       {((event.start.getMonth() + 1 == props.selectedMonth) && event.start.getFullYear() == props.selectedYear) ? (
    //         <div className="px-6 py-5 border rounded-md text-left" key={event.id}>
    //           <h2 className="font-bold text-lg">{event.summary}</h2>
    //           <p>Start: {event.start.toDateString()}</p>
    //           <p>End: {event.end.toDateString()}</p>
    //         </div>
    //       ): null}
    //     </>))}
    //   </div>
    // </div>
    <div>
      <div>
        {/* <button onClick={prevMonth}>{"<"}</button> */}
        <h2>{MONTHS[props.selectedMonth]} {props.selectedYear}</h2>
        {/* <button onClick={nextMonth}>{">"}</button> */}
      </div>

      <div className="grid">
        <div className="grid grid-cols-7">
          {["Mon","Tue","Wed","Thu","Fri","Sat", "Sun"].map(d => <div key={d}>{d}</div>)}
        </div>
        {monthMatrix.map((week, i) => (
          <div key={i} className="grid grid-cols-7">
            {week.map((day) => (
              <div
                key={day.date.toDateString()}
              >
                <div className="text-right">
                  {day.date.getDate()}
                </div>
                <div>
                  {day.events.map(ev => <div key={ev.id}>{ev.summary}</div>)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyCalendar