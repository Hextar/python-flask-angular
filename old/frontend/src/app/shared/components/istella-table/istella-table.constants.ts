export const SENTIMENT_LABELS = {
  POSITIVE: {
    value: 'positive',
    label: {
      singular: 'positivo',
      plural: 'positivi'
    }
  },
  NEUTRAL: {
    value: 'neutral',
    label: {
      singular: 'neutrale',
      plural: 'neutrali'
    }
  },
  NEGATIVE: {
    value: 'negative',
    label: {
      singular: 'negativo',
      plural: 'negativi'
    }
  },
  ALL: 'all'
};

export const ISTELLA_TABLE_LOADING = [{loading: '#@*LOADING*@#'}];
export const ISTELLA_CELL_LOADING = '#@*LOADING*@#';
export const ISTELLA_TABLE_PROGRESSBAR = 'istella-progressbar';

export enum IstellaType {
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
  SPINNNER_INDETERMINATE = 'spinner-indeterminate',
  SENTIMENT = 'sentiment'
}

export interface IstellaColumn {
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
  type: IstellaType;
}

export interface IstellaTableAction {
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
  type: IstellaType;
}

export interface IstellaContext {
  callback: string;
  index?: number;
  uid?: string;
}

export interface SortedTableData {
  uid: string;
  value: any;
}
