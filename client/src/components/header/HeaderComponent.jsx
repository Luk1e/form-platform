import { Layout } from "antd";
import { useState } from "react";

import MobileHeader from "./mobile/MobileHeader";
import DesktopHeader from "./desktop/DesktopHeader";

const HeaderComponent = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <Layout.Header className="max-md:px-3 border-b-2">
      <div className="hidden md:block">
        <DesktopHeader
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
        />
      </div>

      <div className="md:hidden">
        <MobileHeader
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
        />
      </div>
    </Layout.Header>
  );
};

export default HeaderComponent;
