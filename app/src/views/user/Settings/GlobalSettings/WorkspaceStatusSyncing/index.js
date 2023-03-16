import { trackSettingsToggled } from "modules/analytics/events/misc/settings";
import React, { useState } from "react";
import { toast } from "utils/Toast";
import SettingsItem from "../../SettingsItem";
import { doSyncDebounced } from "hooks/DbListenerInit/syncingNodeListener";
import { useDispatch, useSelector } from "react-redux";
import { getAppMode, getUserAuthDetails } from "store/selectors";
import { get } from "firebase/database";
import { getNodeRef } from "actions/FirebaseActions";
import { getRecordsSyncPath } from "utils/syncing/syncDataUtils";
import { getCurrentlyActiveWorkspace } from "store/features/teams/selectors";

const WorkspaceStatusSyncing = () => {
  const dispatch = useDispatch();
  // Global State
  const user = useSelector(getUserAuthDetails);
  const appMode = useSelector(getAppMode);
  const currentlyActiveWorkspace = useSelector(getCurrentlyActiveWorkspace);
  // Component State
  const [syncRuleStatus, setSyncRuleStatus] = useState(
    localStorage.getItem("syncRuleStatus") === "true" || false
  );

  const handleToggleStatusSyncing = async () => {
    const triggerSync = async () => {
      const syncNodeRef = getNodeRef(
        getRecordsSyncPath(
          "teamSync",
          user.details.profile.uid,
          currentlyActiveWorkspace.id
        )
      );

      const syncNodeRefNode = await get(syncNodeRef);

      doSyncDebounced(
        user.details.profile.uid,
        appMode,
        dispatch,
        syncNodeRefNode.val(),
        "teamSync",
        user.details.profile.uid
      );
    };

    if (syncRuleStatus) {
      localStorage.setItem("syncRuleStatus", false);
      setSyncRuleStatus(false);
      toast.success("Status syncing turned off");
      trackSettingsToggled("workspace_status_syncing", false);
    } else {
      localStorage.setItem("syncRuleStatus", true);
      setSyncRuleStatus(true);
      toast.success("Status syncing turned on");
      trackSettingsToggled("workspace_status_syncing", true);
      triggerSync();
    }
  };

  return (
    <SettingsItem
      isActive={syncRuleStatus}
      onClick={handleToggleStatusSyncing}
      title="Enable status syncing in team workspaces"
      caption="Stay updated by automatically syncing rule modifications with your teammates."
    />
  );
};

export default WorkspaceStatusSyncing;
