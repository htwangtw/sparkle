import React, { useMemo } from "react";
import classNames from "classnames";

import "./UserAvatar.scss";

import { DEFAULT_PROFILE_IMAGE } from "settings";

export interface UserAvatarProps {
  isOnline?: boolean;
  onClick?: () => void;
  avatarSrc?: string;
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const UserAvatar: React.FC<UserAvatarProps> = ({
  onClick,
  avatarSrc,
  isOnline,
}) => {
  const containerStyles = classNames("user-avatar", {
    "user-avatar--clickable": onClick !== undefined,
  });

  const userToShow = useMemo(() => {
    if (avatarSrc === undefined) {
      return DEFAULT_PROFILE_IMAGE;
    }
    return avatarSrc;
  }, [avatarSrc]);

  return (
    <div className={containerStyles}>
      <div
        onClick={onClick}
        className="user-avatar__image"
        style={{
          backgroundImage: `url(${userToShow})`,
        }}
      />
      {isOnline && <span className="user-avatar__status-dot" />}
    </div>
  );
};
