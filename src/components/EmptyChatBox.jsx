import { Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

const EmptyChatBox = () => {
  return (
    <Flex
      w="70%"
      bg="gray.100"
      h="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="4xl" fontWeight="300">
        Select a user to start chatting
      </Text>
    </Flex>
  );
};

export default EmptyChatBox;
