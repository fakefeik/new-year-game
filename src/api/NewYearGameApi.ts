import React from 'react';
import { LeaderboardData } from './LeaderboardData';
import {NewYearGameApiFake} from "./NewYearGameApiFake";

export const newYearGameApi: INewYearGameApi = new NewYearGameApiFake();
export interface NewYearGameApiProps {
    newYearGameApi: INewYearGameApi;
}
export function createApiContext<TApiProps>(props: TApiProps) {
    return React.createContext(props);
}
export const NewYearGameApiContext = createApiContext<NewYearGameApiProps>({
    ['newYearGameApi']: newYearGameApi,
});
export const useNewYearGameApi = () => React.useContext(NewYearGameApiContext);
export interface INewYearGameApi {
    getLeaderboard(): Promise<LeaderboardData>;
}
