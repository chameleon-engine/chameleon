import React, { useEffect, useRef } from 'react';
import { CNode, CRootNode } from '@chamn/model';
import { CPluginCtx } from '../../core/pluginManager';
import { CRightPanelItem } from '../RightPanel/view';

import styles from './style.module.scss';
import { CustomSchemaForm, CustomSchemaFormInstance, CustomSchemaFormProps } from '../../component/CustomSchemaForm';

export const PropertyPanel = (props: { node: CNode | CRootNode; pluginCtx: CPluginCtx }) => {
  const { node } = props;
  const properties = node.material?.value.props || [];
  const formRef = useRef<CustomSchemaFormInstance>(null);

  useEffect(() => {
    const handel = () => {
      const newVal = node.getPlainProps?.() || {};
      formRef.current?.setFields(newVal);
    };
    handel();
    node.emitter.on('onNodeChange', handel);
    () => {
      node.emitter.off('onNodeChange', handel);
    };
  }, [node]);

  const value = node.getPlainProps?.() || {};

  const onValueChange: CustomSchemaFormProps['onValueChange'] = (val) => {
    node.updateValue({
      props: val,
    });
  };

  const onSetterChange: CustomSchemaFormProps['onSetterChange'] = (keyPaths, setterName) => {
    node.value.configure = node.value.configure || {};
    node.value.configure.propsSetter = node.value.configure.propsSetter || {};
    node.value.configure.propsSetter[keyPaths.join('.')] = {
      name: keyPaths.join('.'),
      setter: setterName,
    };
  };

  const customSetterMap = props.pluginCtx.config?.customPropertySetterMap;

  return (
    <div className={styles.CFromRenderBox}>
      <CustomSchemaForm
        pluginCtx={props.pluginCtx}
        key={node.id}
        defaultSetterConfig={node.value.configure.propsSetter || {}}
        onSetterChange={onSetterChange}
        properties={properties}
        initialValue={value}
        ref={formRef}
        customSetterMap={customSetterMap}
        onValueChange={onValueChange}
      />
    </div>
  );
};

export const PropertyPanelConfig: CRightPanelItem = {
  key: 'Property',
  name: 'Property',
  view: ({ node, pluginCtx }) => <PropertyPanel node={node} pluginCtx={pluginCtx} />,
};
