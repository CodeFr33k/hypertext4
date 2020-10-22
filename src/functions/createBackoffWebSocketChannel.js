import * as csp from 'js-csp';

export default function(websocketFactory) {
    const chan = csp.chan();
    let websocketChannel = websocketFactory();
    csp.go(function*() {
        while(true) {
            const msg = yield csp.take(websocketChannel);
            if(msg === csp.CLOSED) {
                yield csp.sleep(2000);
                websocketChannel = websocketFactory(); 
                continue;
            }
            yield csp.put(chan, msg);
        }
    });
    return chan;
}

