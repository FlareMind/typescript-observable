import {IObserver} from "./observer";
import {IObservableEvent} from "./observable-event";
import {ICancel} from "./cancel";

export interface IObservable {
    on(type: string | IObservableEvent | (string | IObservableEvent)[], callback: Function | IObserver) : ICancel;
    off(observer : IObserver) : boolean;
    count() : number;
    clear() : void;

    notify(event: IObservableEvent, data: any) : void;
}

export interface IChangeObservable extends IObservable{
    hasChanged() : boolean;
    setChanged() : void;
    clearChanged() : void;
}