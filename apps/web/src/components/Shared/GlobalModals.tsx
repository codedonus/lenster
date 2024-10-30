import NewPublication from "@components/Composer/NewPublication";
import ReportPublication from "@components/Shared/Modal/ReportPublication";
import { Modal } from "@hey/ui";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccount } from "wagmi";
import Auth from "./Auth";
import { useSignupStore } from "./Auth/Signup";
import GlobalModalsFromUrl from "./GlobalModalsFromUrl";
import AddToList from "./Modal/AddToList";
import OptimisticTransactions from "./Modal/OptimisticTransactions";
import ProfileStatus from "./Modal/ProfileStatus";
import ReportProfile from "./Modal/ReportProfile";
import SwitchProfiles from "./SwitchProfiles";

const GlobalModals: FC = () => {
  const {
    authModalType,
    reportingProfile,
    reportingPublicationId,
    setShowAuthModal,
    setShowNewPostModal,
    setShowOptimisticTransactionsModal,
    setShowProfileSwitchModal,
    setShowPublicationReportModal,
    setShowReportProfileModal,
    showAuthModal,
    showNewPostModal,
    showOptimisticTransactionsModal,
    showProfileSwitchModal,
    showPublicationReportModal,
    showReportProfileModal,
    showEditStatusModal,
    setShowEditStatusModal,
    showAddToListModal,
    setShowAddToListModal
  } = useGlobalModalStateStore();

  const { screen: signupScreen } = useSignupStore();
  const { address } = useAccount();

  const authModalTitle =
    authModalType === "signup"
      ? signupScreen === "choose"
        ? "Signup"
        : null
      : "Login";

  return (
    <>
      <GlobalModalsFromUrl />
      <Modal
        onClose={() =>
          setShowPublicationReportModal(false, reportingPublicationId)
        }
        show={showPublicationReportModal}
        title="Report Publication"
      >
        <ReportPublication publicationId={reportingPublicationId} />
      </Modal>
      <Modal
        onClose={() => setShowReportProfileModal(false, reportingProfile)}
        show={showReportProfileModal}
        title="Report profile"
      >
        <ReportProfile profile={reportingProfile} />
      </Modal>
      <Modal
        onClose={() => setShowProfileSwitchModal(false)}
        show={showProfileSwitchModal}
        size={address ? "xs" : "sm"}
        title="Switch Profile"
      >
        <SwitchProfiles />
      </Modal>
      <Modal
        onClose={() => setShowAuthModal(false, authModalType)}
        show={showAuthModal}
        title={authModalTitle}
      >
        <Auth />
      </Modal>
      <Modal
        onClose={() => setShowNewPostModal(false)}
        show={showNewPostModal}
        size="md"
        title="Create post"
      >
        <NewPublication className="!rounded-b-xl !rounded-t-none border-none" />
      </Modal>
      <Modal
        onClose={() => setShowOptimisticTransactionsModal(false)}
        show={showOptimisticTransactionsModal}
        title="Optimistic Transactions"
      >
        <OptimisticTransactions />
      </Modal>
      <Modal
        onClose={() => setShowEditStatusModal(false)}
        show={showEditStatusModal}
        title="Edit Status"
      >
        <ProfileStatus />
      </Modal>
      <Modal
        onClose={() => setShowAddToListModal(false, null)}
        show={showAddToListModal}
        title="Add to list"
      >
        <AddToList />
      </Modal>
    </>
  );
};

export default GlobalModals;
