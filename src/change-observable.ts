import {Observable} from "./observable";
import {IChangeObservable} from "./interfaces/observable";
import {IObservableEvent} from "./interfaces/observable-event";

export class ChangeObservable extends Observable implements IChangeObservable {
    private isChanged : boolean = false;

    hasChanged(): boolean {
        return this.isChanged;
    }

    setChanged(): void {
        this.isChanged = true;
    }

    clearChanged(): void {
        this.isChanged = false;
    }

    notify(event: IObservableEvent, data: any): Promise<void> {
        this.clearChanged();
        return super.notify(event, data);
    }
}