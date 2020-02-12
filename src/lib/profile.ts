const rub_id = "5449016a4bdc2d6f028b456f";
const usd_id = "5696686a4bdc2da3298b456a";
const eur_id = "569668774bdc2da2298b4568";

/**
 * Tarkov profile
 * @param {*} options
 * @class
 * @hideconstructor
 */
export default class Profile {
  id: string;
  aid: number;
  savage?: string;
  info: PlayerInfo;
  customization: Customization;
  health: Health;
  inventory: Inventory;
  skills: Skills;
  stats: Stats;
  encyclopedia: Map<string, boolean>;
  conditionCounters: ConditionCounters;
  backendCounters: Map<string, BackendCounter>;
  insuredItems: InsuredItem[];
  hideout: any;
  notes: any;
  bonuses: Bonus[];
  quests: Quest[];
  ragfairInfo: Ragfair;
  traderStandings: any;
  wishlist: string[];

  constructor(profile: Profile) {
    this.id = profile.id;
    this.aid = profile.aid;
    this.savage = profile.savage;
    this.info = profile.info;
    this.customization = profile.customization;
    this.health = profile.health;
    this.inventory = profile.inventory;
    this.skills = profile.skills;
    this.stats = profile.stats;
    this.encyclopedia = profile.encyclopedia;
    this.conditionCounters = profile.conditionCounters;
    this.backendCounters = profile.backendCounters;
    this.insuredItems = profile.insuredItems;
    this.hideout = profile.hideout;
    this.notes = profile.notes;
    this.bonuses = profile.bonuses;
    this.quests = profile.quests;
    this.ragfairInfo = profile.ragfairInfo;
    this.traderStandings = profile.traderStandings;
    this.wishlist = profile.wishlist;
  }

  /**
   * Gets all roubles stacks from inventory.
   * @returns {Object} {amount: amount of roubles, stacks: [Array of items] }
   */
  async getRoubles() {
    let amount_of_roubles = 0;
    let stacks = this.inventory.items.filter(i => i._tpl === rub_id);

    stacks.forEach(stack => {
      if (stack.upd.StackObjectsCount)
        amount_of_roubles += stack.upd.StackObjectsCount;
    });

    return { amount: amount_of_roubles, stacks: stacks };
  };

  /**
   * Gets all dollars stacks from inventory.
   * @returns {Object} {amount: amount of dollars, stacks: [Array of items] }
   */
  async getDollars() {
    let amount_of_dollars = 0;
    let stacks = this.inventory.items.filter(i => i._tpl === usd_id);

    stacks.forEach(stack => {
      if (stack.upd.StackObjectsCount)
        amount_of_dollars += stack.upd.StackObjectsCount;
    });

    return { amount: amount_of_dollars, stacks: stacks };
  };

  /**
   * Gets all euros stacks from inventory.
   * @returns {Object} {amount: amount of euros, stacks: [Array of items] }
   */
   async getEuros() {
    let amount_of_euros = 0;
    let stacks = this.inventory.items.filter(i => i._tpl === eur_id);

    stacks.forEach(stack => {
      if (stack.upd.StackObjectsCount)
        amount_of_euros += stack.upd.StackObjectsCount;
    });

    return { amount: amount_of_euros, stacks: stacks };
  };

  /**
   * Updates profiles invetory
   * @param {Array} items - array of changed items in inventory.
   */
  async updateItems(items: InventoryItem[]) {
    return new Promise((resolve, reject) => {
      try {
        items.forEach(item => {
          let index = this.inventory.items.findIndex(i => i._id === item._id);
          if (index != -1) {
            this.inventory.items[index] = item;
          }
        });
        setTimeout(() => {
          resolve("ok");
        }, 200);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Updates profiles invetory
   * @param {Array} items - array of new items in inventory.
   */
  async addItems(items: InventoryItem[]) {
    return new Promise((resolve, reject) => {
      try {
        items.forEach(item => {
          this.inventory.items.push(item);
        });
        setTimeout(() => {
          resolve("ok");
        }, 200);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Updates profiles invetory
   * @param {Array} items - array of removed items from inventory.
   */
  async removeItems(items: InventoryItem[]) {
    return new Promise((resolve, reject) => {
      try {
        items.forEach(item => {
          let index = this.inventory.items.findIndex(i => i._id === item._id);
          if (index != -1) {
            this.inventory.items.splice(index, 1);
          }
        });
        setTimeout(() => {
          resolve("ok");
        }, 200);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * Searches inventory for item_id(_tpl), if found returns array of items.
   */
  async getItems(item_id: string) {
    let items = this.inventory.items.filter(i => i._tpl === item_id);
    return { count: items.length, items: items };
  };

  /**
   * Searches invetory for specific item, if found returns item.
   */
  async getItemById(item_id: string) {
    let item = this.inventory.items.find(i => i._id === item_id);
    return item;
  };
}