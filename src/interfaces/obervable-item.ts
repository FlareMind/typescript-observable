import 'core-js/es6/set'
import {IObserver} from "./observer";
import {ICancel} from "./cancel";

export interface IObserverItem {
    id: ICancel,
    types : Set<string>,
    callback : Function | IObserver;
}