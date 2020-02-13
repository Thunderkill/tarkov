import {
  PROD_ENDPOINT,
  UNITY_VERSION,
  LAUNCHER_ENDPOINT,
  Versions,
  TRADING_ENDPOINT,
  RAGFAIR_ENDPOINT
} from "./lib/globals";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import generate_hwid from "./lib/hwid";
import * as pako from "pako";
import Auth from "./lib/auth";
import {
  ApiError,
  NotAuthorizedError,
  TwoFactorRequiredError,
  BadTwoFactorCodeError,
  CaptchaRequiredError,
  RateLimitedError
} from "./apiErrors";
import Profile from "./lib/profile";
import {
  InvalidUserIdError,
  BadLoginError,
  InvalidParametersError,
  InvalidBarterItemsError,
  InMaintenanceError,
  BackendError,
  MaxOfferCountError,
  OfferNotFoundError,
  BadLoyaltyLevelError,
  OfferNotAvailableYetError,
  TransactionError,
  RagfairError
} from "./ragFairErrors";

/**
 * ### Unofficial Tarkov API
 * @class
 * @memberof Exports
 */

class Tarkov {
  launcherClient: AxiosInstance;
  gameClient: AxiosInstance;
  hwid: string;
  session: string;
  authInstance: Auth;
  constructor(authInstance: Auth, hwid: string, session: string) {
    this.launcherClient = authInstance.client;
    this.authInstance = authInstance;
    this.gameClient = Axios.create({
      headers: {
        "User-Agent": `UnityPlayer/${UNITY_VERSION} (UnityWebRequest/1.0, libcurl/7.52.0-DEV)`,
        "App-Version": `EFT Client ${Versions.GAME}`,
        "X-Unity-Version": UNITY_VERSION,
        Cookie: `PHPSESSID=${session}`
      }
    });
    this.hwid = hwid;
    this.session = session;
  }
  /**
   * Checks if the library is using the right launcher version.
   * If not it will update the version for this session.
   */
  async checkLauncherVersion() {
    let msg = "Serious error. Contant creator.";
    let url = `https://${LAUNCHER_ENDPOINT}/launcher/GetLauncherDistrib`;
    let res = await this.authInstance.post_json(url, {});
    if (!res.data.Version) msg = "Issues while fetching launcherVersion...";
    else if (res.data.Version) {
      if (res.data.Version !== Versions.LAUNCHER) {
        // Launcher is not up-to-date, update global param.
        Versions.LAUNCHER = res.data.Version;
        msg = `Launcher updated to version: ${Versions.LAUNCHER}`;
      } else {
        msg = `Launcher is up-to-date on version: ${Versions.LAUNCHER}`;
      }
    }
    return msg;
  }

  /**
   * Checks if the library is using the right game version.
   * If not it will update the version for this session.
   */
  async checkGameVersion() {
    let msg = "Serious error. Contact creator";
    let url = `https://${LAUNCHER_ENDPOINT}/launcher/GetPatchList?launcherVersion=${Versions.LAUNCHER}&branch=live`;
    let res = await this.authInstance.post_json(url, {});
    if (!res.data[0].Version) msg = "Issues while fetching gameVersion...";
    else if (res.data[0].Version) {
      if (res.data[0].Version !== Versions.GAME) {
        // Game is not up-to-date, update global param.
        Versions.GAME = res.data[0].Version;
        msg = `Game updated to version: ${Versions.GAME}`;
      } else {
        msg = `Game is up-to-date on version: ${Versions.GAME}`;
      }
    }
    return msg;
  }

  static createLauncherClientInstance(): AxiosInstance {
    const client = Axios.create({
      headers: {
        "User-Agent": `BSG Launcher ${Versions.LAUNCHER}`,
        Host: PROD_ENDPOINT
      }
    });

    return client;
  }

  /**
   * Login with email and password.
   * @param {String} email user email
   * @param {String} password password
   * @param {String} hwid hardware id (#1-XXXXXXXXXX...)
   */

