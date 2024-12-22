import { colors } from "./tailwindTheme";
import { theme } from "antd";

const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: colors.purple.p5,
  },
  components: {
    Layout: {
      headerBg: "white",
    },
  },
};

export default lightTheme;
