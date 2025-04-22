import React, { useEffect, useState } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { SharpDark } from "survey-core/themes";
import 'survey-core/survey-core.min.css';

// 将prompt参数转换为SurveyJS格式
const mapPromptArgsToSurveyJson = (prompt: any) => {
  if (!prompt || !prompt.arguments || !Array.isArray(prompt.arguments)) return { elements: [] };

  const elements = prompt.arguments.map((arg: any) => {
    return {
      type: 'text',
      name: arg.name,
      title: arg.description || arg.name,
      isRequired: arg.required || false,
      defaultValue: arg.default || ''
    };
  });

  return {
    elements: elements,
    showQuestionNumbers: false,
    completeText: "执行",
    pageNextText: "下一步",
    pagePrevText: "上一步"
  };
};

// Prompt参数表单组件
const PromptArgumentsForm = ({ prompt, onComplete }: any) => {
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    if (!prompt) return;

    const surveyJson = mapPromptArgsToSurveyJson(prompt);
    const surveyModel: any = new Model(surveyJson);

    // 设置完成事件
    surveyModel.onComplete.add(async (sender: any) => {
      if (onComplete) {
        const data: any = { ...sender.data };
        setSurvey(null);
        
        let result = await prompt.execute(data, 15*60000);
        if (Array.isArray(result) && result[0]?.type === 'text') {
          result = result.map((item: any) => {
            if (item.type === 'text') {
              let json = null;
              try {
                json = JSON.parse(item.text);
              } catch (error) {
                console.log(error);
              }
              if (json) {
                item.type = 'json';
                item.json = json;
                delete item.text;
              }
            }
            return {
              ...item
            };
          });
        }
        
        onComplete({
          input: data,
          output: result
        });
      }
    });

    surveyModel.applyTheme(SharpDark);
    setSurvey(surveyModel);
  }, [prompt, onComplete]);

  if (!survey) return null;

  return <Survey model={survey} rootNodeClassName="mcp-uiux-input-schema-form" />;
};

export default PromptArgumentsForm; 