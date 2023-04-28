import React from "react";
import DiscoverSearch from "../../components/DiscoverSearch";
import DiscoverHeaderLayout, {
  useDiscoverUser,
} from "../../layout/DiscoverHeader";
import {
  DiscoverNavBarLayout,
  useDiscoverNavBar,
} from "../../layout/DiscoverNavBar";
import { NextPageWithLayout } from "../_app";

function DiscoverSearchPage() {
  const searchData = useDiscoverNavBar();
  console.log("search searchData", searchData);
  return <DiscoverSearch searchTerm={searchData} />;
}

DiscoverSearchPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};

export default DiscoverSearchPage;
