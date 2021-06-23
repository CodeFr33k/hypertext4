import csp from '../../github.com/CodeFr33k/js-csp';

export default function(fetch) {
    const result = csp.chan();
    fetch('/api/records')
        .then((res) => {
            const hash = res.headers.get('ETag');
            return Promise.all([hash, res.json()]);
        })
        .then(([hash, records]) => {
            csp.putAsync(result, [hash, records]);
        })
    return result;
}

