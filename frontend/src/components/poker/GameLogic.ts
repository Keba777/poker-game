import { createHand } from "@/lib/api";
import { Player, Hand } from "@/lib/types";

const BIG_BLIND_SIZE = 40;
const NUM_PLAYERS = 6;

export class GameLogic {
    private players: Player[] = [];
    private currentHand: Hand | null = null;
    private playLog: string[] = [];
    private handHistory: Hand[] = [];
    private hasStarted = false;
    private round = "preflop";
    private version = 0; // Add version to track state changes

    constructor() {
        this.players = Array.from({ length: NUM_PLAYERS }, (_, i) => ({
            id: crypto.randomUUID(),
            stack: 10000,
            position: i,
        }));
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
            players: this.players.map((p) => ({ ...p })),
            actions: [],
            cards: {},
            winnings: {},
            completed: false,
        };
        this.playLog = [
            `Hand #${this.currentHand.id.slice(0, 8)} started`,
            `Stack 10000 - Dealer: ${this.players.find((p) => p.isDealer)!.id.slice(0, 4)}, SB: ${this.players.find((p) => p.isSmallBlind)!.id.slice(0, 4)}, BB: ${this.players.find((p) => p.isBigBlind)!.id.slice(0, 4)}`,
        ];
        this.dealCards();
        this.hasStarted = true;
        this.version++; // Increment version
    }

    dealCards() {
        if (this.currentHand) {
            this.currentHand.players.forEach((player) => {
                this.currentHand!.cards[player.id] = this.generateRandomCards();
            });
            this.playLog.push(
                ...this.currentHand.players.map(
                    (p) => `Player ${p.id.slice(0, 4)} is dealt ${this.currentHand!.cards[p.id].join(", ")}`
                )
            );
            this.version++; // Increment version
        }
    }

    private generateRandomCards(): string[] {
        const suits = ["c", "d", "h", "s"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
        const card1 = `${ranks[Math.floor(Math.random() * ranks.length)]}${suits[Math.floor(Math.random() * suits.length)]}`;
        let card2;
        do {
            card2 = `${ranks[Math.floor(Math.random() * ranks.length)]}${suits[Math.floor(Math.random() * suits.length)]}`;
        } while (card1 === card2);
        return [card1, card2];
    }

    takeAction(playerId: string, action: string, amount?: number) {
        if (!this.currentHand || this.currentHand.completed) return false;

        const player = this.currentHand.players.find((p) => p.id === playerId);
        if (!player) return false;

        switch (action) {
            case "fold":
                this.currentHand.actions.push("f");
                this.playLog.push(`Fold by Player ${playerId.slice(0, 4)}`);
                break;
            case "check":
                this.currentHand.actions.push("x");
                this.playLog.push(`Check by Player ${playerId.slice(0, 4)}`);
                break;
            case "call":
                this.currentHand.actions.push("c");
                this.playLog.push(`Call by Player ${playerId.slice(0, 4)}`);
                break;
            case "bet":
                if (amount && amount % BIG_BLIND_SIZE === 0) {
                    this.currentHand.actions.push(`b${amount}`);
                    this.playLog.push(`Bet ${amount} by Player ${playerId.slice(0, 4)}`);
                }
                break;
            case "raise":
                if (amount && amount % BIG_BLIND_SIZE === 0) {
                    this.currentHand.actions.push(`r${amount}`);
                    this.playLog.push(`Raise ${amount} by Player ${playerId.slice(0, 4)}`);
                }
                break;
            case "allin":
                this.currentHand.actions.push("allin");
                this.playLog.push(`Allin by Player ${playerId.slice(0, 4)}`);
                break;
            default:
                return false;
        }
        this.version++; // Increment version
        this.checkRoundCompletion();
        return true;
    }

    private checkRoundCompletion() {
        if (this.currentHand && this.currentHand.actions.length >= this.currentHand.players.length * 2) {
            this.advanceRound();
        }
    }

    private advanceRound() {
        if (this.currentHand) {
            switch (this.round) {
                case "preflop":
                    this.round = "flop";
                    this.playLog.push(`Flop cards dealt: 5c6c7c`);
                    this.currentHand.actions.push("5c6c7c");
                    break;
                case "flop":
                    this.round = "turn";
                    this.playLog.push(`Turn card dealt: 8d`);
                    this.currentHand.actions.push("8d");
                    break;
                case "turn":
                    this.round = "river";
                    this.playLog.push(`River card dealt: Ts`);
                    this.currentHand.actions.push("Ts");
                    break;
                case "river":
                    this.completeHand();
                    break;
            }
            this.version++; // Increment version
        }
    }

    async completeHand() {
        if (this.currentHand) {
            this.currentHand.completed = true;
            this.currentHand.winnings = { [this.currentHand.players[0].id]: 400 };
            this.playLog.push(`Hand #${this.currentHand.id.slice(0, 8)} ended`);
            await this.saveHand();
            this.handHistory.push({ ...this.currentHand });
            this.currentHand = null;
            this.round = "preflop";
            this.version++; // Increment version
        }
    }

    private async saveHand() {
        if (this.currentHand) {
            try {
                await createHand(this.currentHand);
                console.log("Hand saved successfully");
            } catch (error) {
                console.error("Error saving hand:", error);
            }
        }
    }

    updatePlayerStacks(stack: number) {
        this.players.forEach((p) => (p.stack = stack));
        if (this.currentHand) {
            this.currentHand.players.forEach((p) => (p.stack = stack));
            this.playLog.push(`All players' stacks updated to ${stack}`);
            this.version++; // Increment version
        }
    }

    getCurrentHand() {
        return this.currentHand;
    }

    getPlayLog() {
        return this.playLog;
    }

    getVersion() {
        return this.version; // Expose version
    }

    getHandHistory() {
        return this.handHistory;
    }

    isActionValid(playerId: string, action: string) {
        if (!this.currentHand) return false;
        const lastAction = this.currentHand.actions[this.currentHand.actions.length - 1];
        switch (action) {
            case "call":
                return lastAction?.startsWith("b") || lastAction?.startsWith("r");
            case "check":
                return !lastAction?.startsWith("b") && !lastAction?.startsWith("r");
            case "bet":
                return !lastAction?.startsWith("b") && !lastAction?.startsWith("r");
            case "raise":
                return lastAction?.startsWith("b") || lastAction?.startsWith("r");
            default:
                return true;
        }
    }

    getHasStarted() {
        return this.hasStarted;
    }
}