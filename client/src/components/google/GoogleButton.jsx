import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../../toolkit/auth/loginSlice";
import { useTranslation } from "react-i18next";

const GoogleButton = () => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(loginWithGoogle(tokenResponse.access_token));
    },
  });

  const { t } = useTranslation(["components"]);

  return (
    <Button
      onClick={() => login()}
      icon={<GoogleOutlined />}
      className="w-full mt-4"
    >
      {t("global.continueWithGoogle")}
    </Button>
  );
};

export default GoogleButton;
