const fs = require('fs');
const csv = require('csv-parser');

function matchRadec(ra, dec, fieldCorners) {
    const matches = [];
    for (let [idx, corners] of fieldCorners.entries()) {
        const [raCorners, decCorners] = [corners.map(c => c[0]), corners.map(c => c[1])];
        const raMin = Math.min(...raCorners);
        const raMax = Math.max(...raCorners);
        const decMin = Math.min(...decCorners);
        const decMax = Math.max(...decCorners);

        if (raMin <= ra && ra <= raMax && decMin <= dec && dec <= decMax) {
            matches.push(idx);
        }
    }
    return matches;
}

function getFieldCorners(callback) {
    const fieldCorners = [];
    fs.createReadStream('/datapool/ATMA00/atma_drifctscan_info_with_corners.csv')
        .pipe(csv())
        .on('data', (row) => {
            try {
                const corners = JSON.parse(row['field_corners']); // Adjust the key based on your CSV structure
                fieldCorners.push(corners);
            } catch (error) {
                console.error(`Error parsing JSON: ${error.message}`);
            }
        })
        .on('end', () => {
            callback(fieldCorners);
        });
}

function processRadec(ra, dec, callback) {
    getFieldCorners((fieldCorners) => {
        const matchedIndices = matchRadec(parseFloat(ra), parseFloat(dec), fieldCorners);
        const matchedFiles = [];
        fs.createReadStream('/datapool/ATMA00/atma_drifctscan_info_with_corners.csv')
            .pipe(csv())
            .on('data', (row) => {
                matchedIndices.forEach(idx => {
                    const filePaths = JSON.parse(row['file_paths']); // Adjust based on your CSV structure
                    if (filePaths[idx]) {
                        matchedFiles.push(filePaths[idx].split('/').slice(-2).join('+'));
                    }
                });
            })
            .on('end', () => {
                callback(matchedFiles.slice(0, 10));
            });
    });
}

module.exports = { processRadec };

// Example usage:
// processRadec(16.684, -25.269, (result) => console.log(result));

// const fs = require('fs');
// const csv = require('csv-parser');

// function matchRadec(ra, dec, fieldCorners) {
//     const matches = [];
//     for (let [idx, corners] of fieldCorners.entries()) {
//         const [raCorners, decCorners] = [corners.map(c => c[0]), corners.map(c => c[1])];
//         const raMin = Math.min(...raCorners);
//         const raMax = Math.max(...raCorners);
//         const decMin = Math.min(...decCorners);
//         const decMax = Math.max(...decCorners);

//         if (raMin <= ra && ra <= raMax && decMin <= dec && dec <= decMax) {
//             matches.push(idx);
//         }
//     }
//     return matches;
// }

// function getFieldCorners(callback) {
//     const fieldCorners = [];
//     fs.createReadStream('/datapool/ATMA00/atma_drifctscan_info_with_corners.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             const corners = JSON.parse(row['field_corners']); // Adjust the key based on your CSV structure
//             fieldCorners.push(corners);
//         })
//         .on('end', () => {
//             callback(fieldCorners);
//         });
// }

// function processRadec(ra, dec, callback) {
//     getFieldCorners((fieldCorners) => {
//         const matchedIndices = matchRadec(parseFloat(ra), parseFloat(dec), fieldCorners);
//         fs.createReadStream('/datapool/ATMA00/atma_drifctscan_info_with_corners.csv')
//             .pipe(csv())
//             .on('data', (row) => {
//                 if (matchedIndices.length > 0) {
//                     const matchedFiles = matchedIndices.map(idx => {
//                         return row['file_paths'][idx]; // Adjust based on your CSV structure
//                     });
//                     callback(matchedFiles.map(path => path.split('/').slice(-2).join('+')).slice(0, 10));
//                 }
//             });
//     });
// }
// module.exports= {processRadec};
// // Example usage:
// // processRadec(16.684, -25.269, (result) => console.log(result));

