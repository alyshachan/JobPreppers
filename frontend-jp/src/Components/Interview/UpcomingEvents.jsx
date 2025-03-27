import React from "react";
import styles from "./UpcomingEvents.module.css";
import "../JobPreppers.css";

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
  const handleJoinCall = (eventLink) => {
    if (eventLink)
      window.open(`/VideoCall?link=${encodeURIComponent(eventLink)}`, "_blank");
    else alert("No link available for this event");
  };

  return (
    <div className={styles.upcomingEvents}>
      {events.map((event, index) => (
        <div className={styles.event} key={index}>
          <h2 className={styles.eventDate}>
            {`${monthsOfYear[event.date.getMonth()]} ${
              event.date.getDate() + 1
            }, ${event.date.getFullYear()}`}
          </h2>

          <div className={styles.eventTimeText}>
            <div className={styles.eventDateWrapper}>
              <div className={styles.startTime}>{event.start_time}</div>
              <div className={styles.endTime}>{event.end_time}</div>
            </div>

            <div
              className={`${styles.eventText} ${
                index === 0 ? styles.firstEvent : ""
              }`}
            >
              <h2>{event.name}</h2>

              <p className={`${index === 0 ? "text-[#EEEEEE]" : "subtitle"}`}>
                {event.description}
              </p>

              <div className={styles.joinCallButton}>
                <button
                  className={`${index === 0 ? styles.firstJoinCall : ""}`}
                  onClick={() => handleJoinCall(event.link)}
                >
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
