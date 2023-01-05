/// <reference types="react" />
import { CNode } from '@chameleon/model';
import { CPluginCtx } from '../../core/pluginManager';
import { CRightPanelItem } from '../RightPanel/view';
export declare const PropertyPanel: (props: {
    node: CNode;
    pluginCtx: CPluginCtx;
}) => JSX.Element;
export declare const PropertyPanelConfig: CRightPanelItem;
