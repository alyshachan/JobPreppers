import React from "react";

import "./UpcomingEvents.css";

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

function UpcomingEvents({ events }) {
  return (
    <div className="upcomingEvents">
      {events.map((event, index) => (
        <div className="event" key={index}>
          <h2 className="eventDate">{`${monthsOfYear[event.date.getMonth()]} ${
            event.date.getDate() + 1
          }, ${event.date.getFullYear()}`}</h2>

          <div className="eventTimeText">
            <div className="eventDateWrapper">
              <div className="startTime">{event.start}</div>
              <div className="endTime">{event.end}</div>
            </div>

            <div className={`eventText ${index === 0 ? "firstEvent" : ""}`}>
              <h2>{event.name}</h2>

              <p
                className={`${
                  index === 0 ? "text-[#EEEEEE]" : "section-element-subtitle "
                }`}
              >
                {event.details}
              </p>

              <div className="joinCallButton">
                <button className={`${index === 0 ? "firstJoinCall" : ""}`}>
                  Join call
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpcomingEvents;
