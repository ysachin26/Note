const dns = require('dns')


const dnsFallBackMechanism = () => {
    const currentServers = dns.getServers();

    const isBroken = currentServers.length > 0 && currentServers.every(
        //checking ipve and ipv addresses of my machine
        (server) => server === '127.0.0.1' || server === '::1'
    )

    if (!isBroken) return;

    const serverSetup = (process.env.FALLBACK_SERVER || ' 8.8.8.8,1.1.1.1').split(',')
        .map(server => server.trim())
        .filter(Boolean);

    if (serverSetup.length === 0) return;

    try {
        dns.setServers(serverSetup);
    } catch (error) {
        console.warn('Could not apply DNS fallback servers:', error.message);
    }
}
module.exports = { dnsFallBackMechanism }
