import React, {DependencyList, useEffect} from "react";
import { useNewYearGameApi } from "./api/NewYearGameApi";
import { LeaderboardData } from "./api/LeaderboardData";

import { LeaderboardTable } from "./LeaderboardTable";

function useAsyncEffect(effect: () => Promise<void>, deps?: DependencyList): void {
    useEffect(() => {
        effect();
    }, deps);
}
export function Leaderboard() {
    const [leaderboard, setLeaderboard] = React.useState<LeaderboardData>({
        bestResults: [],
        lastUserResults: [],
        closestToUserResults: [],
        userResult: null,
    });
    const { newYearGameApi } = useNewYearGameApi();

    useAsyncEffect(async () => {
        const nextLeaderboard = await newYearGameApi.getLeaderboard();
        setLeaderboard(nextLeaderboard);
    }, []);

    return <LeaderboardTable {...leaderboard} />;
}
