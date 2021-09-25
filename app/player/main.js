const phpServer = require('php-server');
 
(async () => {
    const server = await phpServer({
        binary: __dirname+'/lib/php/php.exe',
        base: __dirname+'/web/'
    });
    console.log(`PHP server running at ${server.url}`);
    
})();