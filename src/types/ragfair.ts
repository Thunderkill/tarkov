interface Offer {
    id: String;
    int_id: String;
    user: User;
    root: String;
    items: InventoryItem[];
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
    schemaid: String;
    count: number;
}