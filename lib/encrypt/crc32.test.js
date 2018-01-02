/**
 * Created by flomair on 20.03.17.
 */

import crc32 from './crc32';




describe('CRC32 checksum', function () {
    const objSave = {hello: 'jo'};
    const crcSave = '0880abc5';
    const madeSave = JSON.stringify({"op": objSave, "crc32": crcSave});
    const reqSave = JSON.stringify({"response": objSave, "crc32": crcSave});
    const arrSave = [objSave, objSave];
    const arrMade = "{\"batch\":[{\"op\":{\"hello\":\"jo\"},\"crc32\":\"0880abc5\"},{\"op\":{\"hello\":\"jo\"},\"crc32\":\"0880abc5\"}]}";

    const unSafe = "{hello 'jo'}";
    const unSafe2 = JSON.stringify({"response": objSave, "crc32": "32"});

    describe('add crc32 checksum', function () {
        it('should return string with crc32 checksum', () => {
            const crc = crc32.make(objSave);
            expect(crc).toEqual(madeSave);
        });

        it('should return array with crc32 checksums and a global checksum', () => {
            const crc = crc32.make(arrSave);
            expect(crc).toEqual(arrMade);
        });
    });

    describe('validate crc32 checksum', function () {
        it('should return object with crc32 checksum for single object', () => {
            const crc = crc32.validate(reqSave);
            expect(crc).toEqual(objSave);
        });

        it('should throw if object is not valid', () => {
            try {
                const crc = crc32.validate(unSafe);
            }catch (crc) {
                expect(crc).toThrow();
            }
        });


        it('should throw if crc32 is not valid', () => {
            try {
                const crc = crc32.validate(unSafe2);
            }catch (crc) {
                expect(crc).toThrow("not clean");
            }
        });
    });


});