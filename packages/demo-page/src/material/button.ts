import { CMaterialType } from '@chamn/model';

export const ButtonMeta: CMaterialType = {
  title: 'Button',
  componentName: 'Button',
  npm: {
    package: '@chamn/mock-material',
    exportName: 'Button',
    version: '1.0.0',
  },
  icon: 'https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_button.png',
  props: [
    {
      name: 'type',
      title: '按钮类型',
      valueType: 'string',
      setters: [
        {
          componentName: 'SelectSetter',
          props: {
            options: [
              {
                value: 'primary',
                label: 'primary',
              },
              {
                value: 'link',
                label: 'link',
              },
              {
                value: '',
                label: 'Default',
              },
            ],
          },
        },
      ],
    },
    {
      name: 'block',
      title: '块状按钮',
      valueType: 'boolean',
      setters: ['BooleanSetter'],
      condition: (state) => {
        if (state.type === 'primary') {
          return true;
        }
        return false;
      },
    },
    {
      name: 'children',
      title: '文本',
      valueType: 'string',
      setters: ['StringSetter', 'ExpressionSetter'],
    },
    {
      name: 'onClick',
      title: '点击时',
      valueType: 'function',
      setters: ['FunctionSetter', 'ExpressionSetter'],
    },
    {
      name: 'text1',
      title: '联动文本1',
      valueType: 'string',
      setters: [
        {
          componentName: 'StringSetter',
        },
      ],
      condition: (state) => {
        if (state.type === 'primary1') {
          return true;
        }
        return false;
      },
    },
    {
      name: 'text2',
      title: '联动文本2',
      valueType: 'string',
      setters: [
        {
          componentName: 'StringSetter',
        },
      ],
      condition: (state) => {
        if (state.text1 === '1') {
          return true;
        }
        return false;
      },
    },
    {
      name: 'text3',
      title: '联动文本3',
      valueType: 'string',
      setters: [
        {
          componentName: 'StringSetter',
        },
        'ExpressionSetter',
      ],
    },
  ],
  advanceCustom: {
    onDrag: async () => {
      console.log('onDrag');
      return true;
    },
    onDragging: async () => {
      console.log('onDragging');
    },
    onDrop: async () => {
      console.log('onDrop');
      return true;
    },
    onSelect: async () => {
      console.log('onSelect');
      return true;
    },
    onDelete: async () => {
      console.log('onDelete');
      return true;
    },
  },
  snippets: [
    {
      title: '基础按钮',
      snapshot:
        'https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_button.png',
      description:
        '我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件,我是 antd 的 Button 组件',
      schema: {
        props: {
          type: 'primary',
        },
        children: ['I am a Button'],
      },
    },
  ],
};
