export interface IObserver {
    update(event: any) : void;
}

export type ObserverCallback = (data : any) => void;