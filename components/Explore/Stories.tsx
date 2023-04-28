import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import StoryItem from "../Posts/Explore/StoryItem";

type StoriesProps = {};

export type FakeUser = {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  birthdate: Date;
  registeredAt: Date;
};

const Stories: React.FC<StoriesProps> = () => {
  const [suggestions, setSuggestions] = useState<FakeUser[]>([]);
  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      userId: faker.datatype.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
    }));
    setSuggestions(suggestions);
  }, []);

  return (
    <Stack
      spacing={2}
      mb={4}
      p={6}
      direction="row"
      bg="white"
      border="1px solid"
      borderRadius="sm"
      borderColor="gray.200"
      overflow="scroll"
      overflowY="hidden"
      sx={{
        "&::-webkit-scrollbar": {
          width: "16px",
          //   borderRadius: "8px",
          backgroundColor: "white",
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "black",
          //   borderRadius: "24px",
        },
      }}
    >
      {suggestions.map((profile) => (
        <StoryItem
          key={profile.userId}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </Stack>
  );
};

export default Stories;