  static async login(email: string, password: string, hwid: string) {
    try {
      const client = Tarkov.createLauncherClientInstance();
      const authInstance = new Auth(client);

      let user = await authInstance.login(email, password, hwid);
      let session = await authInstance.exchange_access_token(
        user.access_token,
        hwid
      );
      return new Tarkov(authInstance, hwid.toString(), session.session);
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * Login with a Bearer token.
   * @param {String} access_token
   * @param {String} hwid
   */

  static async from_access_token(access_token: string, hwid: string) {
    try {
      const client = Tarkov.createLauncherClientInstance();
      const authInstance = new Auth(client);
      let session = await authInstance.exchange_access_token(
        access_token,
        hwid
      );
      return new Tarkov(authInstance, hwid.toString(), session.session);
    } catch (err) {
      console.log(err);
    }
  }

  /* TODO: Fix res.data */
  /**
   * Gets users all profiles. Should containt array [scav, pmc]
   * @returns {Promise<Profile[]>} Array of profiles
   */
  async get_profiles() {
    let url = `https://${PROD_ENDPOINT}/client/game/profile/list`;
    let profiles = await this.post_json<Profile[]>(url, {});
    return profiles;
  }

  /**
   * Select profile id.
   * @param user_id profile id
   */
  async select_profile(user_id: string) {
    try {
      if (!user_id) return Error("Invalid or empty profile ID");
      let url = `https://${PROD_ENDPOINT}/client/game/profile/select`;
      await this.post_json(url, { uid: user_id }); // TraderResponse
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Get a list of all traders.
   * @returns {Promise<Trader[]>} Array of traders
   */
  async get_traders() {
    try {
      let url = `https://${TRADING_ENDPOINT}/client/trading/api/getTradersList`;
      let traders = await this.post_json<Trader[]>(url, {}); // TradersResponse <Array>
      return traders;
    } catch (error) {
      console.log(error.message);
      return new Error(error.message);
    }
  }

  /**
   * Get a trader by their ID.
   *
   * ### Example of getting english tranlations for trader
   * ```
   * // Get english strings
   * let locale = await t.get_i18n("en");
   * // Get traders
   * let traders = await t.get_traders();
   * // Get traders Fence information
   * let trader = traders.find(t => locale.trading[t.id].Nickname == "Fence");
   * ```
   */
  async get_trader(trader_id: string) {
    if (!trader_id) return Error("Invalid or empty trader ID");
    let url = `https://${TRADING_ENDPOINT}/client/trading/api/getTrader/${trader_id}`;
    let trader = await this.post_json<Trader>(url, {}); // TraderResponse
    return trader;
  }

  /**
   * Get localization table. Pass a valid ISO 639-1 language code.
   * @param language - Valid ISO 639-1 language code.
   */
  async get_i18n(language: string) {
    if (!language) return Error("Invalid or empty language");
    let url = `https://${PROD_ENDPOINT}/client/locale/${language}`;
    let localization = await this.post_json<Localization>(url, {});
    return localization;
  }

  /**
   * Get current forecast and time.
   */
  async get_weather() {
    return await this.post_json<WeatherData>(
      `https://${PROD_ENDPOINT}/client/weather`,
      {}
    );
  }

  /**
   * Gets all items.
   */
  async get_items() {
    try {
      let url = `https://${PROD_ENDPOINT}/client/items`;
      let items = await this.post_json<Item[]>(url, { crc: 0 });
      return items;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Number} page - starting page, ex. start searching from page 0.
   * @param {Number} limit - limit how many results to show. Ex 15.
   * @param {Object} filter - Market Filter
   * @param {Number} filter.sort_type - Sort by: ID = 0, Barter = 2, Mechant Rating = 3, Price = 5, Expiry = 6
   */
  async search_market(
    page: number,
    limit: number,
    filter: MarketFilter
  ): Promise<SearchResult> {
    try {
      if (limit == 0) throw Error("Invalid filter");
      let url = `https://${RAGFAIR_ENDPOINT}/client/ragfair/find`;
      let body = {
        page: page,
        limit: limit,
        sortType: filter.sort_type || 5,
        sortDirection: filter.sort_direction || 0,
        currency: filter.currency || 0, // 0=all, 1=rub, 2=usd, 3=eur
        priceFrom: filter.min_price || 0,
        priceTo: filter.max_price || 0,
        quantityFrom: filter.min_quantity || 0,
        quantityTo: filter.max_quantity || 0,
        conditionFrom: filter.min_condition || 0,
        conditionTo: filter.max_condition || 100,
        oneHourExpiration: filter.expiring_within_hour || false,
        removeBartering: filter.hide_bartering_offers || true,
        offerOwnerType: filter.owner_type || 0,
        onlyFunctional: filter.hide_inoperable_weapons || true,
        updateOfferCount: true,
        handbookId: filter.handbook_id || "",
        linkedSearchId: filter.linked_search_id || "",
        neededSearchId: filter.required_search_id || "",
        tm: 1
      };
      return await this.post_json<SearchResult>(url, body);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async buy_item(
    offer_id: string,
    quantity: number,
    barter_items: BarterItem[]
  ): Promise<InventoryUpdate> {
    if (quantity < 1 || barter_items.length === 0)
      throw new Error("Invalid params");
    let url = `https://${PROD_ENDPOINT}/client/game/profile/items/moving`;
    let body = {
      data: [
        {
          Action: "RagFairBuyOffer",
          offers: [
            {
              id: offer_id,
              count: quantity,
              items: barter_items
            }
          ]
        }
      ],
      tm: 2
    };
    return await this.post_json_ragfair(url, body);
  }

  async sell_item(trader_id: string, item_id: string, quantity: number) {
    if (quantity < 1) throw new Error("Invalid params");
    let url = `https://${PROD_ENDPOINT}/client/game/profile/items/moving`;
    let body = {
      data: [
        {
          Action: "TradingConfirm",
          type: "sell_to_trader",
          tid: trader_id,
          items: [
            {
              id: item_id,
              count: quantity,
              scheme_id: 0
            }
          ]
        }
      ],
      tm: 0
    };
    return await this.post_json_ragfair(url, body);
  }

  /**
   * Put item on flea market.
   * @param {Array} items - Array of items ids from your inventory you want to sell. (Need to be same items)
   * @param {Object} requirements - Object with sell info {_tlp: items _tlp, price: sellprice}
   * @param {String} requirement._tpl - Items schema id. Also known _tpl. Ex. Rouble_id
   * @param {String} requirement.price - On what price you want to sell.
   * @param {Boolean} sell_all - Sell all in one piece. Default false
   */
  async offer_item(
    items: string[],
    requirements: SellRequirement[],
    sell_all?: boolean
  ) {
    if (!items || !requirements || requirements.length === 0)
      throw new Error("Invalid params");
    let url = `https://${PROD_ENDPOINT}/client/game/profile/items/moving`;

    let data: SellItemRequest = {
      Action: "RagFairAddOffer",
      sellInOnePiece: sell_all ?? false,
      items, // Array of item_ids
      requirements
    };

    let body = {
      data: [data],
      tm: 2
    };

    return await this.post_json_ragfair(url, body);
  }

  /* TODO: Handle errors correctly, as there will be bunch of invalid moves. */
  /**
   * Will merge 2 items together.
   * ### Caution!! This functions has no error handling yet!
   * #### Example usage:
   * - merge stack of roubles to another stack of roubles.
   * - merge stack of bullets to another stack of bullets.
   * @param from_item_id the item we will move
   * @param to_item_id the item id where we merge(stack)
   */
  async stack_item(from_item_id: string, to_item_id: string) {
    let url = `https://${PROD_ENDPOINT}/client/game/profile/items/moving`;
    let body = {
      data: [
        {
          Action: "Merge",
          item: from_item_id,
          with: to_item_id
        }
      ],
      tm: 2
    };
    await this.post_json(url, body);
  }

  /**
   * Move item in inventory.
   * @param {String} item_id - the item id what we want to move.
   * @param {Object} destination - info where to move. {id, container, location:{x,y,r} }
   * @param {String} destination.id - item id where we move
   * @param {String} destination.container - 'main' if its container, else 'hideout' = stash
   * @param {Object} destination.location - {x, y, r} x & y locations, topleft is 0,0. r = 0 or 1.
   * @returns {boolean} returns true if successfull
   */
  async move_item(
    item_id: string,
    destination: {
      id: string;
      container: string;
      location: { x: number; y: number; r: number };
    }
  ) {
    let url = `https://${PROD_ENDPOINT}/client/game/profile/items/moving`;
    let body = {
      data: [
        {
          Action: "Move",
          item: item_id,
          to: {
            id: destination.id,
            container: destination.container || "main", // main = container, hideout = stash
            location: destination.location || { x: 0, y: 0, r: 0 } // try to put to topleft if empty
          }
        }
      ],
      tm: 2
    };
    await this.post_json(url, body);
  }

  /**
   * Send JSON to EFT Server
   * @param {*} this
   * @param {String} url path were the request should be sent
   * @param {Object} body data to send
   * @private
   */

  async post_json<T>(url: string, data: any): Promise<T> {
    let response = await this.gameClient.post<ApiResponse<T>>(url, data, {
      transformResponse: [
        function(data) {
          return JSON.parse(pako.inflate(data, { to: "string" }));
        }
      ]
    });

    handle_errors(response.data);

    return response.data.data as T;
  }

  async post_json_ragfair(url: string, data: any): Promise<InventoryUpdate> {
    let response = await this.gameClient.post<RagfairResponseData>(url, data, {
      transformResponse: [
        function(data) {
          return JSON.parse(pako.inflate(data, { to: "string" }));
        }
      ]
    });

    handle_errors_ragfair(response.data);

    return response.data.items;
  }

  /**
   * Keep the current session alive. Session expires after x seconds of idling.
   */
  async keep_alive() {
    await this.post_json(`https://${PROD_ENDPOINT}/client/game/keepalive`, {});
  }
}

function handle_errors<T>({ error, errormsg }: ApiResponse<T>) {
  if (error > 0) throw new ApiError();
}

function handle_errors_ragfair<T>({ badRequest }: RagfairResponseData) {
  if (!badRequest || badRequest.length === 0) return;

  for (const error of badRequest) {
    switch (error.error) {
      case 201:
        throw new NotAuthorizedError();
      case 205:
        throw new InvalidUserIdError();
      case 206:
        throw new BadLoginError();
      case 207:
        throw new InvalidParametersError();
      case 209:
        throw new TwoFactorRequiredError();
      case 211:
        throw new BadTwoFactorCodeError();
      case 214:
        throw new CaptchaRequiredError();
      case 228:
        throw new InvalidBarterItemsError();
      case 230:
        throw new RateLimitedError();
      case 263:
        throw new InMaintenanceError();
      case 1000:
        throw new BackendError();
      case 1501:
        throw new MaxOfferCountError();
      case 1502:
        throw new InvalidBarterItemsError();
      case 1507:
        throw new OfferNotFoundError();
      case 1510:
        throw new BadLoyaltyLevelError();
      case 1512:
        throw new OfferNotAvailableYetError();
      case 1514:
        throw new TransactionError();
      default:
        throw new RagfairError(error.errormsg);
    }
  }
}

export { Tarkov, generate_hwid };
