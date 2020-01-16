export interface StorageCredentials {
  access_token?: string;
  refresh_token?: string;
  company_id?: string;
  user_id?: string;
  username?: string;
  login_type?: string;
  status?: string;
}

export interface SocialCredentials {
  facebookUid?: string;
  twitterUid?: string;
}
