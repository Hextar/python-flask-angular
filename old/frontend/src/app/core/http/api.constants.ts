export const USER_ID_REPLACE = '{user_id}';
export const MONITORING_ID_REPLACE = '{monitoring_id}';
export const SENTIMENT_PAGE_REPLACE = '{page}';

export const AVATAR_IO_TW = 'https://avatars.io/twitter/';

export const enum EP_PATHS {
  /// PLANS
  PLANS_GET = 'plans',
  PLANS_POST = 'plans',
  PLANS_PUT = 'plans',

  /// MONITORINGS
  MONITORINGS_POST = 'monitorings',
  MONITORINGS_DASHBOARD = 'monitorings/dashboard',
  MONITORINGS_KEYWORDS_ESTIMATION = 'monitorings/keywords_estimation',
  MONITORINGS_LIST = 'monitorings/dashboard',
  MONITORINGS_STOP_POST = 'monitorings/{monitoring_id}',
  MONITORINGS_ID_GET = 'monitorings/{monitoring_id}',
  MONITORINGS_ID_PUT = 'monitorings/{monitoring_id}',
  MONITORINGS_ID_DELETE = 'monitorings/{monitoring_id}',

  /// REPORTS
  REPORTS_GET = 'reports/{monitoring_id}',
  REPORTS_PPT_GET = 'reports/{monitoring_id}/ppts',
  REPORTS_SEARCH_POST = 'reports/{monitoring_id}/search',
  REPORTS_USER_TWEET = 'reports/{monitoring_id}/filter',
  REPORTS_ID_SENTIMENT_GET = 'reports/{monitoring_id}/sentiment/{page}',
  REPORTS_ID_SENTIMENT_STATS_GET = 'reports/{monitoring_id}/sentiment',
  REPORTS_REGEN_GET = 'reports/regen',
  REPORTS_REGEN_POST = 'reports/regen',
  REPORTS_REGEN_LIST = 'reports/regenlist',

  /// USERS
  USERS_POST = 'users',
  USERS_ID_ACTIVATION_POST = 'users/{user_id}/activations',
  USERS_ID_ACTIVATION_PUT = 'users/{user_id}/activations',
  USERS_LOGIN_POST = 'users/login',
  USERS_PASSWORD_PUT = 'users/passwords',
  USERS_TWITTER_AUTH_GET = 'users/twitter-auths',
  USERS_TWITTER_AUTH_POST = 'users/twitter-auths',
  USERS_FACEBOOK_AUTH_POST = 'users/facebook-auths',
  USERS_ID_GET = 'users/{user_id}',
  USERS_ID_POST = 'users/{user_id}',
  USERS_ID_CARDS_GET = 'users/{user_id}/cards',
  USERS_ID_CARDS_POST = 'users/{user_id}/cards',
  USERS_ID_CARDS_DELETE = 'users/{user_id}/cards',
  USERS_EMAIL_CHANGE_POST = 'users/{user_id}/email-change',

  ORDERS_GET = 'users/{user_id}/orders',

  TRENDING_TWEETS = 'users/{user_id}/tweet-trends',
  TRENDING_HASHTAGS = 'users/{user_id}/hash-trends',

  SUBSCRIBE_GET = 'users/{user_id}/subscriptions',
  SUBSCRIBE_POST = 'users/{user_id}/subscriptions',
  SUBSCRIBE_PUT = 'users/{user_id}/subscriptions',
  SUBSCRIBE_DELETE = 'users/{user_id}/subscriptions',

  TOKEN_REFRESH_POST = 'users/refresh-token',
}
