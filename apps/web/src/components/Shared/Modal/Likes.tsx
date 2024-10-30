import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import SingleProfile from "@components/Shared/SingleProfile";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ProfileLinkSource } from "@hey/data/tracking";
import {
  LimitType,
  type Profile,
  type WhoReactedPublicationRequest,
  useWhoReactedPublicationQuery
} from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface LikesProps {
  publicationId: string;
}

const Likes: FC<LikesProps> = ({ publicationId }) => {
  const { currentProfile } = useProfileStore();

  const request: WhoReactedPublicationRequest = {
    for: publicationId,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useWhoReactedPublicationQuery({
    skip: !publicationId,
    variables: { request }
  });

  const profiles = data?.whoReactedPublication?.items;
  const pageInfo = data?.whoReactedPublication?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<HeartIcon className="size-8" />}
          message="No likes."
          hideCard
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load likes"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-profile-list"
      computeItemKey={(index, like) => `${like.profile.id}-${index}`}
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, like) => (
        <div className="p-5">
          <SingleProfile
            hideFollowButton={currentProfile?.id === like.profile.id}
            hideUnfollowButton={currentProfile?.id === like.profile.id}
            profile={like.profile as Profile}
            showBio
            showUserPreview={false}
            source={ProfileLinkSource.Likes}
          />
        </div>
      )}
    />
  );
};

export default Likes;
