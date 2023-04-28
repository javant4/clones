import React, { createContext, useContext, useState } from "react";
import DiscoverNavBar from "../components/DiscoverNavBar";
import { useDiscoverUser } from "./DiscoverHeader";

// const DiscoverNavbarContext = createContext<
//   ReturnType<typeof useState<string>> | undefined
// >(undefined);

const DiscoverNavbarContext = createContext<string | undefined>(undefined);

export function useDiscoverNavBar() {
  const data = useContext(DiscoverNavbarContext);
  if (data === null) {
    throw new Error(
      "useDiscoverNavBar must be called in a child of DiscoverNavBarLayout"
    );
  }

  return data;
}

interface Props {
  children: React.ReactElement;
}

export function DiscoverNavBarLayout({ children }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const user = useDiscoverUser();

  return (
    <DiscoverNavbarContext.Provider value={searchTerm}>
      <div className="px-2 md:px-5">
        <div className="bg-gray-50">
          <DiscoverNavBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            user={user && user}
          />
        </div>
        <div>{children}</div>
      </div>
    </DiscoverNavbarContext.Provider>
  );
}
