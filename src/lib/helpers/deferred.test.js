/**
 * Created by flomair on 22.03.17.
 */
import Deferred from './deferred';

describe('deferred', function () {
    it('should return object with promise, resolve, reject', () => {
        const def = new Deferred();

        expect(typeof(def.promise)).toBe('object');
        expect(typeof(def.resolve)).toBe('function');
        expect(typeof(def.reject)).toBe('function');

    });

    it('should return resolve value on call of resolve function', async() => {
        const def = new Deferred();
        def.resolve('value')
        const result = await def.promise;
        expect(result).toBe('value');
    });

    it('should reject with err on reject', async() => {
        const def = new Deferred();
        def.reject('failed')
        try {
            const result = await def.promise;
        } catch (err) {
            expect(err).toEqual('failed');
        }
    });
});
