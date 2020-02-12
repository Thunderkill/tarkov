enum Side {
    /// BEAR faction
    Bear,
    /// USEC faction
    Usec,
    /// SCAV
    Savage
  }
  
  interface PlayerInfo {
    nickname: string;
    lowerNickname: string;
    side: Side;
    voice: string;
    level: number;
    experience: number;
    registrationDate: number;
    gameVersion: string;
    accountType: number;
    memberCategory: string;
    lockedMoveCommands: boolean;
    savageLockTime: number;
    lastTimePlayedAsSavage: number;
    settings: Settings;
    needWipe: boolean;
    globalWipe: boolean;
    nicknameChangeDate: number;
    bans: any;
  }
  
  interface Settings {
    role?: string,
    botDifficulty?: string,
    experience?: number,
  }
  
  interface Customization {
    head: string;
    body: string;
    feet: string;
    hands: string;
  }
  
  interface Health {
    hydration: HealthLevel;
    energy: HealthLevel;
    bodyParts: BodyParts;
    updateTime: number;
  }
  
  interface HealthLevel {
    current: number;
    maximum: number;
  }
  
  interface BodyParts {
    head: SimpleBodyPart;
    chest: SimpleBodyPart;
    stomach: SimpleBodyPart;
    leftArm: SimpleBodyPart;
    rightArm: SimpleBodyPart;
    leftLeg: SimpleBodyPart;
    rightLeg: SimpleBodyPart;
  }
  
  interface SimpleBodyPart {
    health: HealthLevel;
  }
  
  interface Inventory {
    items: InventoryItem[];
    equipment: string;
    stash?: string;
    questRaidItems: string;
    questStashItems: string;
    fastPanel: any;
  }
  
  interface Skills {
    common: CommonSkill[];
    mastering: MasteringSkill[];
    points: number;
  }
  
  interface CommonSkill {
    id: string;
    progress: number;
    pointsEarnedDuringSession?: number;
    lastAccess: number;
  }
  
  interface MasteringSkill {
    id: string;
    progress: number;
  }
  
  interface Stats {
    sessionCounters: SessionCounters;
    overallCounters: OverallCounters;
    sessionExperienceMult: number;
    experienceBonusMult: number;
    totalSessionExperience: number;
    lastSessionDate: number;
    aggressor?: Aggressor;
    totalInGameTime: number;
    survivorClass: string;
    droppedItems: any;
    foundInRaidItems: any;
    victims: Victim[];
    carriedQuestItems: any;
  }
  
  interface SessionCounters {
    items: SessionItem[];
  }
  
  interface OverallCounters {
    items: SessionItem[];
  }
  
  interface SessionItem {
    key: string[];
    value: number;
  }
  
  interface Aggressor {
    name: string;
    side: Side;
    bodyPart: string;
    headSegment?: string;
    weaponName: string;
    category: string;
  }
  
  interface Victim {
    name: string;
    side: Side;
    time: string;
    level: number;
    bodyPart: string;
    weapon: string;
  }
  
  interface ConditionCounters {
    counters: ConditionCounter[];
  }
  
  interface ConditionCounter {
    id: string;
    value: number;
  }
  
  interface BackendCounter {
    id: string;
    qid: string;
    value: number;
  }
  
  interface InsuredItem {
    id: string,
    itemId: string,
  }
  
  interface Bonus {
    bonusType: string;
    templateId?: string;
    value?: number;
    passive?: boolean;
    visible?: boolean;
    production?: boolean;
    filter?: string[];
    id?: string;
    icon?: string;
  }
  
  interface Quest {
    id: string;
    start_time: number;
    status: number;
    status_timers: Map<string, number>;
  }
  
  interface Ragfair {
    rating: number;
    is_rating_growing: boolean;
    offers: Offer[];
  }