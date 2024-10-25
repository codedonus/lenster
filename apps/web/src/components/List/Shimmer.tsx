import Footer from "@components/Shared/Footer";
import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { FC } from "react";

interface ClubPageShimmerProps {
  profileList?: boolean;
}

const ListPageShimmer: FC<ClubPageShimmerProps> = ({ profileList = false }) => {
  return (
    <GridLayout>
      <GridItemEight>
        {profileList ? (
          <Card>
            <ProfileListShimmer />
          </Card>
        ) : (
          <PublicationsShimmer />
        )}
      </GridItemEight>
      <GridItemFour>
        <Card className="mb-4 space-y-5 p-5">
          <div className="shimmer size-24 rounded-xl ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black" />
          <div className="space-y-2 pt-2">
            <div className="shimmer h-5 w-1/3 rounded-lg" />
            <div className="shimmer h-3 w-1/4 rounded-lg" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="shimmer size-7 rounded-lg" />
            <div className="shimmer h-3 w-20 rounded-lg" />
          </div>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default ListPageShimmer;
