import { colors } from "./tailwindTheme";
import { theme } from "antd";

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
