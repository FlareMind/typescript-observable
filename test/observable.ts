import 'mocha'
import { expect } from 'chai'

import {Observable} from '../src/observable'
import {TestChildEvent, TestGrandChildEvent, TestRootEvent} from "./events";

const NUM_OF_OBSERVERS_TO_ADD = 10;

describe('Observable', () => {
    describe('on', () => {

        it('should be possible to listen to a string and a IObservableEvent', () => {
            let observable = new Observable();

            observable.on('test', () => {});
            observable.on(new TestRootEvent(), () => {});
            observable.on('test', {
                update: () => {}
            });
            observable.on(new TestRootEvent(), {
                update: () => {}
            });
        });

        it('should return a ICancel object', () => {
            let observable = new Observable(),
                cancelFromString = observable.on('test', () => {}),
                cancelFromEvent = observable.on(new TestRootEvent(), () => {});

            expect(cancelFromString).to.haveOwnProperty('cancel');
            expect(cancelFromEvent).to.haveOwnProperty('cancel');
        });
    });

    describe('notifty', () => {

        it('should call the callback', done => {
            let observable = new Observable(),
                flags : { [index : string] : boolean} = {
                    stringFunction: false,
                    stringObserver: false,
                    eventFunction: false,
                    eventObserver: false,
                    not: true
                };

            observable.on('test-root', () => {
                flags['stringFunction'] = true;
                finishTest();
            });

            observable.on('test-root', {
                update: () => {
                    flags['stringObserver'] = true;
                    finishTest();
                }
            });

            observable.on(new TestRootEvent(), () => {
                flags['eventFunction'] = true;
                finishTest();
            });

            observable.on(new TestRootEvent(), {
                update: () => {
                    flags['eventObserver'] = true;
                    finishTest();
                }
            });

            observable.on('not-test-root', () => {
                flags['not'] = false;
                finishTest();
            });

            observable.notify(new TestRootEvent(), {});

            // Check that the right flags are set
            function finishTest() {
                if (flags['not'] === false) {
                    done(new Error('"not-test-root" should not be called '));
                }

                if (Object.keys(flags).every(key => flags[key])) {
                    done();
                }
            }
        });

        it('should propagate to parent events', done => {
            let observable = new Observable(),
                flags : { [index : string] : boolean } = {
                    stringChild: false,
                    stringParent: false,
                    eventChild: false,
                    eventParent: false,
                    not: true
                };

            observable.on('test-child', () => {
                flags['stringChild'] = true;
                finishTest();
            });

            observable.on('test-root', () => {
                flags['stringParent'] = true;
                finishTest();
            });

            observable.on(new TestChildEvent(), () => {
                flags['eventChild'] = true;
                finishTest();
            });

            observable.on(new TestRootEvent(), () => {
                flags['eventParent'] = true;
                finishTest();
            });

            observable.on(new TestGrandChildEvent(), () => {
                flags['not'] = false;
                finishTest();
            });

            observable.notify(new TestChildEvent(), {});

            // Check that the right flags are set
            function finishTest() {
                if (flags['not'] === false) {
                    done(new Error('"not-test-root" should not be called '));
                }

                if (Object.keys(flags).every(key => flags[key])) {
                    done();
                }
            }
        });

        it('should propagate multiple steps', done => {
            let observable = new Observable(),
                flags : { [index : string] : boolean } = {
                    root: false,
                    child: false,
                    grandChild: false
                };

            observable.on('test-grand-child', () => {
                flags['grandChild'] = true;
                finishTest();
            });

            observable.on('test-child', () => {
                flags['child'] = true;
                finishTest();
            });

            observable.on('test-root', () => {
                flags['root'] = true;
                finishTest();
            });

            observable.notify(new TestGrandChildEvent(), {});

            // Check that the right flags are set
            function finishTest() {
                if (Object.keys(flags).every(key => flags[key])) {
                    done();
                }
            }
        });

        it('should carry data to the observer', done => {
            let observable = new Observable(),
                data = {},
                numOfFunctions = 4;

            observable.on('test-root', (item : any) => {
                if (item === data) {
                    finishTest();
                } else {
                    done(new Error('Given data does not match'));
                }
            });

            observable.on('test-root', {
                update: (item : any) => {
                    if (item === data) {
                        finishTest();
                    } else {
                        done(new Error('Given data does not match'));
                    }
                }
            });

            observable.on(new TestRootEvent(), (item : any) => {
                if (item === data) {
                    finishTest();
                } else {
                    done(new Error('Given data does not match'));
                }
            });

            observable.on(new TestRootEvent(), {
                update: (item : any) => {
                    if (item === data) {
                        finishTest();
                    } else {
                        done(new Error('Given data does not match'));
                    }
                }
            });

            observable.notify(new TestRootEvent(), data);

            function finishTest() {
                if (--numOfFunctions === 0) {
                    done();
                }
            }
        });

        it('should not block code', done => {
            let observable = new Observable(),
                stop : number = Date.now() + 25,
                sync : number,
                async : number;

            observable.on('test-root', () => {
                async = Date.now();
                finishTest();
            });

            observable.notify(new TestRootEvent(), {});

            while (Date.now() < stop) {}

            sync = Date.now();

            if (async !== undefined) {
                done(new Error('sync must run first'));
            }

            finishTest();

            function finishTest() {
                if (sync !== undefined && async !== undefined && async >= sync) {
                    done();
                }
            }
        });
    });

    describe('off and cancel', () => {

        it('should be possible to cancel an observer', () => {

            // Test remove from every position if added with string
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                let observable = new Observable(),
                    cancel;

                for (let j = 0; j < NUM_OF_OBSERVERS_TO_ADD; j++) {
                    let temp = observable.on('test', () => {});
                    if (i === j) {
                        cancel = temp;
                    }
                }

                cancel.cancel();
                expect(observable.count()).to.equal(NUM_OF_OBSERVERS_TO_ADD - 1);
            }

            // Test remove from every position if added with event
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                let observable = new Observable(),
                    cancel;

                for (let j = 0; j < NUM_OF_OBSERVERS_TO_ADD; j++) {
                    let temp = observable.on(new TestRootEvent(), () => {});
                    if (i === j) {
                        cancel = temp;
                    }
                }

                cancel.cancel();
                expect(observable.count()).to.equal(NUM_OF_OBSERVERS_TO_ADD - 1);
            }
        });

        it('should be possible to call off on a observer class', () => {

            // Test remove from every position if added with string
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                let observable = new Observable(),
                    object;

                for (let j = 0; j < NUM_OF_OBSERVERS_TO_ADD; j++) {
                    let temp = {update: () => {}};
                    observable.on('test', temp);
                    if (i === j) {
                        object = temp;
                    }
                }

                observable.off(object);
                expect(observable.count()).to.equal(NUM_OF_OBSERVERS_TO_ADD - 1);
            }

            // Test remove from every position if added with event
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                let observable = new Observable(),
                    object;

                for (let j = 0; j < NUM_OF_OBSERVERS_TO_ADD; j++) {
                    let temp = {update: () => {}};
                    observable.on(new TestRootEvent(), temp);
                    if (i === j) {
                        object = temp;
                    }
                }

                observable.off(object);
                expect(observable.count()).to.equal(NUM_OF_OBSERVERS_TO_ADD - 1);
            }
        });
    });

    describe('count and clear', () => {

        it('should count the number of items and clear', () => {
            let observable = new Observable();

            // Add observers with string and check that they are added
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                observable.on('test', () => {});
                expect(observable.count()).to.equal(i + 1);
            }

            // Clear the list and check that they are removed
            observable.clear();
            expect(observable.count()).to.equal(0);

            // Add observers with event and check that they are added
            for (let i = 0; i < NUM_OF_OBSERVERS_TO_ADD; i++) {
                observable.on(new TestRootEvent(), () => {});
                expect(observable.count()).to.equal(i + 1);
            }

            // Clear the list and check that they are removed
            observable.clear();
            expect(observable.count()).to.equal(0);
        });
    });
});