import csp from '../../github.com/CodeFr33k/js-csp';

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

