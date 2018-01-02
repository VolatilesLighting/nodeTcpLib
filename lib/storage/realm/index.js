/**
 * Created by flomair on 29.03.17.
 */


import asycStore from '../asycStore';
//export default asycStore
//asycStore.erase()
export const dbreadAll = asycStore.dbreadAll;
export const dbupdate = asycStore.dbupdate;



/*
import Realm from 'realm';
import schemas from './schemas';
import nextframe from '../../helpers/nextframe';



const realm = new Realm({schema: schemas, schemaVersion: 48, path: 'volatiles.realm',});





export const dbreadAll = async() => {
    const results = {};
    for (let i = 0; i < schemas.length; i++) {
        const schema = schemas[i];
        if (schema.primaryKey)
            results[schema.name] = await dbread(schema.name);
    }
    return results;

};

export const dbread = async(schema, length, filter) => {
    // await nextframe();
    //console.log('dbread')
    let data = realm.objects(schema);
    if (filter) {
        data = data.filtered(filter);
    }
    if (length) {
        if (typeof length === 'number') {
            data = data.slice(0, length);
        } else if (Array.isArray(length)) {
            if (length.length === 1) {
                data = data.slice(0, length[0]);
            } else {
                data = data.slice(length[0], length[1]);
            }
        }
    } else {
        data = data.slice(0);

    }
    //console.log(data)
    return data.map(item => {
        const itemOut = {};
        const intemKeys = Object.keys(item);

        intemKeys.forEach(key => {
            //console.log(item)
            if (item[key] && typeof item[key] === 'object') {
                itemOut[key] = item[key].map(i => {
                    return i.id;
                });
            } else {
                itemOut[key] = item[key];
            }
        });
        return itemOut;
    });
};

export const dbdelete = async(schema, filter) => {
    await nextframe();
    let data = realm.objects(schema);
    if (filter) {
        data = data.filtered(filter);
    }
    realm.write(() => {
        realm.delete(data);
    });
};

export const dbwrite = async(schema, data) => {

    await nextframe();
    if (Array.isArray(data)) {
        realm.write(() => {
            data.map(item => {
                realm.create(schema, item);
            });
        });
    } else {
        realm.write(() => {
            realm.create(schema, data);
        });
    }
};



function boolyfie(data) {
    if (data === 'true' || data === 'false') {
        data = (data == 'true');
    }
    return data
}


export const dbupdate = async(schema, data) => {
    await nextframe();
    dbdelete(schema)
    //console.log(schema,data)
    if (Array.isArray(data)) {
        realm.write(() => {
            data.map(item => {
                create(schema, item, true);
            });
        });
    } else {
        realm.write(() => {
            create(schema, data, true);
        });
    }
};

const create = (schema, itemIn, update) => {
    const item = Object.assign({},itemIn);
    try {
        for (let i in item) {
            if (Array.isArray(item[i])) {
                item[i] = item[i].map(s =>{
                        if(s)
                            return {id: s};
                    }
                )
            }
        }
        //console.log(schema,item)
        realm.create(schema, item, update);
    } catch (e) {
        //console.log(schema, item);
        //console.log(e);
        throw e;
    }
};

export const path = () => {
    //console.log(realm.path)
};

    */