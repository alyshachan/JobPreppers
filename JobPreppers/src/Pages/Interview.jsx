import React, { useState } from "react";

import SectionHeader from "../Components/SectionHeader";
import Calendar from "../Components/Interview/Calendar";
import AddEventDialog from "../Components/Interview/AddEventDialog";
import UpcomingEvents from "../Components/Interview/UpcomingEvents";
import InterviewerCard from "../Components/Interview/InterviewerCard";

function Interview() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openEventDialog, setOpenEventDialog] = useState(false);

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
        <div className="main-panel items-center">
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

        <div className="main-panel">
          <SectionHeader header="Upcoming Events" />
          <div className="overflow-x-auto">
            {events && events.length > 0 ? (
              <UpcomingEvents events={events} />
            ) : (
              <h2 className="text-[#4BA173] text-center">
                No upcoming events yet
              </h2>
            )}
          </div>
        </div>

        <div className="main-panel !bg-transparent !shadow-none !p-0">
          <h1 className="items-start">Schedule Mock Interview</h1>
          <div className="flex flex-row overflow-x-auto pl-[50px] gap-x-[50px]">
            <InterviewerCard
              name="Recruiter Justin"
              title="Recruiter @ T.D. Williamson"
              rating="4.8"
            />
            <InterviewerCard
              name="another Justin"
              title="Recruiter @ T.D. Williamson"
              rating="4.8"
            />
            <InterviewerCard
              name="third Justin"
              title="Recruiter @ T.D. Williamson"
              rating="4.8"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Interview;
