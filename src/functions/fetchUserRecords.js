import * as csp from 'js-csp';

export default function(fetch) {
    const result = csp.chan();
    fetch('/api/user/records')
        .then((res) => {
            return res.json();
        })
        .then((records) => {
            csp.putAsync(result, records);
        });
    return result;
}

