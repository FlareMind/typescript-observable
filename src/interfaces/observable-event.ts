export interface IObservableEvent {
    parent : IObservableEvent | null;
    name : string;
}