const transformAnswerValue = (values, template) => {
  return Object.entries(values).map(([key, value]) => {
    const questionId = parseInt(key.split("_")[1], 10);
    const question = template.TemplateQuestions.find(
      (q) => q.id === questionId
    );

    let transformedValue;
    switch (question.QuestionType.id) {
      case 4: // checkbox
        transformedValue = value
          .map(
            (val) =>
              question.QuestionOptions.find((opt) => opt.value === val)?.id
          )
          .filter(Boolean);
        break;
      case 5: // single_choice
        transformedValue = question.QuestionOptions.find(
          (opt) => opt.value === value
        )?.id;
        break;
      default:
        transformedValue = value;
    }

    return {
      question_id: questionId,
      value: transformedValue,
    };
  });
};

export default transformAnswerValue;
