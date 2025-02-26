import { Tag } from "antd";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import "./index.css";

export const Footer = () => {
  const commands = [
    { action: "to select", icons: [<MdOutlineKeyboardReturn />] },
    {
      action: "to navigate",
      icons: [<AiOutlineArrowUp />, <AiOutlineArrowDown />],
    },
    {
      action: "move to parent",
      icons: [<FiDelete />],
    },
  ];
  return (
    <div className="cmd-footer-wrapper">
      {commands.map((cmd, index) => (
        <div className="cmd-wrapper" key={index}>
          <span>
            {cmd.icons.map((icon, index) => (
              <Tag key={index} className="cmd-key-icon">
                {icon}
              </Tag>
            ))}
          </span>
          <span>{cmd.action}</span>
        </div>
      ))}
    </div>
  );
};
