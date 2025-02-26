import { message } from "antd";

export const toast = {};

message.config({
  top: 60,
  maxCount: 2,
});

toast.success = (messageText) => {
  message.success(messageText);
};
toast.info = (messageText, duration) => {
  message.info(messageText, duration);
};
toast.error = (messageText) => {
  message.error(messageText);
};
toast.warn = (messageText) => {
  message.warn(messageText);
};
toast.loading = (messageText, duration) => {
  message.loading(messageText, duration);
};
