import 'mocha'
import { expect } from 'chai'
import {ChangeObservable} from "../index";
import {TestRootEvent} from "./events";

describe('ChangeObservable', () => {
    describe('hasChanged', () => {
        it('should be false by default', () => {
            let observable = new ChangeObservable();

            expect(observable.hasChanged()).to.equal(false);
        });

        it('should change to true when setChanged is called', () => {
            let observable = new ChangeObservable();

            observable.setChanged();

            expect(observable.hasChanged()).to.equal(true);
        });

        it('should be set to false when clearChanged is called', () => {
            let observable = new ChangeObservable();

            observable.setChanged();
            observable.clearChanged();

            expect(observable.hasChanged()).to.equal(false);
        });

        it('should be false when notify is called', () => {
            let observable = new ChangeObservable();

            observable.setChanged();
            observable.notify(new TestRootEvent(), {});

            expect(observable.hasChanged()).to.equal(false);
        });
    });
});