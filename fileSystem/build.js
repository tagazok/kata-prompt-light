const { write } = require('fs');
const fs = require('fs/promises');

const files = {}

languageToExtension = {
    javascript: 'js',
    python: 'py'
};

async function getPackageJSON() {
    try {
        const data = await fs.readFile('./files/package.json', { encoding: 'utf8' });
        // console.log(data);
        return data;
    } catch (err) {
        // console.log(err);
    }
}

async function generateChallenges() {

    const obj = {
    }

    const languages = (await fs.readdir('./files/challenges', { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dir => dir.name);

    for (const language of languages) {
        obj[language] = {directory: {}};
        const challenges = (await fs.readdir(`./files/challenges/${language}`, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dir => dir.name);

        for(const challenge of challenges ) {
            const test = await fs.readFile(`./files/challenges/${language}/${challenge}/test.${languageToExtension[language]}`, { encoding: 'utf8' });

            let challengeDescription = "";
            try {
                challengeDescription = await fs.readFile(`./files/challenges/${language}/${challenge}/challenge.txt`, { encoding: 'utf8' });
                console.log(challengeDescription);
            } catch (error) {
                console.log(error);
            }

            const filename = `test.${languageToExtension[language]}`;
            obj[language].directory[challenge] = {
                directory: {
                    [filename]: { file: {contents: `${test}`} },
                    "challenge.txt": { file: { contents: `${challengeDescription}`}}
                }
            };
            
            // console.log(test);

        }
    }
    require('util').inspect.defaultOptions.depth = null;
    // console.log(obj);
    return obj;
}

async function writeFile(text) {
    const fileContent = `
    export const files: any = 
        ${JSON.stringify(text)}
    ;
        `;
        // console.log(fileContent);
    fs.writeFile('./files.ts', fileContent);
}
async function buildFile() {
    // const packageJSON = await getPackageJSON();
   
    // files['package.json'] = {
    //     file: {
    //         contents: `\`${packageJSON}\``
    //     }
    // };
    

    const obj = await generateChallenges();
    const packageJSON = await getPackageJSON();
    obj['package.json'] = {
        file: {
            contents: packageJSON
        }
    };
    writeFile(obj);
}
buildFile();