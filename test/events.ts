import {IObservableEvent} from "../src/interfaces/observable-event";

export class TestRootEvent implements IObservableEvent {
    parent: IObservableEvent = null;
    name: string = 'test-root';
}

export class TestChildEvent implements IObservableEvent {
    parent: IObservableEvent = new TestRootEvent();
    name: string = 'test-child';
}

export class TestGrandChildEvent implements IObservableEvent {
    parent: IObservableEvent = new TestChildEvent();
    name: string = 'test-grand-child';
}