import { types } from "../../types/types";

export const chatReducer = (state, action) => {
  //console.log(action); // ! coglione non funzionava perchè hai messo types con la -s nel dispatch di SidebarChatItem!!!

  switch (action.type) {
    case types.closeSession: {
      return {
        uid: "",
        activeChat: null,
        users: [],
        messages: [],
        rooms: [...state.rooms],
      };
    }

    case types.uploadedUsers:
      return {
        ...state,
        users: [...action.payload],
      };

    case types.activateChat:
      if (state.activeChat === action.payload) return state;
      return {
        ...state,
        activeChat: action.payload,
        messages: [],
      };

    case types.newMessage:
      if (
        state.activeChat === action.payload.from ||
        state.activeChat === action.payload.to
      ) {
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      } else {
        return state;
      }

    case types.roomMessage:
      if (
        // state.activeChat === action.payload.from
        state.activeChat === action.payload.to
      ) {
        return {
          ...state,
          messages: [...state.messages, action.payload],
        };
      } else {
        return state;
      }

    case types.loadMessages:
      return {
        ...state,
        messages: [...action.payload],
      };

    case types.roomCreated:
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };

    case types.existingRooms:
      return {
        ...state,
        rooms: [...action.payload],
      };

    default:
      return state;
  }
};
