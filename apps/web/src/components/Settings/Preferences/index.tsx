import MetaTags from "@components/Common/MetaTags";
import NotLoggedIn from "@components/Shared/NotLoggedIn";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@hey/ui";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import SettingsSidebar from "../Sidebar";
import AppIcon from "./AppIcon";
import HighSignalNotificationFilter from "./HighSignalNotificationFilter";

const PreferencesSettings: NextPage = () => {
  const { currentProfile } = useProfileStore();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: "settings", subpage: "preferences" });
  }, []);

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Preferences settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card>
          <CardHeader
            body={`Update your preferences to control how you can change your
            experience on ${APP_NAME}.`}
            title="Your Preferences"
          />
          <div className="m-5">
            <HighSignalNotificationFilter />
          </div>
        </Card>
        <AppIcon />
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
