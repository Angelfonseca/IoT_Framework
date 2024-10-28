const fs = require('fs');
const path = require('path');

const modules = {};
const dirPath = __dirname;

fs.readdirSync(dirPath).forEach((file) => {
    if (file === 'index.js') return; 
    const moduleName = file.replace(/\.js$/, '');
    const modulePath = path.join(dirPath, file);
    modules[moduleName] = require(modulePath);
});

// Log para depurar
console.log("Módulos cargados:", modules);

const listModules = () => Object.keys(modules);

module.exports = { modules, listModules };
