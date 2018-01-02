/**
 * Created by flomair on 10.05.17.
 */
import performanceNow from 'performance-now'

function throttle(func, wait, ctx, immediate = true) {
    let timeoutRefId;
    let args;
    let context;
    let timestamp;
    let result;

    const later = () => {
        const last = performanceNow() - timestamp;

        if (last < wait && last >= 0) {
            timeoutRefId = setTimeout(later, wait - last);
        } else {
            timeoutRefId = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeoutRefId) context = args = null;
            }
        }
    };

    return () => {
        context = ctx || this;
        // eslint-disable-next-line prefer-rest-params
        args = arguments;
        timestamp = performanceNow();
        const callNow = immediate && !timeoutRefId;
        if (!timeoutRefId) timeoutRefId = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
export default throttle