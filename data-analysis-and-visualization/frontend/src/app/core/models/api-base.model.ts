import { resolveAny } from 'dns';

export interface ApiBaseObject {
  endpoint?: string;
  apiData?: object;
  tokenRequiredFlag?: boolean;
  alertHide?: boolean;
  forceReload?: boolean;
  applyWildcardInHeader?: boolean;
}

export interface ApiBaseResponse {
  result?: string;
  data?: any;
  message?: string;
}
