import React, { useContext, useState } from 'react';
import { SetterObjType } from '@chameleon/model';
import Setters from '../Setters/index';
import { CField, CFieldProps } from '../Form/Field';
import { Collapse, Dropdown, MenuProps } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { CCustomSchemaFormContext } from '../../context';

export type SetterSwitcherProps = {
  setters: SetterObjType[];
  keyPaths: string[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
} & Omit<CFieldProps, 'children'>;

export const SetterSwitcher = ({
  setters,
  keyPaths,
  condition,
  ...props
}: SetterSwitcherProps) => {
  const [visible, setVisible] = useState(true);
  const { onSetterChange, defaultSetterConfig } = useContext(
    CCustomSchemaFormContext
  );

  const [currentSetter, setCurrentSetter] = useState<SetterObjType | null>(
    () => {
      const currentSetterName =
        defaultSetterConfig[keyPaths.join('.')]?.setter || '';
      return (
        setters.find((el) => el.componentName === currentSetterName) ||
        setters[0]
      );
    }
  );

  let CurrentSetterComp = null;
  if (currentSetter?.componentName) {
    CurrentSetterComp = (Setters as any)[currentSetter?.componentName];
  }

  if (!CurrentSetterComp) {
    CurrentSetterComp = () =>
      (
        <div
          style={{
            backgroundColor: 'pink',
            margin: '5px 0',
            padding: '5px',
            borderRadius: '2px',
          }}
        >{`${currentSetter?.componentName} is not found.`}</div>
      ) as any;
  }

  const menuItems = setters.map((setter) => {
    const setterName = setter?.componentName || '';
    const setterRuntime = Setters[setterName];
    return {
      key: setter.componentName,
      label: setterRuntime?.setterName || setter.componentName,
    };
  });

  const onChooseSetter: MenuProps['onClick'] = ({ key }) => {
    const targetSetter = setters.find((setter) => setter.componentName === key);
    if (targetSetter) {
      setCurrentSetter(targetSetter);
      onSetterChange?.(keyPaths, targetSetter.componentName);
    }
  };

  let switcher: any = (
    <div
      className={styles.switchBtn}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Dropdown
        trigger={['click']}
        menu={{
          items: menuItems,
          onClick: onChooseSetter,
        }}
      >
        <SwapOutlined />
      </Dropdown>
    </div>
  );

  if (menuItems.length === 1) {
    switcher = null;
  }

  const setterProps = {
    ...(currentSetter?.props || {}),
  };

  const [collapseHeaderExt, setCollapseHeaderExt] = useState<any>([]);
  const conditionProps = {
    condition,
    onConditionValueChange: (val: boolean) => {
      setVisible(val);
    },
  };
  let bodyView: any = null;
  if (['ArraySetter'].includes(currentSetter?.componentName || '')) {
    bodyView = (
      <Collapse
        bordered={false}
        style={{
          marginBottom: '15px',
        }}
        // defaultActiveKey={[props.name]}
      >
        <Collapse.Panel
          header={
            <div className={styles.collapseHeader}>
              <span
                style={{
                  flex: 1,
                }}
              >
                {props.label}
              </span>
              {collapseHeaderExt}
              {switcher}
            </div>
          }
          key={props.name}
        >
          <CField {...props} noStyle {...conditionProps}>
            <CurrentSetterComp
              {...setterProps}
              keyPaths={[...keyPaths]}
              label={props.label}
              setCollapseHeaderExt={setCollapseHeaderExt}
            />
          </CField>
        </Collapse.Panel>
      </Collapse>
    );
  } else if (['ShapeSetter'].includes(currentSetter?.componentName || '')) {
    bodyView = (
      <div className={styles.shapeFieldBox}>
        {props.prefix ?? null}
        <Collapse
          bordered={false}
          // defaultActiveKey={[props.name]}
          style={{ flex: 1, marginTop: '-5px' }}
        >
          <Collapse.Panel
            header={
              <div className={styles.collapseHeader}>
                <span
                  style={{
                    flex: 1,
                  }}
                >
                  {props.label}
                </span>
                {switcher}
              </div>
            }
            key={props.name}
          >
            <CField {...props} noStyle {...conditionProps}>
              <CurrentSetterComp {...setterProps} keyPaths={[...keyPaths]} />
            </CField>
          </Collapse.Panel>
        </Collapse>
        {props.suffix ?? null}
      </div>
    );
  } else {
    bodyView = (
      <div
        style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px' }}
      >
        {props.prefix ?? null}
        <CField
          {...props}
          condition={condition}
          onConditionValueChange={(val) => {
            setVisible(val);
          }}
        >
          <CurrentSetterComp keyPaths={[...keyPaths]} {...setterProps} />
        </CField>
        {switcher}
        {props.suffix ?? null}
      </div>
    );
  }

  return <div style={{ display: visible ? 'block' : 'none' }}>{bodyView}</div>;
};
