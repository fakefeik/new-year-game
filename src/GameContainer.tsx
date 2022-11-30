import React from "react";
import { Switch } from "react-router";
import { Link, Redirect, Route } from "react-router-dom";

import { GameWrapper } from "./GameWrapper";
import { Leaderboard } from "./Leaderboard";

export function GameContainer() {
    return (
        <div>
            <div>
                <div>
                    <Link data-tid="NewGame" to="/Snowballs">
                        Новая игра
                    </Link>
                </div>
                <div>
                    <Link
                        data-tid="Leaderboard"
                        to="/Leaderboard">
                        Таблица лидеров
                    </Link>
                </div>
            </div>
            <div>
                <Switch>
                    <Redirect exact from="/" to="/Snowballs" />,
                    <Route exact path="/Snowballs" component={GameWrapper} />
                    <Route exact path="/Leaderboard" component={Leaderboard} />
                </Switch>
            </div>
        </div>
    );
}
