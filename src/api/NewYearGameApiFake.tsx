import { INewYearGameApi } from "./NewYearGameApi";
import { LeaderboardData } from "./LeaderboardData";
import {GameScore} from "./GameScore";

export class NewYearGameApiFake implements INewYearGameApi {
    public async getLeaderboard(): Promise<LeaderboardData> {
        return {
            bestResults: [
                {
                    userId: "1",
                    userName: "user 123",
                    rank: 1,
                    score: 9000,
                },
                {
                    userId: "2",
                    userName: "user 456",
                    rank: 2,
                    score: 8000,
                },
                {
                    userId: "3",
                    userName: "user 1232",
                    rank: 3,
                    score: 7900,
                },
            ],
            closestToUserResults: [
                {
                    userId: "4",
                    userName: "user 25556",
                    rank: 5,
                    score: 7000,
                },
                {
                    userId: "5",
                    userName: "user 25236",
                    rank: 6,
                    score: 6000,
                },
                {
                    userId: "6",
                    userName: "user 347347",
                    rank: 7,
                    score: 5000,
                },
            ],
            userResult: {
                userId: "5",
                userName: "user 25236",
                rank: 6,
                score: 6000 ,
            },
            lastUserResults: [
                {
                    userId: "",
                    userName: "user 125563",
                    rank: 98,
                    score: 1000,
                },
                {
                    userId: "",
                    userName: "user 41256",
                    rank: 99,
                    score: 100,
                },
                {
                    userId: "",
                    userName: "user 121232",
                    rank: 100,
                    score: 12,
                },
            ],
        }
    }
}
