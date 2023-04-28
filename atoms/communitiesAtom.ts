import { atom } from "recoil";

export const defaultCommunity: Root = {
  created_at: "",
  id: "",
  topic: "",
  creator_id: "",
  privacy_type: "public",
  image_url: "",
  number_of_members: [{ count: 0 }],
};

export const defaultCommunityState: RootState = {
  mySnippets: [],
  initSnippetsFetched: false,
  // visitedCommunities: {},
  // currentCommunity: {} as Root,
};

export const communityState = atom<RootState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
