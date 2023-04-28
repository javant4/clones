import React from "react";
import DiscoverFeed from "../../components/DiscoverFeed";
import DiscoverHeaderLayout, {
  useDiscoverUser,
} from "../../layout/DiscoverHeader";
import { DiscoverNavBarLayout } from "../../layout/DiscoverNavBar";
import { getAllPins } from "../../sprout_discover_backend/lib/sanity.client";

interface Props {
  pins: DiscoverPin[];
}

function DiscoverHomePage({ pins }: Props) {
  const user = useDiscoverUser();

  return <DiscoverFeed pins={pins} />;
}

export const getServerSideProps = async ({ res, req }: any) => {
  const pins = await getAllPins();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  return {
    props: {
      pins,
    },
    // revalidate: 60,
  };
};

DiscoverHomePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};

export default DiscoverHomePage;
