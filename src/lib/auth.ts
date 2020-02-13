import { Md5 } from "ts-md5/dist/md5";
import {
  LAUNCHER_ENDPOINT,
  PROD_ENDPOINT,
  Versions,
} from "./globals";
import { AxiosInstance, AxiosResponse } from "axios";
import * as pako from "pako";
import {
  NotAuthorizedError,
  MissingParametersError,
  TwoFactorRequiredError,
  BadTwoFactorCodeError,
  CaptchaRequiredError,
  ApiError
} from "../apiErrors";

interface AuthOptions {
  aid?: string;
  lang?: string;
  region?: string;
  gameVersion?: string;
  dataCenters?: string;
  ipRegion?: string;
  token_type: string;
  expires_in?: number;
  access_token?: string;
  refresh_token?: string;
}

/**
 * Auth class, used for login.
 * @private
 */
export default class Auth {

  client: AxiosInstance;
  constructor(client: AxiosInstance, options?: AuthOptions) {
    this.client = client;
  }
  /**
   * Login with email & password. Return new Auth.
   * @param {Client} client
   * @param {String} email
   * @param {String} password
   * @param {String} captcha
   * @param {String} hwid
   */
  async login(email: string, password: string, hwid: string, captcha?: string): Promise<AuthResponse> {
    try {
      const md5pass = Md5.hashStr(password) as string;
      const body = new LoginRequest(email, md5pass, hwid, captcha);
      const url = `https://${LAUNCHER_ENDPOINT}/launcher/login?launcherVersion=${Versions.LAUNCHER}&branch=live`;
      const res = await this.post_json(url, body);
      // Check if response was successful
      const loginResponse = new LoginResponse(res);
      // Custom errors
      handle_auth_error(loginResponse);
      // Return Auth
      return loginResponse.data;
    } catch (err) {
      throw err;
    }
  }

  async exchange_access_token(access_token: string, hwid: string): Promise<Session> {
    try {
      const response = await this.client.post<
        any,
        AxiosResponse<ExchangeResponse>
      >(
        `https://${PROD_ENDPOINT}/launcher/game/start?launcherVersion=${Versions.LAUNCHER}&branch=live`,
        {
          version: {
            major: Versions.GAME,
            game: "live",
            backend: "6"
          },
          hwCode: hwid
        },
        {
          headers: {
            Authorization: access_token,
            "Accept-Encoding": "gzip"
          },
          responseType: "json",
          transformResponse: [
            function(data) {
              return JSON.parse(pako.inflate(data, { to: "string" }));
            }
          ]
        }
      );
      // Custom errors
      handle_auth_error(response.data);
      // Return session
      return new Session(response.data.data);
    } catch (err) {
      console.log("[E_A_T]", new Date(), err.message);
      throw err;
    }
  }

  async post_json(url: string, req_body: any) {
    try {
      let response = await this.client.post(url, req_body, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip"
        },
        responseType: "json",
        transformResponse: [
          function(data) {
            return JSON.parse(pako.inflate(data, { to: "string" }));
          }
        ]
      });
      return response.data;
    } catch (err) {
      console.log("[POST_JSON]", new Date(), err.message);
    }
  }
}

//======================

function handle_auth_error({ error, errormsg }: ExchangeResponse | LoginResponse) {
  if (isNaN(error) || error === 0) return;
  switch (error) {
    case 201:
      throw new NotAuthorizedError(errormsg);
    case 207:
      throw new MissingParametersError(errormsg);
    case 209:
      throw new TwoFactorRequiredError(errormsg);
    case 211:
      throw new BadTwoFactorCodeError(errormsg);
    case 214:
      throw new CaptchaRequiredError(errormsg);
    default:
      throw new ApiError(`${error}: ${errormsg}`);
  }
}

/**
 * @private
 */
class LoginRequest {
  email: string;
  pass: string;
  hwCode: string;
  captcha?: string;
  constructor(email: string, pass: string, hwCode: string, captcha?: string) {
    this.email = email;
    this.pass = pass;
    this.hwCode = hwCode;
    this.captcha = undefined; // NOT IN USE ATM
  }
}
/**
 * @private
 */
class LoginResponse {
  error: number;
  errormsg: string;
  data: AuthResponse;
  /**
   * Response from exchange token request
   * @param {Object} obj response object
   * @param {Error} obj.error response error
   * @param {Object} obj.data response data
   */
  constructor({ error, data, errormsg }: LoginResponse) {
    this.error = error;
    this.data = data;
    this.errormsg = errormsg;
  }
}

class SecurityLoginRequest {
  email: string;
  hwCode: string;
  activate_code: string;
  constructor(email: string, hwCode: string, activate_code: string) {
    this.email = email;
    this.hwCode = hwCode;
    this.activate_code = activate_code;
  }
}

class ExchangeRequest {
  version: number;
  hwCode: string;
  constructor(version: number, hwCode: string) {
    this.version = version;
    this.hwCode = hwCode;
  }
}

class ExchangeVersion {
  major: number;
  game: number;
  backend: number;
  constructor(major: number, game: number, backend: number) {
    this.major = major;
    this.game = game;
    this.backend = backend;
  }
}

/**
 * @private
 */
class ExchangeResponse {
  error: number;
  errormsg: string;
  data: Session;
  /**
   * Response from exchange token request
   * @param {Object} obj response object
   * @param {Error} obj.error response error
   * @param {Object} obj.data response data
   */
  constructor({ error, data, errormsg }: ExchangeResponse) {
    this.error = error;
    this.data = new Session(data);
    this.errormsg = errormsg;
  }
}

/**
 * @private
 */
class Session {
  queued: boolean;
  session: string;
  /**
   * Authenticated user session.
   * @param {Object} obj
   * @param {Boolean} obj.queued is the person queued
   * @param {String} obj.session session id
   */
  constructor({ queued, session }: Session) {
    this.queued = queued;
    this.session = session;
  }
}

class AuthResponse {
  aid: string;
  lang: string;
  region: string;
  gameVersion: string;
  dataCenters: string;
  ipRegion: string;
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  constructor(response: AuthResponse) {
    this.aid = response.aid;
    this.lang = response.lang;
    this.region = response.region;
    this.gameVersion = response.gameVersion;
    this.dataCenters = response.dataCenters;
    this.ipRegion = response.ipRegion;
    this.token_type = response.token_type;
    this.expires_in = response.expires_in;
    this.access_token = response.access_token;
    this.refresh_token = response.refresh_token;
  }
}