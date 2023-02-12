/* eslint-disable @typescript-eslint/no-empty-function */
import { CPage } from '@chameleon/model';
import React from 'react';
import { DesignerExports } from '../../../Designer';
import { TreeNodeData } from './dataStruct';
export enum DragState {
  DRAGGING = 'DRAGGING',
  NORMAL = 'NORMAL',
}
export type ContextState = {
  treeData: TreeNodeData[];
  currentSelectNodeKeys: string[];
  expandKeys: string[];
  multiSelect: boolean;
  dragState: DragState;
  pageModel: CPage | null;
  designerHandler: DesignerExports | null;
};

export type CTreeContextData = {
  state: ContextState;
  updateState: (state: Partial<ContextState>) => void;
  onSelectNode: (params: { keys: string[]; node: TreeNodeData }) => void;
};

export const CTreeContext = React.createContext<CTreeContextData>({
  state: {
    treeData: [],
    currentSelectNodeKeys: [],
    expandKeys: [],
    multiSelect: false,
    dragState: DragState.NORMAL,
    pageModel: null,
    designerHandler: null,
  },
  updateState: () => {},
  onSelectNode: () => {},
});
