interface InventoryUpdate {
    new?: Item[],
    change?: Item[],
    del?: DeletedItem[],
}

interface DeletedItem {
    _id: String,
}