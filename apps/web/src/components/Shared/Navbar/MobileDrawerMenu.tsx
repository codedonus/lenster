import { XMarkIcon } from "@heroicons/react/24/outline";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import Slug from "../Slug";
import Analytics from "./NavItems/Analytics";
import AppVersion from "./NavItems/AppVersion";
import Bookmarks from "./NavItems/Bookmarks";
import Logout from "./NavItems/Logout";
import ProfileStatus from "./NavItems/ProfileStatus";
import Settings from "./NavItems/Settings";
import Support from "./NavItems/Support";
import SwitchProfile from "./NavItems/SwitchProfile";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourProfile from "./NavItems/YourProfile";

const MobileDrawerMenu: FC = () => {
  const { currentProfile } = useProfileStore();
  const { setShowMobileDrawer } = useGlobalModalStateStore();

  const closeDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = "py-3 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-100 py-4 md:hidden dark:bg-black">
      <button className="px-5" onClick={closeDrawer} type="button">
        <XMarkIcon className="size-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
          href={getProfile(currentProfile).link}
          onClick={closeDrawer}
        >
          <div className="flex w-full space-x-1.5">
            <Image
              alt={currentProfile?.id}
              className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
              onError={({ currentTarget }) => {
                currentTarget.src = getLennyURL(currentProfile?.id);
              }}
              src={getAvatar(currentProfile as Profile)}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getProfile(currentProfile).slugWithPrefix}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <SwitchProfile className={cn(itemClass, "px-4")} />
          <div className="divider" />
          <ProfileStatus
            className={cn(itemClass, "px-4")}
            id={currentProfile?.id}
          />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Link href={getProfile(currentProfile).link} onClick={closeDrawer}>
              <YourProfile className={cn(itemClass, "px-4")} />
            </Link>
            <Link href="/settings" onClick={closeDrawer}>
              <Settings className={cn(itemClass, "px-4")} />
            </Link>
            <Bookmarks
              className={cn(itemClass, "px-4")}
              onClick={closeDrawer}
            />
            <Link href="/analytics" onClick={closeDrawer}>
              <Analytics className={cn(itemClass, "px-4")} />
            </Link>
            <ThemeSwitch
              className={cn(itemClass, "px-4")}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Support className={cn(itemClass, "px-4")} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              className={cn(itemClass, "px-4 py-3")}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        {currentProfile ? <AppVersion /> : null}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
