import { QueueListIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import getProfileDetails, {
  GET_PROFILE_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getProfileDetails";
import formatDate from "@hey/helpers/datetime/formatDate";
import getAppName from "@hey/helpers/getAppName";
import { isMirrorPublication } from "@hey/helpers/publicationHelpers";
import type { AnyPublication } from "@hey/lens";
import { Card, Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import { useHiddenCommentFeedStore } from ".";
import PublicationActions from "./Actions";
import HiddenPublication from "./HiddenPublication";
import PublicationAvatar from "./PublicationAvatar";
import PublicationBody from "./PublicationBody";
import PublicationHeader from "./PublicationHeader";
import PublicationStats from "./PublicationStats";
import Translate from "./Translate";
import PublicationType from "./Type";

interface FullPublicationProps {
  hasHiddenComments: boolean;
  publication: AnyPublication;
}

const FullPublication: FC<FullPublicationProps> = ({
  hasHiddenComments,
  publication
}) => {
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { by, createdAt, publishedOn } = targetPublication;

  usePushToImpressions(targetPublication.id);

  const { data: profileDetails } = useQuery({
    enabled: Boolean(by.id),
    queryFn: () => getProfileDetails(by.id || ""),
    queryKey: [GET_PROFILE_DETAILS_QUERY_KEY, by.id]
  });

  const isSuspended = isStaff ? false : profileDetails?.isSuspended;

  if (isSuspended) {
    return (
      <Card className="!bg-gray-100 dark:!bg-gray-800 m-5" forceRounded>
        <div className="px-4 py-3 text-sm">
          Author Profile has been suspended!
        </div>
      </Card>
    );
  }

  return (
    <article className="p-5">
      <PublicationType publication={publication} showType />
      <div className="flex items-start space-x-3">
        <PublicationAvatar publication={publication} />
        <div className="w-[calc(100%-55px)]">
          <PublicationHeader publication={targetPublication} />
          {targetPublication.isHidden ? (
            <HiddenPublication type={targetPublication.__typename} />
          ) : (
            <>
              <PublicationBody
                contentClassName="full-page-publication-markup"
                publication={targetPublication}
              />
              <Translate publication={targetPublication} />
              <div className="ld-text-gray-500 my-3 text-sm">
                <span>{formatDate(createdAt, "hh:mm A · MMM D, YYYY")}</span>
                {publishedOn?.id ? (
                  <span> · Posted via {getAppName(publishedOn.id)}</span>
                ) : null}
              </div>
              <PublicationStats
                publicationId={targetPublication.id}
                publicationStats={targetPublication.stats}
              />
              <div className="divider" />
              <div className="flex items-center justify-between">
                <PublicationActions publication={targetPublication} showCount />
                {hasHiddenComments ? (
                  <div className="mt-2">
                    <button
                      aria-label="Like"
                      className={cn(
                        showHiddenComments
                          ? "text-green-500 hover:bg-green-300/20"
                          : "ld-text-gray-500 hover:bg-gray-300/20",
                        "rounded-full p-1.5 outline-offset-2"
                      )}
                      onClick={() => setShowHiddenComments(!showHiddenComments)}
                      type="button"
                    >
                      <Tooltip
                        content={
                          showHiddenComments
                            ? "Hide hidden comments"
                            : "Show hidden comments"
                        }
                        placement="top"
                        withDelay
                      >
                        <QueueListIcon className="size-5" />
                      </Tooltip>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
