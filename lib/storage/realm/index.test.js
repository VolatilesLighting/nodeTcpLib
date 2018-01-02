import Realm from 'realm';
import * as db from './index';
import schemas from './schemas';
import nextframe from '../../helpers/nextframe';
//const realm = new Realm({schema: schemas, schemaVersion: 4});


let mockIsfiltered = false;
const mockfiltered = {
    filtered: jest.fn(text => {
        return mockdata
    })
};
const mockdata = [{a: 1}, {b: 2}, {c: 3}];




const mockobjects = jest.fn(text => {});
const mockwrite = jest.fn(text => {});
const mockdelete = jest.fn(text => {});
const mockCCreate = jest.fn(text => {});
const mockresolver =  jest.fn(text => {
    return Promise.resolve();
});
mockresolver.mapInFrames = function(collection, fn) {
    let queue = Promise.resolve();
    const values = [];
    collection.forEach(item => {
        queue = queue.then(() => Promise.resolve().then(() => values.push(fn(item))));
    });
    return queue.then(() => values);
};



jest.mock( '../../helpers/nextframe');
nextframe.mockImplementation(() => Promise.resolve());



jest.mock('./schemas', () => ([
    {
        primaryKey: "hey",
        name: 'hey'
    },
    {
        primaryKey: 'ho',
        name: 'ho'
    },
    {}
]));




jest.mock('realm', () =>
    jest.fn((data) => ({
            objects: jest.fn(text => {
                mockobjects(text);
                if (mockIsfiltered) {
                    return mockfiltered;
                } else {
                    return mockdata;
                }
            }),
            write: jest.fn(cb => {
                mockwrite();
                    cb();
            }),
            delete: jest.fn((...args) => {
                mockdelete(...args);
            }),
            create: jest.fn((...args) => {
                mockCCreate(...args);
            }).bind(this)
        }
    )));


