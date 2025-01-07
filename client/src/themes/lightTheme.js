import { theme } from "antd";
import colors from "./colors";

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
