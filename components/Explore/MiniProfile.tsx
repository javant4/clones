import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Avatar from "../Posts/Avatar";
type MiniProfileProps = {};

const MiniProfile: React.FC<MiniProfileProps> = () => {
  return (
    <Flex align="center" top="56px" justify="space-between">
      <Avatar src="https://cdn.sanity.io/images/5vpsewod/production/a32827ab492627b434a7323ef4832075ab6a812f-1937x2490.jpg" />
      <Flex direction="column" flexGrow={1}>
        <Text fontSize="sm" fontWeight={600}>
          ssssprout
        </Text>
        <Text fontSize="sm" color="gray.400">
          Welcome to sprout explore
        </Text>
      </Flex>

      <Button
        fontWeight={600}
        borderRadius="none"
        p="0px 0px 0px 10px"
        bg="none"
        _hover={{ bg: "none" }}
        color="blue.300"
      >
        Sign Out
      </Button>
    </Flex>
  );
};

export default MiniProfile;
