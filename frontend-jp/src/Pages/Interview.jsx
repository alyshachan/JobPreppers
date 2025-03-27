import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";

import SectionHeader from "../Components/Profile/SectionHeader";
import Calendar from "../Components/Interview/Calendar";
import AddEventDialog from "../Components/Interview/AddEventDialog";
import UpcomingEvents from "../Components/Interview/UpcomingEvents";
import InterviewerCard from "../Components/Interview/InterviewerCard";
import "../Components/JobPreppers.css";
const apiURL = process.env.REACT_APP_JP_API_URL;
function Interview() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openEventDialog, setOpenEventDialog] = useState(false);

  useEffect(() => {
    const requestEvents = async () => {
      try {
        const response = await fetch(
          apiURL + `/api/Event/GetEventsByUserID/${user.userID}`,
          {
            credentials: "include", // include cookies
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data) {
            const newEvents = data.map((event) => ({
              name: event.eventName,
              date: event.eventDate == null ? null : new Date(event.eventDate),
              start_time: event.eventStartTime
                ? event.eventStartTime.split(":").slice(0, 2).join(":")
                : null,
              end_time: event.eventEndTime
                ? event.eventEndTime.split(":").slice(0, 2).join(":")
                : null,
              host: event.hostID,
              participants: event.participantID,
              description: event.eventDetails,
              link: event.eventLink,
            }));

            setEvents((prevState) => {
              if (JSON.stringify(prevState) !== JSON.stringify(newEvents)) {
                return newEvents;
              }
              return prevState;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    requestEvents();
  }, [user]);

  const handleOpenEventDialog = () => {
    setOpenEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  };

  const handleEventSubmit = (newEvent) => {
    setEvents([...events, newEvent]);
    setOpenEventDialog(false);
  };

  return (
    <>
      <div className="content !flex-column">
        <div className="panel items-center">
          <Calendar
            onOpenEventDialog={handleOpenEventDialog}
            onEventSubmit={handleEventSubmit}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        {openEventDialog && (
          <AddEventDialog
            open={openEventDialog}
            onClose={handleCloseEventDialog}
            selectedDate={selectedDate}
            onCreateEvent={handleEventSubmit}
          />
        )}

        <div className="panel">
          <SectionHeader header="Upcoming Events" />
          <div className="overflow-x-auto">
            {events.length > 0 ? (
              <UpcomingEvents events={events} />
            ) : (
              <h2 className="text-[#4BA173] text-center">
                No upcoming events yet
              </h2>
            )}
          </div>
        </div>

        <div className="panelTransparent !p-0">
          <h1 className="items-start">Schedule Mock Interview</h1>
          <div className="flex flex-row overflow-x-auto pl-[50px] gap-x-[50px]">
            <InterviewerCard
              name="Justin Ellis"
              title="Recruiter @ T.D. Williamson"
              rating="3.9"
            />
            <InterviewerCard
              name="Jim De St. Germain"
              title="Prof at Utah"
              rating="4.2"
            />
            <InterviewerCard
              name="David Bean"
              title="Startup CTO, Industrial Adjunct Professor"
              rating="5.0"
            />
            <InterviewerCard
              name="Trang Tran"
              title="CS Student at University of Utah"
              rating="4.3"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Interview;
