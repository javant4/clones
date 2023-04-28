import { Box, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../../../../atoms/communitiesAtom";
import { navBarState } from "../../../../atoms/navBarAtom";
import About from "../../../../components/Community/About";
import PageContentLayout from "../../../../components/Layout/PageContent";
import NewPostForm from "../../../../components/Posts/Forum/PostForm/NewPostForm";
import useCommunityData from "../../../../hook/useCommunityData";
import { useSupaUser } from "../../../../utils/useSupaUser";

const SubmitPostPage: React.FC = () => {
  const { user } = useSupaUser();
  const { communityStateValue } = useCommunityData();
  const [navBarStateValue, setNavBarStateValue] = useRecoilState(navBarState);

  useEffect(() => {
    if (navBarStateValue.view === "forum") return;
    setNavBarStateValue((prev) => ({
      ...prev,
      view: "forum",
    }));
  }, [navBarStateValue]);
  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityData={communityStateValue.currentCommunity}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About
            user={user}
            communityData={communityStateValue.currentCommunity}
            // pt={6}
            // onCreatePage
            // loading={loading}
          />
        )}
      </>
    </PageContentLayout>
  );
};

export default SubmitPostPage;
