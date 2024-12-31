import tagSlice from "./tagSlice";
import topicSlice from "./topicSlice";
import userSlice from "./userSlice";
import templateEngagementSlice from "./templateEngagementSlice";

const reducer = {
  supportTags: tagSlice,
  supportUsers: userSlice,
  supportTopics: topicSlice,
  templateEngagement: templateEngagementSlice,
};

export default reducer;
