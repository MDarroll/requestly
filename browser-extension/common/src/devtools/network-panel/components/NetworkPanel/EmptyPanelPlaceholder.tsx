import { Typography } from "antd";
import React from "react";

const EmptyPanelPlaceholder: React.FC = () => {
  return (
    <div className="empty-panel-placeholder">
      <Typography.Text type="secondary">
        Recording network activity...
      </Typography.Text>
      <Typography.Text type="secondary">
        Perform a request or Reload the page to see network requests.
      </Typography.Text>
    </div>
  );
};

export default EmptyPanelPlaceholder;
