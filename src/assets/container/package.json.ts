export const packageJson: any = {
    "file": {
        "contents": `
{
            "name": "example-app",
            "type": "module",
            "dependencies": {
                "express": "latest",
                "nodemon": "latest",
                "jest": "latest",
                "@jest/globals": "latest",
                "python-shell": "latest"
            },
            "scripts": {
                "start": "nodemon --watch './' index.js",
                "jest": "jest"
            }
        }`
    }
}