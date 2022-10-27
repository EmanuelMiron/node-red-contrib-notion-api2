const secret = require('./secret.json');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: secret.auth });

module.exports = function(RED){
    function DataBase (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function(msg, send, done) {

            const query = async () => {
                const database_id = RED.util.evaluateNodeProperty(config["database-id"], config["database-idType"], config, msg);
                const filter = RED.util.evaluateNodeProperty(config["database-filter"], config["database-filterType"], config, msg);
                const sort = RED.util.evaluateNodeProperty(config["database-sort"], config["database-sortType"], config, msg);

                await notion.databases.query({ database_id, filter, sort})
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            switch (config.action) {
                case "insert":
                    node.warn("This feature is not implemented yet. :(");
                    break;
                case "update":
                    node.warn("This feature is not implemented yet. :(");
                    break;
                default:
                    query();
                    break;
            }
        })
    }

    RED.nodes.registerType("notion-api-database", DataBase);
}