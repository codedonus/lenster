import FullPageLoader from "@components/Shared/FullPageLoader";
import GlobalAlerts from "@components/Shared/GlobalAlerts";
import GlobalBanners from "@components/Shared/GlobalBanners";
import BottomNavigation from "@components/Shared/Navbar/BottomNavigation";
import PageMetatags from "@components/Shared/PageMetatags";
import getCurrentSession from "@helpers/getCurrentSession";
import getToastOptions from "@helpers/getToastOptions";
import profileThemeFonts from "@helpers/profileThemeFonts";
import type { Profile } from "@hey/lens";
import { useCurrentProfileQuery } from "@hey/lens";
import { useIsClient } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useNonceStore } from "src/store/non-persisted/useNonceStore";
import { usePreferencesStore } from "src/store/non-persisted/usePreferencesStore";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";
import { hydrateAuthTokens, signOut } from "src/store/persisted/useAuthStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import { useProfileThemeStore } from "src/store/persisted/useProfileThemeStore";
import { isAddress } from "viem";
import { useDisconnect } from "wagmi";
import GlobalModals from "../Shared/GlobalModals";
import Navbar from "../Shared/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { reload } = useRouter();
  const { resolvedTheme } = useTheme();
  const { theme } = useProfileThemeStore();
  const { currentProfile, setCurrentProfile, setFallbackToCuratedFeed } =
    useProfileStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetStatus } = useProfileStatus();
  const { setLensHubOnchainSigNonce } = useNonceStore();
  const isMounted = useIsClient();
  const { disconnect } = useDisconnect();

  const { id: sessionProfileId } = getCurrentSession();

  const logout = (shouldReload = false) => {
    resetPreferences();
    resetStatus();
    signOut();
    disconnect?.();
    if (shouldReload) {
      reload();
    }
  };

  const { loading } = useCurrentProfileQuery({
    onCompleted: ({ profile, userSigNonces }) => {
      setCurrentProfile(profile as Profile);
      setLensHubOnchainSigNonce(userSigNonces.lensHubOnchainSigNonce);

      // If the profile has no following, we should fallback to the curated feed
      if (profile?.stats.followers === 0) {
        setFallbackToCuratedFeed(true);
      }
    },
    onError: () => logout(true),
    skip: !sessionProfileId || isAddress(sessionProfileId),
    variables: { request: { forProfileId: sessionProfileId } }
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();

    if (!accessToken) {
      logout();
    }
  };

  useEffect(() => {
    validateAuthentication();
  }, []);

  const profileLoading = !currentProfile && loading;

  if (profileLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <main className={profileThemeFonts(theme?.fontStyle)}>
      <PageMetatags />
      <Toaster
        containerStyle={{ wordBreak: "break-word" }}
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="flex min-h-screen flex-col pb-14 md:pb-0">
        <Navbar />
        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </main>
  );
};

export default Layout;
