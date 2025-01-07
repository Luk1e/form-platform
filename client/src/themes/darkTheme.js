import { theme } from "antd";
import colors from "./colors";

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: colors.purple.p8,
  },
  components: {
    Layout: {
      headerBg: "black",
    },
  },
};

export default darkTheme;
