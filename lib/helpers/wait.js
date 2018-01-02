/**
 * Created by flomair on 23.03.17.
 */
export default (time, value, fail) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (fail === 'fail') {
                reject(value);
            } else {
                resolve(value);
            }
        },time)
    });
}