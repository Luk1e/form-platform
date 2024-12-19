import { colors } from "./tailwindTheme";

const darkTheme = {
  components: {
    Layout: {
      headerBg: colors.purple.p8,
      headerColor: colors.purple.p1,
    },
    Input: {
      colorBgContainer: colors.purple.p2,
      activeBg: colors.purple.p1,
    },
    Menu: {},
    Button: {},
  },
  token: {
    controlItemBgHover: colors.purple.p4,
  },
};

export default darkTheme;
