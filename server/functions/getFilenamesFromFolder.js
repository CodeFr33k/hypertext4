import csp from 'js-csp';

export default function(folder, fs) {
    const result = csp.chan();
    fs.readdir(
        folder,
        (err, filenames) => {
            for(const filename of filenames) {
                csp.putAsync(result, folder+filename);
            }
        }
    );
    return result;
}

