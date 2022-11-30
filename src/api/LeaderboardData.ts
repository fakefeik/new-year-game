import { GameScore } from './GameScore';

export type LeaderboardData = {
    bestResults: GameScore[];
    closestToUserResults: GameScore[];
    userResult?: null | GameScore;
    lastUserResults: GameScore[];
};
