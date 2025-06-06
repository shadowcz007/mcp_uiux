import React, { useEffect, useState } from 'react';
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import { SharpDark } from "survey-core/themes";
import 'survey-core/survey-core.min.css';
// 将 JSON Schema 转换为 SurveyJS 元素
const convertSchemaToSurveyElement = (schema: any, name: string = '', title: string = ''): any => {
  if (!schema) return null;

  // 使用传入的名称或生成一个默认名称
  const elementName = name || 'field_' + Math.random().toString(36).substr(2, 9);
  // 使用传入的标题或将名称转换为更可读的形式
  const elementTitle = title || name?.replace(/_/g, ' ') || elementName;

  switch (schema.type) {
    case 'string':
      return {
        type: 'text',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'number':
    case 'integer':
      return {
        type: 'text',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'boolean':
      return {
        type: 'boolean',
        name: elementName,
        title: elementTitle,
        isRequired: schema.required || false
      };

    case 'array':
      if (schema.items.type === 'string' || schema.items.type === 'number' || schema.items.type === 'integer') {
        return {
          type: 'matrixdynamic',
          name: elementName,
          title: elementTitle,
          columns: [
            {
              cellType: schema.items.type === 'number' || schema.items.type === 'integer' ? 'number' : 'text',
              name: "value",
              title: ' '
            }
          ],
          rowCount: 1,
          minRowCount: 0,
          addRowText: `添加${elementTitle}`,
          removeRowText: '删除',
          isRequired: schema.required || false,
          showHeader: false,
          confirmDelete: false,
          description: schema.description || ''
        };
      } else if (schema.items.type === 'object') {
        // 处理对象数组
        const objectProperties = schema.items.properties || {};
        const columns = Object.entries(objectProperties).map(([propName, propSchema]: [string, any]) => ({
          name: propName,
          title: propName,
          cellType: propSchema.type === 'number' || propSchema.type === 'integer' ? 'number' : 'text'
        }));

        return {
          type: 'matrixdynamic',
          name: elementName,
          title: elementTitle,
          columns: columns.length > 0 ? columns : [
            {
              name: "key",
              title: "键",
              cellType: "text"
            },
            {
              name: "value",
              title: "值",
              cellType: "text"
            }
          ],
          rowCount: 1,
          minRowCount: 0,
          addRowText: `添加${elementTitle}`,
          removeRowText: '删除',
          isRequired: schema.required || false,
          showHeader: true,
          confirmDelete: false,
          description: schema.description || ''
        };
      } else {
        // 复杂类型的数组保持原来的 paneldynamic 处理方式
        return {
          type: 'paneldynamic',
          name: elementName,
          title: elementTitle,
          templateElements: [convertSchemaToSurveyElement(schema.items, 'item')],
          panelCount: 1,
          minPanelCount: 1,
          addPanelText: `添加${elementTitle}`,
          removePanelText: '删除',
          isRequired: schema.required || false
        };
      }

    case 'object':
      const elements = Object.entries(schema.properties || {}).map(([propName, propSchema]: [string, any]) =>
        convertSchemaToSurveyElement(propSchema, propName)
      ).filter(Boolean);

      if (name) {
        // 如果是嵌套对象，使用 panel
        return {
          type: 'panel',
          name: elementName,
          title: elementTitle,
          elements: elements,
          isRequired: schema.required || false
        };
      } else {
        // 如果是根对象，直接返回元素数组
        return elements;
      }

    default:
      console.warn(`Unsupported schema type: ${schema.type}`);
      return null;
  }
};

// 将工具参数转换为SurveyJS格式
const mapToolParamsToSurveyJson = (tool: any) => {
  if (!tool || !tool.inputSchema) return { elements: [] };

  // console.log('tool.inputSchema', tool.inputSchema);

  // 检查是否为空对象 schema
  if (tool.inputSchema.type === 'object' &&
    (!tool.inputSchema.properties || Object.keys(tool.inputSchema.properties).length === 0)) {
    return {
      elements: [{
        type: 'text',
        name: '_',
        title: '_',
        isRequired: false
      }],
      showQuestionNumbers: false,
      showNavigationButtons: true,
      completeText: "执行",
      pageNextText: "下一步",
      pagePrevText: "上一步"
    };
  }

  const elements = convertSchemaToSurveyElement(tool.inputSchema);

  return {
    elements: Array.isArray(elements) ? elements : [elements],
    showQuestionNumbers: false,
    completeText: "执行",
    pageNextText: "下一步",
    pagePrevText: "上一步"
  };
};

// 工具表单组件
const InputSchemaForm = ({ tool, onComplete }: any) => {
  const [survey, setSurvey] = useState(null);
  console.log('InputSchemaForm', tool);
  useEffect(() => {
    if (!tool) return;

    const surveyJson = mapToolParamsToSurveyJson(tool);

    const surveyModel: any = new Model(surveyJson);

    // 设置完成事件
    surveyModel.onComplete.add(async (sender: any) => {
      if (onComplete) {
        const data: any = { ...sender.data };

        // 处理数组格式
        if (tool.inputSchema && tool.inputSchema.type === 'object' && tool.inputSchema.properties) {
          Object.entries(tool.inputSchema.properties).forEach(([key, prop]: [string, any]) => {
            if (prop.type === 'array' &&
              (prop.items.type === 'string' || prop.items.type === 'number' || prop.items.type === 'integer') &&
              Array.isArray(data[key])) {
              // 将 [{value: 'a'}, {value: 'b'}] 转换为 ['a', 'b']
              data[key] = data[key].map((item: any) => item.value);
            }
            if (prop.type === 'object') {
              Object.entries(prop.properties).forEach(([key, prop]: [string, any]) => {

              })
            }
            if (prop.type === 'array' &&
              prop.items.type === 'object' &&
              Array.isArray(data[key])) {
              // console.log('object data[key]', data[key]);
              data[key] = data[key].filter((item: any) => Object.keys(item).length > 0)
            }
            console.log('##inputSchema', key, prop, data[key]);
            if (prop.type === 'number' || prop.type === 'integer') {
              data[key] = Number(data[key])
            }

          });
        }
        setSurvey(null)
        // console.log('sender.data',surveyJson, data);
        let result = await tool.execute(data, 15 * 60000);
        if (Array.isArray(result) && result[0]?.type === 'text') {
          result = result.map((item: any) => {
            if (item.type == 'text') {
              let json = null;
              try {
                json = JSON.parse(item.text);
              } catch (error) {
                console.log(error)
              }
              if (json) {
                item.type = 'json';
                item.json = json;
                delete item.text
              }
            }
            return {
              ...item
            }
          })
        }
        onComplete({
          input: data,
          output: result
        });
      }
    });

    surveyModel.applyTheme(SharpDark);
    // 设置 CSS 变量
    // surveyModel.cssVariables = {
    //   '--sjs-primary-backcolor': '#0a0a1f', // 主色调
    //   '--sjs-font-size': '16px', // 字体大小
    //   '--sjs-border-radius': '8px', // 圆角
    // };

    setSurvey(surveyModel);
  }, [tool, onComplete]);

  if (!survey) return null;

  return <Survey model={survey}
    rootNodeClassName="mcp-uiux-input-schema-form"
  />;
};

export default InputSchemaForm;