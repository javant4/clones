import { atom } from "recoil";

const defautltExplorePostState: NetworkPostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const explorePostState = atom<NetworkPostState>({
  key: "explorePostState",
  default: defautltExplorePostState,
});
