export const CUSTOM_CELL_LOADING = '#@*LOADING*@#';

export enum CustomType {
  LOADING = 'loading',
  AVATAR = 'avatar',
  LABEL = 'value',
  LONG_TEXT = 'long-text',
  LABEL_LOADING = 'value-loading',
  TWO_ROWS = 'two-rows',
  THREE_ROWS = 'three-rows',
  CHECBOX = 'checkbox',
  ACTION = 'action',
  ACTION_LIST = 'action-list',
  ACTION_WITH_LABEL = 'action-with-label',
  PROGRESS_BAR = 'progress-bar',
  SPINNNER = 'spinner',
  SPINNNER_INDETERMINATE = 'spinner-indeterminate'
}

export interface CustomColumn {
  id: string;
  label?: string;
  title?: string;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  align?: string;
  wrap?: boolean;
  size?: number | string;
  sort?: boolean;
  type: CustomType;
}

export interface CustomTableAction {
  class?: string;
  value?: string;
  value2?: string;
  value3?: string;
  value4?: string;
  iconClass?: string;
  icon?: string;
  image?: string;
  disabled?: boolean;
  svgIcon?: string;
  label?: string;
  tooltip?: string;
  callback: string;
  type: CustomType;
}

export interface CustomCellContext {
  callback: string;
  index?: number;
  uid?: string;
}

export interface SortedTableData {
  uid: string;
  value: any;
}
