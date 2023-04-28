import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { MdOutlineForum } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import { navBarState } from "../../../atoms/navBarAtom";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunitiesModal";
import MenuListItem from "./MenuListItem";

type RoutesProps = {
  menuOpen: boolean;
};

const Routes: React.FC = () => {
  const [open, setOpen] = useState<boolean>();
  const mySnippets = useRecoilValue(communityState).mySnippets;
  const navBarStateValue = useRecoilValue(navBarState);

  return (
    <>
      <CreateCommunityModal open={open!} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          PAGES
        </Text>
        <MenuListItem
          displayText={`forum`}
          link={`/forum`}
          icon={MdOutlineForum}
          iconColor="green.400"
          // imageURL={snippet.image_url}
        />
        <MenuListItem
          displayText={`explore`}
          link={`/explore/`}
          icon={AiOutlineSearch}
          iconColor="green.400"
          // imageURL={snippet.image_url}
        />
      </Box>
      {navBarStateValue.view === "forum" && (
        <>
          <Box mt={3} mb={4}>
            <Text
              pl={3}
              mb={1}
              fontSize="7pt"
              fontWeight={500}
              color="gray.500"
            >
              MODERATING
            </Text>
            {mySnippets
              .filter((snippet: RootSnippet) => snippet.is_moderator)
              .map((snippet: RootSnippet) => (
                <MenuListItem
                  key={snippet.root_id}
                  displayText={`s/${snippet.topic}`}
                  link={`/forum/s/${snippet.topic}`}
                  icon={FaReddit}
                  iconColor="brand.100"
                  imageURL={snippet.image_url}
                />
              ))}
          </Box>
          <Box mt={3} mb={4}>
            <Text
              pl={3}
              mb={1}
              fontSize="7pt"
              fontWeight={500}
              color="gray.500"
            >
              MY ROOTS
            </Text>
            <MenuItem
              width="100%"
              fontSize="10pt"
              _hover={{ bg: "gray.100" }}
              onClick={() => setOpen(true)}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={GrAdd} />
                Create Root
              </Flex>
            </MenuItem>
            {mySnippets.map((snippet: RootSnippet) => (
              <MenuListItem
                key={snippet.root_id}
                displayText={`s/${snippet.topic}`}
                link={`/forum/s/${snippet.topic}`}
                icon={FaReddit}
                iconColor="blue.500"
                imageURL={snippet.image_url}
              />
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default Routes;
