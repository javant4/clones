import { atom } from "recoil";

const defaultModalSate: ExploreModalState = {
  open: false,
};

export const exploreModalState = atom<ExploreModalState>({
  key: "exploreModalState",
  default: defaultModalSate,
});
