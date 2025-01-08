import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import { Input, Select, Switch, Form, Upload } from "antd";

const BasicInfo = ({ formikProps }) => {
  const { tags } = useSelector((state) => state.supportTags);
  const { topics } = useSelector((state) => state.supportTopics);
  const { users } = useSelector((state) => state.supportUsers);

  const { values, touched, errors, handleChange, setFieldValue, handleBlur } =
    formikProps;

  const { t, i18n } = useTranslation("auth");

  const handleFileSelect = (file) => {
    setFieldValue("image_file", file);
    return false;
  };

  useEffect(() => {
    if (Object.keys(formikProps.touched).length > 0) {
      formikProps.validateForm();
    }
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      {/* Template title input */}
      <Form.Item
        validateStatus={touched.title && errors.title ? "error" : ""}
        help={touched.title && errors.title}
      >
        <Input
          name="title"
          placeholder={t("createTemplatePage.basicInfo.templateTitle")}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.title}
        />
      </Form.Item>

      {/* Template description input */}
      <Form.Item
        validateStatus={
          touched.description && errors.description ? "error" : ""
        }
        help={touched.description && errors.description}
      >
        <Input.TextArea
          name="description"
          placeholder={t("createTemplatePage.basicInfo.description")}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
          rows={4}
        />
      </Form.Item>

      {/* Template topic select */}
      <Form.Item
        validateStatus={touched.topic_id && errors.topic_id ? "error" : ""}
        help={touched.topic_id && errors.topic_id}
      >
        <Select
          name="topic_id"
          placeholder={t("createTemplatePage.basicInfo.selectTopic")}
          value={values.topic_id}
          onBlur={handleBlur}
          onChange={(value) => setFieldValue("topic_id", value)}
          options={topics.map((topic) => ({
            value: topic.id,
            label: topic.name,
          }))}
        />
      </Form.Item>

      {/* Template tags select */}
      <Form.Item
        validateStatus={touched.tags && errors.tags ? "error" : ""}
        help={touched.tags && errors.tags}
      >
        <Select
          mode="tags"
          name="tags"
          placeholder={t("createTemplatePage.basicInfo.addTags")}
          value={values.tags}
          onBlur={handleBlur}
          onChange={(value) => setFieldValue("tags", value)}
          options={tags.map((tag) => ({
            value: tag.name,
            label: tag.name,
          }))}
        />
      </Form.Item>

      {/* Upload template image file */}
      <Form.Item
        validateStatus={touched.image_file && errors.image_file ? "error" : ""}
        help={touched.image_file && errors.image_file}
        label={t("createTemplatePage.basicInfo.templateImage")}
      >
        <Upload
          name="image"
          listType="picture"
          showUploadList={true}
          beforeUpload={handleFileSelect}
          maxCount={1}
        >
          <button type="button" className="ant-btn ant-btn-default">
            <UploadOutlined />
            <span className="ml-2">
              {t("createTemplatePage.basicInfo.selectImage")}
            </span>
          </button>
        </Upload>
      </Form.Item>

      {/* Switch visibility */}
      <Form.Item>
        <div className="flex items-center space-x-2">
          <Switch
            checked={values.is_public}
            onChange={(value) => setFieldValue("is_public", value)}
          />
          <span className="text-sm sm:text-base">
            {t("createTemplatePage.basicInfo.publicTemplate")}
          </span>
        </div>
      </Form.Item>

      {/* Select users */}
      {!values.is_public && (
        <Form.Item
          validateStatus={
            touched.access_users && errors.access_users ? "error" : ""
          }
          help={touched.access_users && errors.access_users}
          className="mt-4"
        >
          <Select
            mode="multiple"
            placeholder={t("createTemplatePage.basicInfo.selectUsers")}
            value={values.access_users}
            onChange={(value) => setFieldValue("access_users", value)}
            className="w-full"
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            options={users.map((user) => ({
              value: user.id,
              label: user.username,
            }))}
          />
        </Form.Item>
      )}
    </div>
  );
};

export default BasicInfo;
