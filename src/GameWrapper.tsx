import React from "react";
import { useHistory } from "react-router";

import toysSvg from "./img/toys.svg";
import treeSvg from "./img/tree.svg";
import { Game } from "./Game";
import styles from "./GameWrapper.module.css";

type GameScreen = "initial" | "game";

const EXPIRATION_TIME = 120;

export function GameWrapper() {
    const [screen, setScreen] = React.useState<GameScreen>("initial");
    const [score, setScore] = React.useState<number>(0);
    const [time, setTime] = React.useState<number>(0);

    const history = useHistory();

    React.useEffect(() => {
        const timerId = setInterval(async () => {
            if (screen === "game") {
                setTime(x => x + 1);
            }
        }, 1000);
        return () => clearInterval(timerId);
    }, [screen]);

    React.useEffect(() => {
        if (time < EXPIRATION_TIME) {
            return;
        }
        history.push("/AdminTools/Game/Leaderboard");
    });

    return (
        <div style={{ margin: 16 }}>
            <h2 className={styles.title}>Новогодние снежки</h2>
            {screen === "initial" ? renderInitialScreen() : renderGame()}
        </div>
    );

    function renderGame() {
        return (
            <>
                <div style={{ width: 992, marginTop: 32 }}>
                    <h4 style={{ width: 400 }}>Текущий счёт: {score}</h4>
                    <div />
                    <h4 style={{ color: EXPIRATION_TIME - time <= 10 ? "red" : undefined }}>
                        {new Date((EXPIRATION_TIME - time) * 1000).toISOString().substr(11, 8)}
                    </h4>
                </div>
                <Game
                    backgroundColor={"#dddddd"}
                    incrementScore={i => setScore(prev => prev + i)}
                    width={992}
                    height={480}
                />
                <div style={{ float: "right", marginTop: 8 }}>
                    <button onClick={() => setScreen("initial")}>
                        Завершить игру
                    </button>
                </div>
            </>
        );
    }

    function renderInitialScreen() {
        return (
            <div className={styles.initialScreen}>
                <div>Не дайте новогодним продуктам ускользнуть от вашего меткого выстрела!</div>
                <div>Команда разработки EDI желает вам счастья в наступающем году</div>
                <div className={styles.initialScreenStart} style={{ backgroundImage: `url(${toysSvg})` }}>
                    <div className={styles.tree} style={{ backgroundImage: `url(${treeSvg})` }} />
                    <button
                        onClick={() => {
                            setScreen("game");
                            setTime(0);
                            setScore(0);
                        }}>
                        Начать
                    </button>
                </div>
            </div>
        );
    }
}
