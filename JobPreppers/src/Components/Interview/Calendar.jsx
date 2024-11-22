import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IconButton } from "@mui/material";

import "./Calendar.css";

function Calendar({ onOpenEventDialog, selectedDate, setSelectedDate }) {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthsOfYear = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [visibleMonths, setVisibleMonths] = useState(3); // Default to 3 calendars

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleMonths(1);
      } else if (window.innerWidth < 1024) {
        setVisibleMonths(2);
      } else {
        setVisibleMonths(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  const handleDayClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    onOpenEventDialog();
  };

  const renderCalendar = (offset) => {
    const month = (currentMonth + offset) % 12;
    const year = currentYear + Math.floor((currentMonth + offset) / 12);
    const days = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    return (
      <div className="calendar" key={`${month}-${year}`}>
        <div className="navigateDate">
          <h2 className="month">
            {monthsOfYear[month]} {year}
          </h2>
          <hr className="m-[10px]" />
        </div>

        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="days">
          {[...Array(firstDay).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(days).keys()].map((day) => (
            <span
              key={day + 1}
              className={
                day + 1 === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear()
                  ? "currentDay"
                  : ""
              }
              onClick={() => handleDayClick(day + 1, month, year)}
            >
              {day + 1}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendarNavigationWrapper">
      <div className="navButton">
        <IconButton onClick={prevMonth} className="navButton">
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <div className="calendarWrapper">
        {[...Array(visibleMonths).keys()].map((offset) =>
          renderCalendar(offset)
        )}
      </div>

      <div className="navButton">
        <IconButton onClick={nextMonth} className="navButton">
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Calendar;
