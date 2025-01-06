import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const TemplateHeader = ({ access_users, title }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [t] = useTranslation("app");

  const { user } = useSelector((state) => state.authentication);

  const handleToggleView = (value) => {
    if (value) {
      navigate(`/templates/${id}/fill`);
    }
  };

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
      <Switch
        checkedChildren={t("templatePage.fill")}
        unCheckedChildren={t("templatePage.view")}
        onChange={handleToggleView}
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
