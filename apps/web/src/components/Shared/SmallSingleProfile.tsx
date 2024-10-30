import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import Misuse from "./Profile/Icons/Misuse";
import Verified from "./Profile/Icons/Verified";
import Slug from "./Slug";

interface SmallSingleProfileProps {
  hideSlug?: boolean;
  linkToProfile?: boolean;
  profile: Profile;
  smallAvatar?: boolean;
  timestamp?: Date;
}

const SmallSingleProfile: FC<SmallSingleProfileProps> = ({
  hideSlug = false,
  linkToProfile = false,
  profile,
  smallAvatar = false,
  timestamp = ""
}) => {
  const UserAvatar: FC = () => (
    <Image
      alt={profile.id}
      className={cn(
        smallAvatar ? "size-4" : "size-6",
        "rounded-full border bg-gray-200 dark:border-gray-700"
      )}
      height={smallAvatar ? 16 : 24}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(profile.id);
      }}
      src={getAvatar(profile)}
      width={smallAvatar ? 16 : 24}
    />
  );

  const UserName: FC = () => (
    <div className="flex max-w-full flex-wrap items-center">
      <div className={cn(!hideSlug && "max-w-[75%]", "mr-1 truncate")}>
        {getProfile(profile).displayName}
      </div>
      <Verified id={profile.id} iconClassName="mr-1 size-4" />
      <Misuse id={profile.id} iconClassName="mr-2 size-4" />
      {!hideSlug && (
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
      )}
      {timestamp && (
        <span className="ld-text-gray-500">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{formatRelativeOrAbsolute(timestamp)}</span>
        </span>
      )}
    </div>
  );

  const ProfileInfo: FC = () => (
    <div className="flex items-center space-x-2">
      <UserAvatar />
      <UserName />
    </div>
  );

  return linkToProfile ? (
    <Link href={getProfile(profile).link}>
      <ProfileInfo />
    </Link>
  ) : (
    <ProfileInfo />
  );
};

export default memo(SmallSingleProfile);
