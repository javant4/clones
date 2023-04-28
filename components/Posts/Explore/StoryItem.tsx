import { Box, Fade, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FakeUser } from "../../Explore/Stories";

type StoryItem = {
  img: string;
  username: string;
};

const StoryItem: React.FC<StoryItem> = ({ img, username }) => {
  return (
    <Box>
      <Image
        src={img}
        width="45px"
        height="45px"
        borderRadius="full"
        border="1px solid"
        borderColor="red.400"
        cursor="pointer"
        _hover={{
          transform: "scale(1.10)",
          transition: ".2s ease-out",
        }}
        alt=""
      />
      <Text
        fontSize="xs"
        width="45px"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        align="center"
      >
        {username}
      </Text>
    </Box>
  );
};

export default StoryItem;
