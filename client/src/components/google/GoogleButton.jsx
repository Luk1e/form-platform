import { Button } from "antd";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { GoogleOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { loginWithGoogle } from "../../toolkit/auth/loginSlice";

const GoogleButtonContent = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["components"]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(loginWithGoogle(tokenResponse.access_token));
    },
  });

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

const GoogleButton = () => {
  return (
    <GoogleOAuthProvider clientId="530002033942-0dmk751ql0c82dii5sdffpp3np4muejh.apps.googleusercontent.com">
      <GoogleButtonContent />
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
