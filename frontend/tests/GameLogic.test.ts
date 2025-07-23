import { GameLogic } from "@/components/poker/GameLogic";

describe("GameLogic", () => {
    let game: GameLogic;

    beforeEach(() => {
        game = new GameLogic([{ id: "1", stack: 1000, position: 0 }, { id: "2", stack: 1000, position: 1 }]);
    });

    test("should start hand and deal cards", () => {
        game.startHand();
        expect(game.getCurrentHand()).toBeDefined();
        expect(game.getCurrentHand()?.cards).toHaveProperty("1");
    });

    test("should validate actions", () => {
        game.startHand();
        expect(game.isActionValid("1", "bet", 40)).toBe(true);
        game.takeAction("1", "bet", 40);
        expect(game.isActionValid("1", "call")).toBe(true);
        expect(game.isActionValid("1", "bet", 40)).toBe(false);
    });
});