# typescript-observable
[![Build Status](https://travis-ci.org/FlareMind/typescript-observable.svg?branch=master)](https://travis-ci.org/FlareMind/typescript-observable.svg?branch=master)

Adds classes and interfaces to make Typescript classes observable.

### Installation

With npm
```
npm install --save typescript-observable
```

## Observable
A class for observable objects.

* `on(type : string | string[], callback : (data : any) => void | IObserver) : { cancel : Function }`
Adds the observer `callback` to the event `type`. The returned object has a function `cancel` that removes the listener.
* `off(observer : IObserver) : boolean`
Removes the observer. Only works if the bound observer is of type `IObserver`. Returns `true` if the removal was successful, otherwise false.
* `count() : number`
Counts the number of observers.
* `clear() : void`
Removes all observers.
* `notify(event : IObservableEvent, data : any) : void`
Notifies all the observers listening to the `IObservableEvent` or any of its parents. The parameter `data` is passed to the observers.

## ChangeObservable
**extends `Observable`**

A subclass of `Observable` that tracks changes.

* `hasChanged() : boolean`
Check if the object has changed.
* `setChanged() : void`
Set that the object has changed.
* `clearChanged`

## IObservableEvent
An interface for events.

* `parent : IObservableEvent`
Observers that observe the parent event will also be notified. Can be `null`.
* `name : string`
Name of the event.

## IObserver
An interface that defines an observer.

* `update(data : any) : void`
Called when the observers are notified.


## Example
The class to be observed can be extended with `Observable`

```typescript
let rootEvent : IObservableEvent = {
        parent: null,
        name: 'root'
    },
    childEvent : IObservableEvent = {
        parent: rootEvent,
        name: 'child'
    };

class TestObservable extends Observable {
  foo() : void {
    // do something
    // notify observers listening to the rootEvent
    notify(rootEvent, {
        message: 'rootEvent was called'
    });
  }
  
  bar() : void {
    // do something else
    // notify observers listening to the childEvent and the rootEvent
    notify(childEvent, {
        message: 'childEvent was called'
    });
  }
}

let testObservable = new TestObservable();

// Called on rootEvent and childEvent
testObservable.on('root', data => {
    console.log('root observer', data.message);
});

// Called on childEvent
testObservable.on('child', data => {
    console.log('child observer', data.message);
});

testObservable.foo();
/**
 * Prints:
 * root observer, rootEvent was called
 */

testObservable.bar();
/*
 * Prints:
 * root observer, childEvent was called
 * child observer, childEvent was called
 */
```

## Contribute
Make sure to run the tests
```
npm test
```