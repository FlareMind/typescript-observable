import "core-js/es6/promise";
import "core-js/es6/array"
import "core-js/es6/set"

import {IObservable} from "./interfaces/observable";
import {IObservableEvent} from "./interfaces/observable-event";
import {IObserver, ObserverCallback} from "./interfaces/observer";
import {IObserverItem} from "./interfaces/obervable-item"
import {ICancel} from "./interfaces/cancel";


export class Observable implements IObservable {
    private observers : IObserverItem[] = [];

    constructor() {}

    count(): number {
        return this.observers.length;
    }

    clear(): void {
        this.observers.splice(0, this.observers.length);
    }

    on(type: string | IObservableEvent | (string | IObservableEvent)[], callback: ObserverCallback | IObserver)
    : ICancel {
        let cancel : ICancel = {
            cancel: () => {
                let index : number = this.observers.findIndex((item : IObserverItem) => item.id === cancel);

                // If the index is larger than -1, then remove the item
                if (index > -1) {
                    this.observers.splice(index, 1);
                    return true;
                }

                // Else the remove failed
                return false;
            }
        };

        // If type is an array then push that to the observers
        if (Array.isArray(type)) {
            this.observers.push({
                id: cancel,
                types: new Set<string>(type.map(item => isObservableEvent(item) ? item.name : item)),
                callback: callback
            });
        }

        // If type is not an array
        else {
            this.observers.push({
                id: cancel,
                types: new Set<string>([isObservableEvent(type) ? type.name : type]),
                callback: callback
            });
        }

        return cancel;
    }

    off(observer: IObserver): boolean {

        // Find the index of the array
        let index : number = this.observers.findIndex((item : IObserverItem) => item.callback === observer);

        // If the index is larger than -1, then remove the item
        if (index > -1) {
            this.observers.splice(index, 1);
            return true;
        }

        // Else the remove failed
        return false;
    }

    notify(event: IObservableEvent, data: any): Promise<void> {

        // Make function decoupled
        return Promise.resolve().then(() => {
            let types: string[] = [event.name],
                calledEventName: string = event.name;

            // Select all events to be called
            while (event.parent !== undefined && event.parent !== null) {
                event = event.parent;
                types.push(event.name);
            }

            // Call all observers having the type
            this.observers.forEach(observer => {
                if (types.some(type => observer.types.has(type))) {
                    if (isObserver(observer.callback)) {
                        observer.callback.update(data, calledEventName);
                    } else {
                        observer.callback(data, calledEventName);
                    }
                }
            });
        });
    }
}

/**
 * Check if the item is of type IObservableEvent
 * @param tested is the parameter to be tested
 * @return {boolean} true if the item is instance of IObservableEvent, otherwise false
 */
function isObservableEvent(tested: any) : tested is IObservableEvent {
    return tested !== undefined && tested !== null && tested.hasOwnProperty('name') && tested.hasOwnProperty('parent');
}

/**
 * Check if the item is of type IObserver
 * @param tested is the parameter to be tested
 * @return {boolean} true if the item is instance of IObserver, otherwise false
 */
function isObserver(tested: any) : tested is IObserver {
    return tested !== undefined && tested !== null && typeof tested.update === 'function';
}