import { Flex, Icon, Text, Box, Button } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Avatar from "../Posts/Avatar";

export type FakeCategories = {
  userId: string;
  username: string;
  avatar: string;
  description: string;
};

const Recommendations: React.FC = () => {
  const [categories, setCategories] = useState<FakeCategories[]>([]);

  useEffect(() => {
    const categories = [...Array(5)].map((_, i) => ({
      userId: faker.datatype.uuid(),
      username: faker.internet.userName(),
      avatar: faker.image.avatar(),
      description: faker.company.name(),
    }));
    setCategories(categories);
  }, []);

  return (
    <Box pt={4}>
      <Flex justify="space-between" align="center">
        <Text fontSize="10pt" color="gray.400" fontWeight={700}>
          Suggestions for you
        </Text>
        <Button
          fontWeight={700}
          borderRadius="none"
          p={0}
          bg="none"
          _hover={{ bg: "none" }}
          color="gray.600"
        >
          View All
        </Button>
      </Flex>
      <>
        {categories.map((category, index) => {
          return (
            // <Link key={category.id} href={`/forum/s/${category.topic}`}>
            <Flex
              key={category.userId}
              justify="space-between"
              align="center"
              mt="5px"
            >
              <Avatar
                border="1px solid"
                borderColor="gray.200"
                src={category.avatar}
              />
              <Flex direction="column" flexGrow={1}>
                <Text fontSize="sm" fontWeight={600}>
                  {category.username}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {category.description}{" "}
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
                Follow
              </Button>
            </Flex>
            // </Link>
          );
        })}
      </>
    </Box>
  );
};

export default Recommendations;
