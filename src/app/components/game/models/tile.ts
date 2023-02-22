export interface Tile {
    value: number;
    row: number;
    col: number;
    isOnDelete?: boolean;
    isMerged?: boolean;
}

export interface TileStyle {
    backgroundColor: string;
    color: string;
}
