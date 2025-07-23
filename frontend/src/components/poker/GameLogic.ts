import { createHand } from "@/lib/api";
import { Player, Hand } from "@/lib/types";

const BIG_BLIND_SIZE = 40;

export class GameLogic {
    private players: Player[] = [];
    private currentHand: Hand | null = null;
    private playLog: string[] = [];
    private handHistory: Hand[] = [];

    constructor(initialPlayers: Player[]) {
        this.players = initialPlayers.map(p => ({ ...p, stack: p.stack }));
        this.assignRoles();
    }

    assignRoles() {
        const dealerIndex = Math.floor(Math.random() * this.players.length);
        this.players[dealerIndex].isDealer = true;
        const smallBlindIndex = (dealerIndex + 1) % this.players.length;
        this.players[smallBlindIndex].isSmallBlind = true;
        const bigBlindIndex = (smallBlindIndex + 1) % this.players.length;
        this.players[bigBlindIndex].isBigBlind = true;
    }

    startHand() {
        this.currentHand = {
            id: crypto.randomUUID(),
            players: this.players,
            actions: [],
            cards: {},
            winnings: {},
            completed: false,
        };
        this.playLog = [];
        this.dealCards();
    }

    dealCards() {
        if (this.currentHand) {
            this.currentHand.players.forEach(player => {
                this.currentHand!.cards[player.id] = ["Ac", "2d"]; // Placeholder cards
            });
        }
    }

    takeAction(playerId: string, action: string, amount?: number) {
        if (!this.currentHand || this.currentHand.completed) return false;

        const player = this.currentHand.players.find(p => p.id === playerId);
        if (!player) return false;

        switch (action) {
            case "fold":
                this.currentHand.actions.push("f");
                this.playLog.push(`Fold by Player ${playerId}`);
                break;
            case "check":
                this.currentHand.actions.push("x");
                this.playLog.push(`Check by Player ${playerId}`);
                break;
            case "call":
                this.currentHand.actions.push("c");
                this.playLog.push(`Call by Player ${playerId}`);
                break;
            case "bet":
                if (amount && amount % BIG_BLIND_SIZE === 0) {
                    this.currentHand.actions.push(`b${amount}`);
                    this.playLog.push(`Bet ${amount} by Player ${playerId}`);
                }
                break;
            case "raise":
                if (amount && amount % BIG_BLIND_SIZE === 0) {
                    this.currentHand.actions.push(`r${amount}`);
                    this.playLog.push(`Raise ${amount} by Player ${playerId}`);
                }
                break;
            case "allin":
                this.currentHand.actions.push("allin");
                this.playLog.push(`Allin by Player ${playerId}`);
                break;
            default:
                return false;
        }
        return true;
    }

    completeHand() {
        if (this.currentHand) {
            this.currentHand.completed = true;
            this.currentHand.winnings = { [this.currentHand.players[0].id]: 100 }; // Placeholder winnings
            this.handHistory.push({ ...this.currentHand });
            this.saveHand();
            this.currentHand = null;
        }
    }

    private async saveHand() {
        if (this.currentHand) {
            await createHand({
                players: this.currentHand.players,
                actions: this.currentHand.actions,
                cards: this.currentHand.cards,
                winnings: this.currentHand.winnings,
            });
        }
    }

    getCurrentHand() {
        return this.currentHand;
    }

    getPlayLog() {
        return this.playLog;
    }

    getHandHistory() {
        return this.handHistory;
    }

    isActionValid(playerId: string, action: string, amount?: number) {
        console.log(`Validating action: ${action} for player: ${playerId}`);
        if (!this.currentHand) return false;
        const lastAction = this.currentHand.actions[this.currentHand.actions.length - 1];
        switch (action) {
            case "call":
                return lastAction?.startsWith("b") || lastAction?.startsWith("r");
            case "bet":
            case "raise":
                return !lastAction?.startsWith("b") && !lastAction?.startsWith("r");
            default:
                return true;
        }
    }
}