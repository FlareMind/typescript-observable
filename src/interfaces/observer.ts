export interface IObserver {
    update(event: any, name?: String) : void;
}

export type ObserverCallback = (data : any, name?: string) => void;