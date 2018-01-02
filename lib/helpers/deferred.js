/**
 * Created by flomair on 21.03.17.
 */
'use strict';

export default class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.done = {};
            this.resolve = (...args) => {
                this.done.type = 'resolved';
                this.done.vars = args;
                this.done.isdone = true;
                resolve(...args);
            };
            this.reject = (...args) => {
                const wasDone = this.done.isdone;
                this.done.type = 'rejected';
                this.done.vars = args;
                this.done.isdone = true;
                if (!wasDone)
                    reject(...args);
            }
        })
    }
}