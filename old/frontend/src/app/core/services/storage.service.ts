import {Injectable} from '@angular/core';
import {AES, enc} from 'crypto-js';
import {Credentials} from '@app/core/models';
import {noop} from 'rxjs';
import {environment} from '@env/environment';
import {SocialCredentials, StorageCredentials} from '@app/core/services/storage.constants';

@Injectable()
export class StorageService {
  private KEY_PREPEND = 'istella-';
  private CREDENTIALS_KEY = this.KEY_PREPEND + 'credentials-session-29FJWZ';
  private SOCIAL_KEY = this.KEY_PREPEND + 'social-session-1AFR6OO';
  private USER_KEY = this.KEY_PREPEND + 'user-session-L2VH9K';
  private RESET_KEY = this.KEY_PREPEND + 'reset-session-8443W2';
  private CREATE_EVENT = this.KEY_PREPEND + 'create-monitoring-session-UVYQH6';
  private SALT = 'eThWmZq4t7w!z%C&F)J@NcRfUjXn2r5u';

  private _storage_credentials: StorageCredentials = null;
  private _storage_social: SocialCredentials = null;
  private ENCRYPT_CREDENTIALS = !!environment.dev && !environment.dev;
  private ENCRYPT_SOCIAL = !!environment.dev && !environment.dev;

  constructor() {
    this._storage_credentials = this.getDataFromStorage(this.CREDENTIALS_KEY);
    this._storage_social = this.getDataFromStorage(this.SOCIAL_KEY);
  }

  /**
   * @method setDataInStorage()
   * @desc used to set data in local storage using localStorageService.
   * @param key :string .
   * @param value :string .
   * @param localStorageConnect: boolean, true is use localstorage for storage.
   */
  setDataInStorage(key: string, value: any, localStorageConnect?: boolean): any {
    const storage = localStorageConnect ? localStorage : sessionStorage;
    storage.setItem(key, JSON.stringify(value));
  }

  /**
   * @method getDataFromStorage()
   * @desc used to get data from local storage using localStorageService.
   * @param key :string .
   */
  getDataFromStorage(key: string): any {
    let data = sessionStorage.getItem(key) || localStorage.getItem(key);
    data = JSON.parse(data);
    return data;
  }

  /**
   * @method getDataFromStorage()
   * @desc used to get data from local storage using localStorageService.
   * @param key :string .
   */
  removeDataFromStorage(key: string): any {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

  /**
   * @method getSalt()
   * @desc used to get the private const SALT.
   * @return salt :string .
   */
  get salt() {
    return this.SALT;
  }

  /**
   * @method credentialsKey()
   * @desc used to get the private const SALT.
   * @return credentialsKey :string .
   */
  get credentialsKey() {
    return this.CREDENTIALS_KEY;
  }

  /**
   * @method socialKey()
   * @desc used to get the private const SALT.
   * @return socialKey :string .
   */
  get socialKey() {
    return this.SOCIAL_KEY;
  }

  /**
   * @method userKey()
   * @desc used to get the private const SALT.
   * @return userKey :string .
   */
  get userKey() {
    return this.USER_KEY;
  }

  /**
   * @method resetKey()
   * @desc used to get the private const SALT.
   * @return resetKey :string .
   */
  get resetKey() {
    return this.RESET_KEY;
  }

  /**
   * @method createEventKey()
   * @desc used to get the private const SALT.
   * @return createEventKey :string .
   */
  get createEventKey() {
    return this.CREATE_EVENT;
  }

  clearCredentials() {
    this.removeDataFromStorage(this.CREDENTIALS_KEY);
    this._storage_credentials = null;
  }

  clearSocial() {
    this.removeDataFromStorage(this.SOCIAL_KEY);
    this._storage_social = null;
  }

  /**
   * Gets the userData credentials.
   * @return {Credentials} The userData credentials or null if the userData is not authenticated.
   */
  get credentials(): Credentials {
    if (this._storage_credentials) {
      return {
        access_token: this._get(this._storage_credentials.access_token, this.ENCRYPT_CREDENTIALS),
        refresh_token: this._get(this._storage_credentials.refresh_token, this.ENCRYPT_CREDENTIALS),
        user_id: this._get(this._storage_credentials.user_id, this.ENCRYPT_CREDENTIALS),
        company_id: this._get(this._storage_credentials.company_id, this.ENCRYPT_CREDENTIALS),
        username: this._get(this._storage_credentials.username, this.ENCRYPT_CREDENTIALS),
        login_type: this._get(this._storage_credentials.login_type, this.ENCRYPT_CREDENTIALS),
        status: this._get(this._storage_credentials.status, this.ENCRYPT_CREDENTIALS),
      };
    }
    return null;
  }

  /**
   * Sets the userData credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param encryptedCredentials The userData encrypted credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  setCredentials(credentials: StorageCredentials, remember?: boolean) {
    if (credentials) {
      const cred: StorageCredentials = {
        access_token: this._set(credentials.access_token, this.ENCRYPT_CREDENTIALS),
        refresh_token: this._set(credentials.refresh_token, this.ENCRYPT_CREDENTIALS),
        user_id: this._set(credentials.user_id, this.ENCRYPT_CREDENTIALS),
        company_id: this._set(credentials.company_id, this.ENCRYPT_CREDENTIALS),
        username: this._set(credentials.username, this.ENCRYPT_CREDENTIALS),
        login_type: this._set(credentials.login_type, this.ENCRYPT_CREDENTIALS)
      };
      credentials.status ? cred.status = this._set(credentials.status, this.ENCRYPT_CREDENTIALS) : noop();
      if (cred) {
        this._storage_credentials = cred;
        this.setDataInStorage(this.CREDENTIALS_KEY, cred, remember);
      }
    }
  }

  /**
   * Gets the twitter credentials.
   * @return {Credentials} The twitter credentials or null if the twitter is not authenticated.
   */
  get social(): SocialCredentials {
    if (this._storage_social) {
      return {
        twitterUid: this._get(this._storage_social.twitterUid, this.ENCRYPT_SOCIAL),
        facebookUid: this._get(this._storage_social.facebookUid, this.ENCRYPT_SOCIAL)
      };
    }
    return null;
  }

  /**
   * Sets the social credentials.
   * The social may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param encryptedCredentials The userData encrypted credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  setSocial(credentials: SocialCredentials, remember?: boolean) {
    const cred: SocialCredentials = {} as SocialCredentials;
    cred.twitterUid = credentials.twitterUid ? this._set(credentials.twitterUid, this.ENCRYPT_SOCIAL) : '';
    cred.facebookUid = credentials.facebookUid ? this._set(credentials.facebookUid, this.ENCRYPT_SOCIAL) : '';
    if (cred) {
      this._storage_social = cred;
      this.setDataInStorage(this.SOCIAL_KEY, cred, remember);
    }
  }

  private _get(x: any, e: boolean = false, n: boolean = false) {
    return (e) ? ((n) ? this._aes_dec_n(x) : this._aes_dec(x)) : x;
  }

  private _set(x: any, e: boolean = false) {
    return (e) ? this._aes_enc(x) : x;
  }

  private _aes_enc(s: string | number): string {
    return s ? AES.encrypt(s.toString(), this.SALT).toString() : '';
  }

  private _aes_dec(s: string): string {
    return s ? AES.decrypt(s, this.SALT).toString(enc.Utf8) : '';
  }

  private _aes_dec_n(s: string): number {
    return s ? Number(this._aes_dec(s)) : -1;
  }

}
