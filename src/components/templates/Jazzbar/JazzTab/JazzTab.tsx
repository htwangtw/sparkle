import React, { useContext, useState, useEffect } from "react";
import { UserInfo } from "firebase";
import { useForm } from "react-hook-form";
import "./JazzTab.scss";
import "./TableHeader.scss";
import TablesUserList from "components/molecules/TablesUserList";
import TableComponent from "components/molecules/TableComponent";
import UserList from "components/molecules/UserList";
import Room from "components/organisms/Room";
import { User } from "types/User";
import { JAZZBAR_TABLES } from "./constants";
import {
  ExperienceContext,
  Reactions,
  EmojiReactionType,
  TextReactionType,
} from "components/context/ExperienceContext";
import CallOutMessageForm from "components/molecules/CallOutMessageForm/CallOutMessageForm";
import TableHeader from "components/molecules/TableHeader";
import { useFirestoreConnect } from "react-redux-firebase";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import ChatDrawer from "components/organisms/ChatDrawer";

interface PropsType {
  setUserList: (value: User[]) => void;
}

interface ChatOutDataType {
  messageToTheBand: string;
}

type ReactionType =
  | { reaction: EmojiReactionType }
  | { reaction: TextReactionType; text: string };

const Jazz: React.FunctionComponent<PropsType> = ({ setUserList }) => {
  const { user } = useUser();
  const { venue, users } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
    users: state.firestore.ordered.partygoers,
  }));

  useFirestoreConnect([
    {
      collection: "experiences",
      doc: venue.name,
      subcollections: [{ collection: "reactions" }],
      storeAs: "reactions",
      orderBy: ["created_at", "desc"],
    },
  ]);

  // const [isVideoFocused, setIsVideoFocused] = useState(false);
  const experienceContext = useContext(ExperienceContext);

  const [seatedAtTable, setSeatedAtTable] = useState("");
  const [participantCount, setParticipantCount] = useState(0);

  function createReaction(reaction: ReactionType, user: UserInfo) {
    return {
      created_at: new Date().getTime(),
      created_by: user.uid,
      ...reaction,
    };
  }

  const reactionClicked = (user: UserInfo, reaction: EmojiReactionType) => {
    experienceContext &&
      experienceContext.addReaction(createReaction({ reaction }, user));
    setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
  };

  const [isMessageToTheBandSent, setIsMessageToTheBandSent] = useState(false);

  useEffect(() => {
    if (isMessageToTheBandSent) {
      setTimeout(() => {
        setIsMessageToTheBandSent(false);
      }, 2000);
    }
  }, [isMessageToTheBandSent, setIsMessageToTheBandSent]);

  const {
    register: registerBandMessage,
    handleSubmit: handleBandMessageSubmit,
    reset,
  } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  const onBandMessageSubmit = async (data: ChatOutDataType) => {
    setIsMessageToTheBandSent(true);
    experienceContext &&
      user &&
      experienceContext.addReaction(
        createReaction(
          { reaction: "messageToTheBand", text: data.messageToTheBand },
          user
        )
      );
    reset();
  };

  // Capacity is an even number so the grid works
  // Add one to account for the video
  const participantWindows = participantCount + 1;
  const capacity =
    participantCount > 0
      ? participantWindows + (participantWindows % 2)
      : undefined;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 3,
          flexBasis: 0,
        }}
        className={`scrollable-area ${seatedAtTable && "at-table"}`}
      >
        <div className="container-in-row">
          <div className="video-wrapper">
            {seatedAtTable && (
              <TableHeader
                seatedAtTable={seatedAtTable}
                setSeatedAtTable={setSeatedAtTable}
                venueName={venue.name}
              />
            )}
            <div
              className={`${
                seatedAtTable ? "participants-container" : "jazz-video"
              }`}
            >
              <div
                className={`${
                  seatedAtTable
                    ? `participant-container-${capacity} video-participant`
                    : "full-height-video"
                }`}
              >
                <div
                  className="iframe-container"
                  style={{
                    height: seatedAtTable ? "calc(100% - 55px)" : "500px",
                  }}
                >
                  <iframe
                    key="main-event"
                    title="main event"
                    className="youtube-video"
                    src={`${venue.iframeUrl}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                  />
                </div>
                <div className="call-out-band-container">
                  <div className="emoji-container">
                    {Reactions.map((reaction) => (
                      <button
                        key={reaction.name}
                        className="reaction"
                        onClick={() =>
                          user && reactionClicked(user, reaction.type)
                        }
                        id={`send-reaction-${reaction.type}`}
                      >
                        <span role="img" aria-label={reaction.ariaLabel}>
                          {reaction.text}
                        </span>
                      </button>
                    ))}
                  </div>
                  <CallOutMessageForm
                    onSubmit={handleBandMessageSubmit(onBandMessageSubmit)}
                    ref={registerBandMessage({ required: true })}
                    isMessageToTheBandSent={isMessageToTheBandSent}
                    placeholder="Shout out to the band"
                  />
                </div>
              </div>
              {seatedAtTable && (
                <Room
                  roomName={seatedAtTable}
                  setUserList={setUserList}
                  setParticipantCount={setParticipantCount}
                />
              )}
            </div>
          </div>
        </div>
        <UserList users={users} activity={"in the bar"} disableSeeAll={false} />
        <div
          style={{
            border: "0px solid white",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            flex: "0 0 auto",
          }}
          className="seated-area"
        >
          <TablesUserList
            setSeatedAtTable={setSeatedAtTable}
            seatedAtTable={seatedAtTable}
            venueName={venue.name}
            TableComponent={TableComponent}
            joinMessage={true}
            customTables={JAZZBAR_TABLES}
          />
        </div>
      </div>
      <ChatDrawer
        roomName={venue.name}
        chatInputPlaceholder="Chat to the bar"
      />
    </>
  );
};

export default Jazz;
