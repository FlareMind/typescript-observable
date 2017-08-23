export interface IObserver {
    update(event: any) : void;
}

export type ObserverCallback = (callback : any) => void;