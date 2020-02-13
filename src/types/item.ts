interface Item {
    _id: string;
    _tpl: string;
    schemaId: string;
    parentId: string;
    slotId: string;
    upd: ItemOptions;
    location: Location;
  }
  
  interface ItemOptions {
    StackObjectsCount: number;
    SpawnedInSession: boolean;
    MedKit: ItemMedkit;
    Repairable: ItemRepairable;
    Light: ItemLight;
    UnlimitedCount: boolean;
    BuyRestrictionMax: number;
    BuyRestrictionCurrent: number;
    Key: ItemKey;
  }
  
  interface Location {
    x: number;
    y: number;
    r: number;
    isSearched: boolean;
  }
  
  interface ItemMedkit {
    HpResource: number;
  }
  
  interface ItemRepairable {
    Maxdurability: number;
    Durability: number;
  }
  
  interface ItemLight {
    IsActive: boolean;
    SelectedMode: number;
  }
  
  interface ItemKey {
    NumberOfUsages: number;
  }
  