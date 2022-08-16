import { CMaterials } from '../../src/Material/index';
import {
  AdvanceDataType,
  BaseDataType,
  CMaterialType,
  ShapeDataType,
} from '../../src/types/material';

const mockMaterialData: any = {
  title: '测试物料组件',
  componentName: 'Header',
  version: '1.0.0',
  npm: {
    package: 'antd',
    version: '1.0.0',
    exportName: 'Button',
    destructuring: true,
  },
  props: [
    {
      name: 'text',
      title: '文本',
      defaultValue: '按钮',
      setters: ['StringSetter'],
      valueType: {
        type: AdvanceDataType.SHAPE,
        value: [
          {
            name: 'key1',
            valueType: {
              type: AdvanceDataType.SHAPE,
              value: [
                {
                  name: 'key2',
                  valueType: BaseDataType.STRING,
                },
              ],
            },
          },
        ],
      } as ShapeDataType,
    },
  ],
  snippets: {
    componentName: 'Button',
  },
};

describe('test page model', () => {
  it('new a page instance', () => {
    const node = new CMaterials([mockMaterialData]);
    expect(node).not.toBeNull();
  });
});
