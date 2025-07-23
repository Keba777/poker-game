export interface Player {
    id: string;
    stack: number;
    position: number;
    isDealer?: boolean;
    isSmallBlind?: boolean;
    isBigBlind?: boolean;
}

export interface Hand {
    id: string;
    players: Player[];
    actions: string[];
    cards: Record<string, string[]>;
    winnings: Record<string, number>;
    completed?: boolean;
}

export interface createHandInput {
    players: Player[];
    actions: string[];
    cards: Record<string, string[]>;
    winnings: Record<string, number>;
    completed?: boolean;
}