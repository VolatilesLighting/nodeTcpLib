
import {AsyncStorage} from 'react-native';

export default {
    dbreadAll: async() => {
        try {
            let results = {}
            ;
            const keysPre = await AsyncStorage.getAllKeys();
            const keys = keysPre.filter(key => key != '__react_native_storage_test')
            //console.log(keysPre,keys)
            const datas = await AsyncStorage.multiGet(keys)
            datas.forEach((item) =>{
                results[item[0]] = JSON.parse(item[1])
            });
           // console.log(results)
            return (results)
        } catch (e) {
            throw e
        }
    },
    dbupdate: async(key, data) => {


        if(key === 'surfaces'){
            data = data.map(surface =>{
                return {
                    ...surface,
                    key :false,
                    keyType:"public"
                }
            })
        }

        return await AsyncStorage.setItem(key,JSON.stringify(data));
    },
    dbdelete: (item) => {
        return AsyncStorage.removeItem(item)
    },
    erase: () => {
        return AsyncStorage.clear()
    }
}





