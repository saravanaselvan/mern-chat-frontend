import { Avatar } from "@chakra-ui/avatar";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Text } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatContext";

const ContactInfo = () => {
  const { user, currentChat, setShowContactInfo } = ChatState();

  let name;
  let pic;
  let about;
  if (currentChat.isGroupChat) {
    name = currentChat.chatName;
    pic = "";
    about = "";
  } else {
    let otherUser = currentChat.users.filter((u) => u._id !== user._id)[0];
    name = otherUser.name;
    pic = otherUser.pic;
    about = otherUser.about;
  }
  return (
    <Flex w="50%" bg="gray.100" h="100vh" flexDirection="column" pos="relative">
      <HStack
        px="4"
        py="8"
        bg="gray.100"
        spacing="30px"
        zIndex="100"
        borderBottomWidth="1px"
        borderLeft="1px solid #ddd"
        h="75px"
      >
        <CloseIcon
          mr="4"
          ml="4"
          fontSize="12"
          cursor="pointer"
          onClick={() => {
            setShowContactInfo(false);
          }}
        />
        <Text>Contact Info</Text>
      </HStack>
      <Box bg="#fff" pl={0} pr={0} pt={6}>
        <Flex
          direction="column"
          gap={3}
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            w="200px"
            h="200px"
            name={name}
            src={pic}
            cursor="pointer"
            alignSelf="center"
          />
          <Flex direction="column" gap={4} px={8} py={1} pb={4} boxShadow="sm">
            <Text fontSize="3xl">{name}</Text>
          </Flex>
        </Flex>
      </Box>
      <Flex
        direction="column"
        bg="#fff"
        gap={4}
        px={8}
        py={4}
        my={4}
        boxShadow="sm"
      >
        <Text fontSize="sm" color="teal.600">
          About
        </Text>
        <Text>{about}</Text>
      </Flex>
    </Flex>
  );
};

export default ContactInfo;
