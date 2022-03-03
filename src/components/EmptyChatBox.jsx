import { Box, Divider, Flex } from "@chakra-ui/layout";
import { Icon, Img, Text } from "@chakra-ui/react";
import { MdLocalBar } from "react-icons/md";

const EmptyChatBox = () => {
  return (
    <Flex
      d={{ base: "none", md: "flex" }}
      w={{ base: "0%", md: "70%" }}
      bg="gray.50"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderBottom="7px solid #48BB78"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        w={150}
        h={150}
        border="1px solid #ddd"
        boxShadow="inner"
      >
        <Img src="/whatsup-logo-100.png" w={100} />
      </Flex>
      <Text fontSize="3xl" fontWeight="300" color="gray.600" mt={6}>
        Select a user to start chatting
      </Text>
      <Text mt={3} color="gray.600" fontSize="sm">
        Whatsup is a clone of Whatsapp. Both does the same thing. Disturb
        friends. Give it a try.
      </Text>
      <Divider
        w="75%"
        mt={8}
        mb={8}
        borderColor="gray.200"
        borderWidth="1px"
        boxShadow="md"
      />
      <Text color="gray.600" fontSize="sm">
        <Icon as={MdLocalBar} fontSize="lg" mb="-4px" mr={3} />
        Let's connect with the world.
      </Text>
    </Flex>
  );
};

export default EmptyChatBox;
