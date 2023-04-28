import React from "react";
import DiscoverCreatePin from "../../components/DiscoverCreatePin";
import DiscoverHeaderLayout, {
  useDiscoverUser,
} from "../../layout/DiscoverHeader";
import { DiscoverNavBarLayout } from "../../layout/DiscoverNavBar";
import { NextPageWithLayout } from "../_app";

function DiscoverCreatePinPage() {
  const user = useDiscoverUser();

  return <DiscoverCreatePin user={user} />;
}

DiscoverCreatePinPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};

export default DiscoverCreatePinPage;
