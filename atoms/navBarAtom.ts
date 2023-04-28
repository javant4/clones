import { atom } from "recoil";

const defaultNavBarState: NavBarState = {
  view: "forum",
};

export const navBarState = atom<NavBarState>({
  key: "navBarState",
  default: defaultNavBarState,
});
