import { Flex } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import React from "react";
import { useRecoilValue } from "recoil";
import { navBarState } from "../../../atoms/navBarAtom";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import ExploreActionIcons from "./HeaderIcons/ExploreIcons";
import ForumActionIcons from "./HeaderIcons/ForumIcons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";
import CreateExplorePostModal from "../../Modal/CreateExplorePost/CreateExplorePostModal";

type Props = {
  user?: User;
};

const RightContent: React.FC<Props> = ({ user }) => {
  const navBarStateValue = useRecoilValue(navBarState);

  return (
    <>
      <AuthModal />
      <CreateExplorePostModal />
      <Flex justify="center" align="center">
        {user ? (
          <>
            {navBarStateValue.view === "forum" && <ForumActionIcons />}
            {navBarStateValue.view === "explore" && <ExploreActionIcons />}
          </>
        ) : (
          <AuthButtons />
        )}
        <MenuWrapper user={user} />
      </Flex>
    </>
  );
};

export default RightContent;
