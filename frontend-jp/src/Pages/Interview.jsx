import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/authProvider";

import SectionHeader from "../Components/Profile/SectionHeader";
import Calendar from "../Components/Interview/Calendar";
import AddEventDialog from "../Components/Interview/AddEventDialog";
import UpcomingEvents from "../Components/Interview/UpcomingEvents";
import InterviewerCard from "../Components/Interview/InterviewerCard";
import moment from "moment";
const apiURL = process.env.REACT_APP_JP_API_URL;
import "../Components/JobPreppers.css";

function Interview() {
  const { user, setAuthData } = useAuth(); // custom hook for authprovider
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openEventDialog, setOpenEventDialog] = useState(false);

  const requestEvents = async () => {
    try {
      const response = await fetch(
        apiURL + `/api/Event/GetEventsByUserID/${user.userID}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        const newEvents = data.map((event) => ({
          name: event.eventName,
          date: event.eventDate ? new Date(event.eventDate) : null,
          start_time: event.eventStartTime?.split(":").slice(0, 2).join(":"),
          end_time: event.eventEndTime?.split(":").slice(0, 2).join(":"),
          host: event.hostID,
          participants: event.participantID,
          description: event.eventDetails,
          link: event.eventLink,
        }));
        setEvents((prevState) =>
          JSON.stringify(prevState) !== JSON.stringify(newEvents)
            ? newEvents
            : prevState
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestEvents();
  }, [user]);

  const handleOpenEventDialog = () => {
    setOpenEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
  };

  const handleEventSubmit = async (newEvent) => {
    const formatTimeWithSeconds = (time) => {
      return time && time.length === 5 ? `${time}:00` : null; // Add ":00" if only HH:mm is given
    };

    const eventPayload = {
        name: newEvent.name,
        date: moment(newEvent.date).format("YYYY-MM-DD"),
        startTime: formatTimeWithSeconds(newEvent.start),
        endTime: formatTimeWithSeconds(newEvent.end),
        host: user.userID,
        participants: newEvent.participants,
        details: newEvent.details,
        link: "test",
    };

    try {
      const response = await fetch(
        apiURL + `/api/Event/CreateEvent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(eventPayload),
        }
      );

      if (response.ok) {
        await response.json();
        requestEvents();
        setOpenEventDialog(false);
      } else {
        const errorMsg = await response.text();
        console.error("Failed to create event:", errorMsg);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
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