import React, { useContext } from "react";
import { ChatContext } from "../context/chat/ChatContext";
import { fetchWithToken } from "../helpers/fetch";
import { scrollToBottom } from "../helpers/scrollToBottom";
import { types } from "../types/types";
import logo from "../../public/singleUser.png";

export const SidebarChatItem = ({ user }) => {
  const { chatState, dispatch } = useContext(ChatContext);
  const { activeChat } = chatState;

  const onClick = async () => {
    dispatch({
      type: types.activateChat,
      payload: user.uid,
    });

    const resp = await fetchWithToken(`messages/${user.uid}`);

    dispatch({
      type: types.loadMessages,
      payload: resp.messages,
    });
    scrollToBottom("message");
  };

  return (
    <div
      className={`chat_list ${user.uid === activeChat && "active_chat"}`}
      onClick={onClick}
      id="sidebarItem"
    >
      <div className="chat_people">
        <div className="chat_img">
          <img
            src={logo}
            alt="Default Avatar Svg Png Icon Free Download 264157 User - Avatar Icon Png Clipart@pikpng.com"
          />
        </div>
        <div className="chat_ib">
          <h5>{user.name}</h5>
          {user.online ? (
            <span className="text-success">Online</span>
          ) : (
            <span className="text-danger">Offline</span>
          )}
        </div>
      </div>
    </div>
  );
};
