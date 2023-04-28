import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Stack } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import {
  AiOutlineHeart,
  AiOutlinePlusCircle,
  AiOutlineMenu,
} from "react-icons/ai";
import { HiOutlineUserGroup, HiOutlinePaperAirplane } from "react-icons/hi";
import { TiHome } from "react-icons/ti";
import { useRecoilState, useSetRecoilState } from "recoil";
import { exploreModalState } from "../../../../atoms/exploreModalAtom";

// import useDirectory from "../../../hooks/useDirectory";

type ExploreActionIconsProps = {};

const ExploreActionIcons: React.FC<ExploreActionIconsProps> = () => {
  //   const { toggleMenuOpen } = useDirectory();
  const setOpen = useSetRecoilState(exploreModalState);
  return (
    <Flex alignItems="center" flexGrow={1}>
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="gray.200"
        pr={1}
      >
        <Stack direction="row" spacing={2}>
          <Flex
            cursor="pointer"
            borderRadius={4}
            _hover={{
              transform: "scale(1.20)",
              transition: ".2s ease-out",
            }}
          >
            <Icon as={TiHome} fontSize={22} />
          </Flex>
          <Flex
            position="relative"
            cursor="pointer"
            borderRadius={4}
            _hover={{
              transform: "scale(1.20)",
              transition: ".2s ease-out",
            }}
          >
            <Icon
              as={HiOutlinePaperAirplane}
              fontSize={22}
              transform="rotate(45deg)"
            />
            <Box position="absolute" top="-8px" right="-1px" fontSize="sm">
              3
            </Box>
          </Flex>
          <Flex
            cursor="pointer"
            borderRadius={4}
            _hover={{
              transform: "scale(1.20)",
              transition: ".2s ease-out",
            }}
          >
            <Icon
              as={AiOutlinePlusCircle}
              fontSize={22}
              onClick={() => setOpen({ open: true })}
            />
          </Flex>
          <Flex
            cursor="pointer"
            borderRadius={4}
            _hover={{
              transform: "scale(1.20)",
              transition: ".2s ease-out",
            }}
          >
            <Icon as={HiOutlineUserGroup} fontSize={22} />
          </Flex>
          <Flex
            cursor="pointer"
            borderRadius={4}
            _hover={{
              transform: "scale(1.20)",
              transition: ".2s ease-out",
            }}
          >
            <Icon as={AiOutlineHeart} fontSize={22} />
          </Flex>
        </Stack>
      </Box>
      <Flex
        display={{ base: "flex", md: "none" }}
        padding={1}
        cursor="pointer"
        borderRadius={4}
        _hover={{
          transform: "scale(1.20)",
          transition: ".2s ease-out",
        }}
      >
        <Icon as={AiOutlineMenu} fontSize={22} />
      </Flex>
    </Flex>
  );
};
export default ExploreActionIcons;
