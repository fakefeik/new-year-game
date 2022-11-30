import React from "react";
import { GameScore } from "./api/GameScore";
import { LeaderboardData } from "./api/LeaderboardData";

import styles from "./GameWrapper.module.css";

function nextGroup(previous: GameScore[], next: GameScore[]): GameScore[] {
    if (previous.length === 0 || next.length === 0) {
        return next;
    }

    const delta = next[0].rank - previous[previous.length - 1].rank;
    if (delta <= 1) {
        return next.slice(1 - delta);
    }

    return [{ userName: "none", rank: 0, score: 0, userId: "" }, ...next];
}

export function LeaderboardTable({ bestResults, closestToUserResults, lastUserResults, userResult }: LeaderboardData) {
    const closest =
        userResult?.rank === lastUserResults[lastUserResults.length - 1]?.rank
            ? []
            : nextGroup(bestResults, closestToUserResults);
    const last = nextGroup(closest.length === 0 ? bestResults : closest, lastUserResults);
    const value = [...bestResults, ...closest, ...last];
    return (
        <div style={{ margin: 24 }}>
            <h2 className={styles.title}>Результаты</h2>
            <table>
                {renderColGroup()}
                <thead>{renderHeader()}</thead>
                <tbody>
                    {value.length === 0 && renderEmptyRow ? renderEmptyRow() : value.map(renderRow)}
                </tbody>
            </table>
        </div>
    );

    function renderEmptyRow() {
        return <div />;
    }

    function renderRow(item: GameScore) {
        if (item.rank === 0) {
            return <h2>...</h2>;
        }
        return (
            <tr>
                <td>{item.rank}</td>
                <td style={item.userId === userResult?.userId ? { fontWeight: "bold" } : {}}>{item.userName}</td>
                <td>{item.score}</td>
            </tr>
        );
    }

    function renderHeader() {
        return (
            <tr>
                <th />
                <th>Игрок</th>
                <th>Счёт</th>
            </tr>
        );
    }

    function renderColGroup() {
        return (
            <>
                <colgroup>
                    <col span={1} width={50} />
                    <col span={2} width={200} />
                </colgroup>
            </>
        );
    }
}
