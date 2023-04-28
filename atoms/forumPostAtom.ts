import { atom } from "recoil";

const defautltForumPostState: RootPostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const forumPostState = atom<RootPostState>({
  key: "forumPostState",
  default: defautltForumPostState,
});
