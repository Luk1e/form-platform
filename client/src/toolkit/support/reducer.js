import tagSlice from "./tagSlice";
import topicSlice from "./topicSlice";
import userSlice from "./userSlice";

const reducer = {
  supportTags: tagSlice,
  supportTopics: topicSlice,
  supportUsers: userSlice,
};

export default reducer;
