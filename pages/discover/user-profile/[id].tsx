import { useRouter } from "next/router";
import DiscoverUserProfile from "../../../components/DiscoverUserProfile";
import DiscoverHeaderLayout from "../../../layout/DiscoverHeader";
import { DiscoverNavBarLayout } from "../../../layout/DiscoverNavBar";

function UserProfilePage() {
  const router = useRouter();
  return <DiscoverUserProfile profileId={router.query.id} />;
}

UserProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DiscoverHeaderLayout>
      <DiscoverNavBarLayout>{page}</DiscoverNavBarLayout>
    </DiscoverHeaderLayout>
  );
};

export default UserProfilePage;
