import { Avatar } from "@chakra-ui/avatar";
import { HStack, VStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

const SearchResultItem = ({ user }) => {
  const { name, pic } = user;
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
        </HStack>
      </VStack>
    </HStack>
  );
};

export default SearchResultItem;
