const getQuestionTypes = (t) => [
  { id: 1, name: t("createTemplatePage.singleLine") },
  { id: 2, name: t("createTemplatePage.multiLine") },
  { id: 3, name: t("createTemplatePage.integer") },
  { id: 4, name: t("createTemplatePage.checkbox") },
  { id: 5, name: t("createTemplatePage.singleChoice") },
];

export default getQuestionTypes;
