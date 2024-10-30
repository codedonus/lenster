import Followers from "@components/Shared/Modal/Followers";
import Following from "@components/Shared/Modal/Following";
import { Leafwatch } from "@helpers/leafwatch";
import { PROFILE } from "@hey/data/tracking";
import getProfile from "@hey/helpers/getProfile";
import humanize from "@hey/helpers/humanize";
import type { Profile } from "@hey/lens";
import { H4, Modal } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const { followers, following } = profile.stats;

  return (
    <div className="flex gap-8">
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <H4>{humanize(following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(followers)}</H4>
        <div className="ld-text-gray-500">{plur("Follower", followers)}</div>
      </button>
      <Modal
        onClose={() => {
          Leafwatch.track(PROFILE.OPEN_FOLLOWING);
          setShowFollowingModal(false);
        }}
        show={showFollowingModal}
        title="Following"
        size="md"
      >
        <Following handle={getProfile(profile).slug} profileId={profile.id} />
      </Modal>
      <Modal
        onClose={() => {
          Leafwatch.track(PROFILE.OPEN_FOLLOWERS);
          setShowFollowersModal(false);
        }}
        show={showFollowersModal}
        title="Followers"
        size="md"
      >
        <Followers handle={getProfile(profile).slug} profileId={profile.id} />
      </Modal>
    </div>
  );
};

export default Followerings;