describe('realm', function () {
    it('should create realm with schemas from schemas.js', function () {
        expect(Realm.mock.calls.length).toBe(1);
        expect(Realm.mock.calls[0].length).toBe(1);
        expect(Realm.mock.calls[0][0].schema).toEqual(schemas);
        expect(typeof Realm.mock.calls[0][0].schemaVersion).toBe('number');
    });
    describe('test read', function () {
        describe('read single schema', async () =>{
            const slice = jest.spyOn(Array.prototype, 'slice');
            const map = jest.spyOn(Array.prototype, 'map');
            const schema = "schema";

            beforeEach(() => {
                mockobjects.mockClear();
                mockfiltered.filtered.mockClear();
                nextframe.mockClear();
                slice.mockClear();
                map.mockClear();
            });
            it('should read single schema with out filter, length', async () =>{
                const schema = "schema";


                const res = await db.dbread(schema);

                expect(res).toEqual(mockdata);

                //expect(nextframe.mock.calls.length).toBe(1);

                expect(mockobjects.mock.calls.length).toBe(1);
                expect(mockobjects.mock.calls[0].length).toBe(1);
                expect(mockobjects.mock.calls[0][0]).toBe(schema);

                expect(mockfiltered.filtered.mock.calls.length).toBe(0);

                expect(slice).toHaveBeenCalledTimes(1);
                expect(slice).toHaveBeenCalledWith(0);
                expect(map).toHaveBeenCalledTimes(1);

            });

            it('should read single schema with filter', async () =>{
                mockIsfiltered = true;
                const filter = 'filter';

                const res = await db.dbread(schema, null, filter);

                expect(res).toEqual(mockdata);

               // expect(nextframe.mock.calls.length).toBe(1);
                expect(mockobjects.mock.calls.length).toBe(1);
                expect(mockobjects.mock.calls[0].length).toBe(1);
                expect(mockobjects.mock.calls[0][0]).toBe(schema);

                expect(mockfiltered.filtered.mock.calls.length).toBe(1);
                expect(mockfiltered.filtered.mock.calls[0].length).toBe(1);
                expect(mockfiltered.filtered.mock.calls[0][0]).toBe(filter);

                expect(mockfiltered.filtered.mock.calls.length).toBe(1);
                expect(mockfiltered.filtered.mock.calls[0].length).toBe(1);
                expect(mockfiltered.filtered.mock.calls[0][0]).toBe(filter);

                mockIsfiltered = false;
            });
            describe('test lenght and offset', async () =>{
                beforeEach(() => {
                    mockobjects.mockClear();
                    mockfiltered.filtered.mockClear();
                    slice.mockClear();
                    map.mockClear();
                });
                it('should read single schema  length as array with length 1', async () =>{

                    const length = [2];
                    const res = await db.dbread(schema, length);

                    //expect(nextframe.mock.calls.length).toBe(1);
                    expect(res).toEqual(mockdata.slice(0, length[0]));

                    expect(mockobjects.mock.calls.length).toBe(1);
                    expect(mockobjects.mock.calls[0].length).toBe(1);
                    expect(mockobjects.mock.calls[0][0]).toBe(schema);

                    expect(mockfiltered.filtered.mock.calls.length).toBe(0);

                    expect(slice).toHaveBeenCalledTimes(2);
                    expect(slice).toHaveBeenLastCalledWith(0, length[0]);
                    expect(map).toHaveBeenCalledTimes(1);

                });
                it('should read single schema  length as array with length 2', async () =>{

                    const length = [1, 2];
                    const res = await db.dbread(schema, length);

                    expect(res).toEqual(mockdata.slice(length[0], length[1]));

                    expect(mockobjects.mock.calls.length).toBe(1);
                    expect(mockobjects.mock.calls[0].length).toBe(1);
                    expect(mockobjects.mock.calls[0][0]).toBe(schema);

                   // expect(nextframe.mock.calls.length).toBe(1);
                    expect(mockfiltered.filtered.mock.calls.length).toBe(0);

                    expect(slice).toHaveBeenCalledTimes(2);
                    expect(slice).toHaveBeenLastCalledWith(length[0], length[1]);
                    expect(map).toHaveBeenCalledTimes(1);

                });
            });
        });
        describe('readall schema', function () {
            const slice = jest.spyOn(Array.prototype, 'slice');
            const map = jest.spyOn(Array.prototype, 'map');


            beforeEach(() => {
                mockobjects.mockClear();
                mockfiltered.filtered.mockClear();
                nextframe.mockClear();
                slice.mockClear();
                map.mockClear();
            });
            it('should read schemas with out filter, length', async () =>{

                const exp = {[schemas[0].name]: mockdata, [schemas[1].name]: mockdata};
                const res = await db.dbreadAll();

                expect(res).toEqual(exp);

                expect(mockobjects.mock.calls.length).toBe(2);
                expect(mockobjects.mock.calls[0].length).toBe(1);
                expect(mockobjects.mock.calls[0][0]).toBe(schemas[0].name);
                expect(mockobjects.mock.calls[0].length).toBe(1);
                expect(mockobjects.mock.calls[1][0]).toBe(schemas[1].name);


                //expect(nextframe.mock.calls.length).toBe(schemas.length-1);
                expect(mockfiltered.filtered.mock.calls.length).toBe(0);


                expect(slice).toHaveBeenCalledTimes(2);
                expect(slice).toHaveBeenLastCalledWith(0);
                expect(map).toHaveBeenCalledTimes(2);

            });
        });
    });
    describe('test write', function () {
        const schema ='schema';

        beforeEach(() => {
            mockwrite.mockClear();
            mockCCreate.mockClear();
        });
        it('should call create for each item in array', async () =>{
            const data = [1,2];
            await db.dbwrite(schema,data);
            expect(mockwrite.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls.length).toBe(data.length);
            expect(mockCCreate.mock.calls[0].length).toBe(2);
            expect(mockCCreate.mock.calls[0][0]).toBe(schema);
            expect(mockCCreate.mock.calls[0][1]).toBe(data[0]);
            expect(mockCCreate.mock.calls[1][0]).toBe(schema);
            expect(mockCCreate.mock.calls[1][1]).toBe(data[1]);

        });

        it('should call create for each item in array', async () =>{
            const data = 1;
            await db.dbwrite(schema,data);
            expect(mockwrite.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls[0].length).toBe(2);
            expect(mockCCreate.mock.calls[0][0]).toBe(schema);
            expect(mockCCreate.mock.calls[0][1]).toBe(data);

        });
    });
    describe('test update', function () {
        const schema ='schema';

        beforeEach(() => {
            mockwrite.mockClear();
            mockCCreate.mockClear();
        });
        it('should call create for each item in array', async () =>{
            const data = [1,2];
            await db.dbupdate(schema,data);
            expect(mockwrite.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls.length).toBe(data.length);
            expect(mockCCreate.mock.calls[0].length).toBe(3);
            expect(mockCCreate.mock.calls[0][0]).toBe(schema);
            expect(mockCCreate.mock.calls[0][1]).toBe(data[0]);
            expect(mockCCreate.mock.calls[0][2]).toBe(true);
            expect(mockCCreate.mock.calls[1][0]).toBe(schema);
            expect(mockCCreate.mock.calls[1][1]).toBe(data[1]);
            expect(mockCCreate.mock.calls[1][2]).toBe(true);
        });

        it('should call create for single data', async () =>{
            const data = 1;
            await db.dbupdate(schema,data);
            expect(mockwrite.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls.length).toBe(1);
            expect(mockCCreate.mock.calls[0].length).toBe(3);
            expect(mockCCreate.mock.calls[0][0]).toBe(schema);
            expect(mockCCreate.mock.calls[0][1]).toBe(data);
            expect(mockCCreate.mock.calls[0][2]).toBe(true);

        });
    });
    describe('test delete', function () {
        const schema ='schema';

        beforeEach(() => {
            mockwrite.mockClear();
            mockdelete.mockClear();
            mockCCreate.mockClear();
            nextframe.mockClear();
            mockobjects.mockClear();
        });
        it('should delete schemas rows without filter', async () =>{

            await db.dbdelete(schema);

            expect(nextframe.mock.calls.length).toBe(1);
            expect(mockobjects.mock.calls.length).toBe(1);
            expect(mockobjects.mock.calls[0].length).toBe(1);
            expect(mockobjects.mock.calls[0][0]).toBe(schema);

            expect(mockfiltered.filtered.mock.calls.length).toBe(0);

            expect(mockdelete.mock.calls.length).toBe(1);
            expect(mockdelete.mock.calls[0].length).toBe(1);
            expect(mockdelete.mock.calls[0][0]).toBe(mockdata);

        });
        it('should delete schemas rows with filter', async () =>{
            mockIsfiltered = true;
            const filter = 'filter';

            await db.dbdelete(schema, filter);

            expect(nextframe.mock.calls.length).toBe(1);
            expect(mockobjects.mock.calls.length).toBe(1);
            expect(mockobjects.mock.calls[0].length).toBe(1);
            expect(mockobjects.mock.calls[0][0]).toBe(schema);

            expect(mockfiltered.filtered.mock.calls.length).toBe(1);
            expect(mockfiltered.filtered.mock.calls[0].length).toBe(1);
            expect(mockfiltered.filtered.mock.calls[0][0]).toBe(filter);

            expect(mockdelete.mock.calls.length).toBe(1);
            expect(mockdelete.mock.calls[0].length).toBe(1);
            expect(mockdelete.mock.calls[0][0]).toBe(mockdata);

            mockIsfiltered = false;
        });
    });
});