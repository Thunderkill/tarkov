interface Offer {
  id: String;
  int_id: String;
  user: User;
  root: String;
  items: Item[];
  items_cost: number;
  requirements: Requirement[];
  requirements_cost: number;
  summary_cost: number;
  sell_in_one_piece: boolean;
  start_time: number;
  end_time: number;
  loyalty_level: number;
}

interface User {
  id: String;
  memberType: number;
  nickname?: String;
  rating?: number;
  isRatingGrowing?: boolean;
  avatar?: String;
}

interface Requirement {
  _tpl: String;
  count: number;
}

interface SellRequirement extends Requirement {
  level: number;
  side: number;
  onlyFunctional: boolean;
}

interface SearchResult {
  categories: Map<string, number>;
  offers: Offer[];
  offers_count: number;
  selected_category: string;
}

interface MarketFilter {
  sort_type: SortBy;
  sort_direction: SortDirection;
  currency: FilterCurrency;
  min_price?: number;
  max_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  min_condition?: number;
  max_condition?: number;
  expiring_within_hour: boolean;
  hide_bartering_offers: boolean;
  owner_type: Owner;
  hide_inoperable_weapons: boolean;
  handbook_id?: string;
  linked_search_id?: string;
  required_search_id?: string;
}

enum SortBy {
  ID = 0,
  BarteringOffers = 2,
  MerchantRating = 3,
  Price = 5,
  Expiry = 6
}

enum SortDirection {
  Ascending = 0,
  Descending = 1
}

enum FilterCurrency {
  Any = 0,
  Rouble = 1,
  Dollar = 2,
  Euro = 3
}

enum Owner {
  Any = 0,
  Traders = 1,
  Player = 2
}

interface RagfairResponseData {
  items: InventoryUpdate;
  badRequest: RagfairError[];
}

interface RagfairError {
  error: number;
  errormsg: string;
}

interface BarterItem {
  id: string;
  count: number;
}

interface SellItemRequest {
  Action: string;
  sellInOnePiece: boolean;
  items: string[];
  requirements: SellRequirement[];
}
