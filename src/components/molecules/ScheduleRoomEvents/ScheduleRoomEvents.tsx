import React, { useMemo } from "react";

import { PersonalizedVenueEvent } from "types/venues";

import { ScheduleEvent } from "components/molecules/ScheduleEvent";

import "./ScheduleRoomEvents.scss";

export interface ScheduleRoomEventsProps {
  events: PersonalizedVenueEvent[];
  scheduleStartHour: number;
  isPersonalizedRoom?: boolean;
}

export const ScheduleRoomEvents: React.FC<ScheduleRoomEventsProps> = ({
  events,
  scheduleStartHour,
  isPersonalizedRoom,
}) => {
  const eventBlocks = useMemo(
    () =>
      events.map((event) => (
        <ScheduleEvent
          key={`event-${event.id}`}
          isPersonalizedEvent={isPersonalizedRoom}
          event={event}
          scheduleStartHour={scheduleStartHour}
        />
      )),
    [events, isPersonalizedRoom, scheduleStartHour]
  );

  return <div className="RoomEvents">{eventBlocks}</div>;
};
