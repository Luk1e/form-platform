import createTemplateSlice from "./createTemplateSlice";
import updateTemplateSlice from "./updateTemplateSlice";
import deleteTemplateSlice from "./deleteTemplateSlice";
import popularTemplateSlice from "./popularTemplateSlice";
import latestTemplateSlice from "./latestTemplateSlice";
import getTemplateSlice from "./getTemplateSlice";
import searchTemplateSlice from "./searchTemplateSlice";

const reducer = {
  createTemplate: createTemplateSlice,
  latestTemplates: latestTemplateSlice,
  popularTemplates: popularTemplateSlice,
  updateTemplate: updateTemplateSlice,
  deleteTemplate: deleteTemplateSlice,
  template: getTemplateSlice,
  searchTemplates: searchTemplateSlice,
};

export default reducer;
