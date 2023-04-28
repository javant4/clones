import { Box, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { defaultMenuItem } from "../../atoms/directoryMenuAtom";
import useDirectory from "../../hook/useDirectory";
import { useSupaUser } from "../../utils/useSupaUser";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const NavBar: React.FC = () => {
  const { user } = useSupaUser();
  const { onSelectMenuItem } = useDirectory();
  return (
    <Box bg="white" position="sticky" boxShadow="sm" top="0px" zIndex={50}>
      <Flex
        height="44px"
        padding="6px 12px"
        justify={{ md: "space-between" }}
        maxWidth="6xl"
        mx={{ base: "auto", lg: 5 }}
      >
        <Flex
          align="center"
          width={{ base: "40px", md: "auto" }}
          mr={{ base: 0, md: 2 }}
          cursor="pointer"
          onClick={() => onSelectMenuItem(defaultMenuItem)}
        >
          <Image src="/images/redditFace.svg" height="30px" />
          <Image
            src="/images/redditText.svg"
            height="46px"
            display={{ base: "none", md: "unset" }}
          />
        </Flex>
        {/* {user && <Directory />} */}
        <Directory />
        <SearchInput user={user} />
        <RightContent user={user} />
      </Flex>
    </Box>
  );
};

export default NavBar;
