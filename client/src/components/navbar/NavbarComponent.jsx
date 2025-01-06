import { useState } from "react";
import { Button, Tooltip } from "antd";

import MenuItems from "./components/menuItems";
import ButtonComponent from "./components/ButtonComponent";

const NavbarComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = MenuItems();

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden md:block">
      <div className="relative">
        {/* Expanded Menu Items */}
        <div
          className={`absolute bottom-12 right-0 flex flex-col gap-3 transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-4 pointer-events-none"
          }`}
        >
          {menuItems.map((item, index) => (
            <Tooltip key={index} title={item.title} placement="left">
              <Button
                type="primary"
                shape="circle"
                icon={item.icon}
                size="large"
                onClick={item.onClick}
                className={"shadow-lg transform transition-all duration-300"}
              />
            </Tooltip>
          ))}
        </div>

        {/* Main Toggle Button */}
        <ButtonComponent
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
};

export default NavbarComponent;
