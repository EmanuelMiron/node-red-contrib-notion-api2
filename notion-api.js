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
                var filter = RED.util.evaluateNodeProperty(config["database-filter"], config["database-filterType"], config, msg);
                var sort = RED.util.evaluateNodeProperty(config["database-sort"], config["database-sortType"], config, msg);

                // Check filter and sort if empty
                filter = Object.keys(filter).length === 0 ? undefined : filter
                sort = Object.keys(sort).length === 0 ? undefined : sort

                await notion.databases.query({ database_id, filter, sort})
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            const insert = async () => {
                const parent = {
                    "type": "database_id",
                    "database_id": RED.util.evaluateNodeProperty(config["database-id"], config["database-idType"], config, msg)
                }
                var properties = RED.util.evaluateNodeProperty(config["database-props"], config["database-propsType"], config, msg);

                properties = Object.keys(properties).length === 0 ? undefined : properties

                await notion.pages.create({parent, properties})
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            const update = async () => {
                const page_id = RED.util.evaluateNodeProperty(config["database-update-id"], config["database-update-idType"], config, msg);
                var properties = RED.util.evaluateNodeProperty(config["database-update-props"], config["database-update-propsType"], config, msg);

                properties = Object.keys(properties).length === 0 ? undefined : properties

                await notion.pages.update({ page_id, properties })
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            const deleteItem = async () => {
                const block_id = RED.util.evaluateNodeProperty(config["database-delete-id"], config["database-delete-idType"], config, msg);
                await notion.blocks.delete({block_id})
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
                    insert();
                    break;
                case "update":
                    update();
                    break;
                case "delete":
                    deleteItem();
                    break;
                default:
                    query();
                    break;
            }
        })
    }

    function Page (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function(msg, send, done) {

            const query = async () => {
                const page_id = RED.util.evaluateNodeProperty(config["page-id"], config["page-idType"], config, msg);
                notion.pages.retrieve({ page_id })
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            const create = async () => {
                const properties = RED.util.evaluateNodeProperty(config["page-props"], config["page-propsType"], config, msg);
                const parent = {
                    "type": "page_id",
                    "page_id": RED.util.evaluateNodeProperty(config["page-id"], config["page-idType"], config, msg)
                }
                await notion.pages.create({ parent, properties})
                .then(res => {
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    msg.payload = err;
                    node.error(msg);
                });
            }

            switch (config.action) {
                case "create":
                    create();
                    break;
                case "update":
                    update();
                    break;
                default:
                    query();
                    break;
            }
        });
    }

    RED.nodes.registerType("Notion Database", DataBase);
    RED.nodes.registerType("Notion Page", Page);
}