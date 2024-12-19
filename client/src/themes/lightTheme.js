import { colors } from "./tailwindTheme";

const lightTheme = {
  components: {
    Layout: {
      headerBg: colors.purple.p1,
      headerColor: colors.purple.p8,
    },
    Input: {
      colorBgContainer: colors.purple.p1,
      activeBg: colors.purple.p2,
    },
    Button: {
    },
  },
  token: {
    controlItemBgHover: colors.purple.p2,
  },
};

export default lightTheme;
