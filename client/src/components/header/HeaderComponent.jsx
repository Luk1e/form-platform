import { Layout } from "antd";

import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";

const HeaderComponent = () => {
  return (
    <Layout.Header className="max-md:px-3 border-b-2">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="md:hidden">
        <MobileHeader />
      </div>
    </Layout.Header>
  );
};

export default HeaderComponent;
