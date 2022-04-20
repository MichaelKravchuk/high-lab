import { Subscription } from 'rxjs';

export type Listener = Subscription | (() => void) | SubscriptionHelper;

export class SubscriptionHelper {
    private static cases = new Map<(item) => any, (item) => any>()

    public static registerCase<T>(comparator: (item: T) => any, unsubscriber: (item: T) => void): void {
        this.cases.set(comparator, unsubscriber);
    }

    private subscriptions: Array<Listener> = [];

    public set next(subscription: Listener) {
        this.subscriptions.push(subscription);
    }

    public get last(): Listener {
        return this.subscriptions[this.subscriptions.length - 1];
    }

    public unsubscribeAll(): void {
        this.subscriptions.forEach(item => {
            for (let entry of SubscriptionHelper.cases.entries()) {
                if (entry[0](item)) {
                    entry[1](item);
                    break;
                }
            }
        });

        this.subscriptions = [];
    }
}

SubscriptionHelper.registerCase<Subscription>(v => v instanceof Subscription, v => v.unsubscribe());
SubscriptionHelper.registerCase<SubscriptionHelper>(v => v instanceof SubscriptionHelper, v => v.unsubscribeAll());
SubscriptionHelper.registerCase<() => void>(v => typeof v === 'function', v => v())
