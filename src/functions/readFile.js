import * as csp from 'js-csp';
import fs from 'fs';

export default function(file) {
    return csp.go(function*() {
        const buffer = fs.readFileSync(file);
        const text = buffer.toString();
        const lines = text.split('\n');
        return lines;
    });
}

