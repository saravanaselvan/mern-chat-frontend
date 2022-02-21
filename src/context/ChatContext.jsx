import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [typingUserId, setTypingUserId] = useState();
  const [showContactInfo, setShowContactInfo] = useState(false);
  const history = useHistory();
  useEffect(() => {
    setSocket(io());
    if (localStorage.getItem("userInfo")) {
      setUser(JSON.parse(localStorage.getItem("userInfo")));
    } else {
      history.push("/");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        socket,
        chats,
        setChats,
        currentChat,
        setCurrentChat,
        typingUserId,
        setTypingUserId,
        showContactInfo,
        setShowContactInfo,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default Context;

export const ChatState = () => {
  return useContext(ChatContext);
};
