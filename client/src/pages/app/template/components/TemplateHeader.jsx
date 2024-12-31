import { Switch } from "antd";
import { useTranslation } from "react-i18next";

const TemplateHeader = ({ user, access_users, title, onToggleView }) => {
  const [t] = useTranslation("app");

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
      <Switch
        checkedChildren={t("templatePage.fill")}
        unCheckedChildren={t("templatePage.view")}
        onChange={onToggleView}
        disabled={
          !user?.id ||
          (access_users?.length > 0 &&
            !access_users.some((accessUser) => accessUser.id === user.id))
        }
      />
    </div>
  );
};

export default TemplateHeader;
