export interface ApiBaseObject {
  endpoint?: string;
  apiData?: object;
  tokenRequiredFlag?: boolean;
  alertHide?: boolean;
  forceReload?: boolean;
  applyWildcardInHeader?: boolean;
}
