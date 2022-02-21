import { Avatar } from "@chakra-ui/avatar";
import { Divider, HStack, Spacer, VStack } from "@chakra-ui/layout";
import { Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdCheck } from "react-icons/md";
import { ChatState } from "../context/ChatContext";

const ChatInfo = ({ chat }) => {
  const { user, typingUserId, setTypingUserId } = ChatState();
  const { latestMessage } = chat;
  const [showTyping, setShowTyping] = useState(false);
  let name;
  let pic;
  if (chat.isGroupChat) {
    name = chat.chatName;
    pic = "";
  } else {
    let otherUser = chat.users.filter((u) => u._id !== user._id)[0];
    if (typingUserId === otherUser._id) {
      // setShowTyping(true);
    }
    name = otherUser.name;
    pic = otherUser.pic;
  }

  useEffect(() => {
    let otherUser = chat.users.filter((u) => u._id !== user._id)[0];
    if (typingUserId === otherUser._id) {
      console.log(typingUserId);
      setShowTyping(true);
    }
    setTimeout(() => {
      setShowTyping(false);
      setTypingUserId(null);
    }, 2000);
  }, [typingUserId]);
  return (
    <HStack>
      <Avatar mr="4" mb="4" w="50px" h="50px" name={name} src={pic} />
      <VStack
        flex="1"
        alignItems="stretch"
        pb="4"
        borderBottom="1px solid #ddd"
      >
        <HStack justifyContent="space-between">
          <Text fontSize="lg">{name}</Text>
          <Text fontSize="xs" color="gray.600">
            {latestMessage?.createdAt
              ? new Date(latestMessage?.createdAt).toLocaleDateString("en-GB")
              : ""}
          </Text>
        </HStack>
        {showTyping && (
          <Text
            color="green.600"
            fontSize="sm"
            fontWeight="bold"
            mt="0px !important;"
          >
            typing...
          </Text>
        )}
        {!showTyping && (
          <Text
            sx={{
              marginTop: "0px !important;",
              maxWidth: "325px;",
              overflow: "hidden;",
              whiteSpace: "nowrap;",
              textOverflow: "ellipsis;",
              display: "flex",
              alignItems: "center",
            }}
            fontSize="sm"
            color="gray.600"
          >
            {latestMessage?.sender._id === user._id && (
              <Icon
                as={MdCheck}
                h={4}
                w={4}
                color="#A0AEC0"
                style={{ marginRight: "2px", marginTop: "3px" }}
              />
            )}
            {latestMessage?.content ? latestMessage?.content : <>&nbsp;</>}
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export default ChatInfo;
