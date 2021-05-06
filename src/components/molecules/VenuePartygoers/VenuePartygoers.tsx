import React, { useMemo } from "react";

import { useRecentWorldUsers } from "hooks/users";
// import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";
// import { useVenueId } from "hooks/useVenueId";

import "./VenuePartygoers.scss";
import { AnyVenue } from "types/venues";
import { WithId } from "utils/id";

export const VenuePartygoers = () => {
  // const venueId = useVenueId();
  // const {
  //   parentVenue,
  //   currentVenue,
  //   isCurrentVenueLoaded,
  // } = useConnectRelatedVenues({ venueId });

  const parentVenue = {} as WithId<AnyVenue>;
  const currentVenue = {} as WithId<AnyVenue>;
  const isCurrentVenueLoaded = true;

  const { recentWorldUsers, isRecentWorldUsersLoaded } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const title = useMemo<string>(() => {
    if (!isCurrentVenueLoaded || !isRecentWorldUsersLoaded) return "";

    const attendeesTitle =
      parentVenue?.attendeesTitle ??
      currentVenue?.attendeesTitle ??
      "attendees";

    return `${numberOfRecentWorldUsers} ${attendeesTitle} online`;
  }, [
    isCurrentVenueLoaded,
    parentVenue,
    currentVenue,
    numberOfRecentWorldUsers,
    isRecentWorldUsersLoaded,
  ]);

  return <div className="venue-partygoers-container">{title}</div>;
};
