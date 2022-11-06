module.exports = function(RED){

    function Page (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.notion = RED.nodes.getNode(config.integrationToken).client;
        node.on('input', function(msg, send, done) {

            node.status({fill: "green", shape: "ring", text: "Requesting!"});

            const query = async () => {
                const page_id = RED.util.evaluateNodeProperty(config["page-id"], config["page-idType"], config, msg);
                this.notion.pages.retrieve({ page_id }).then(res => {
                    node.status({fill: "green", shape: "dot", text: "Good Response!"});
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    node.status({fill: "red", shape: "dot", text: "Bad Response!"});
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
                await this.notion.pages.create({ parent, properties})
                .then(res => {
                    node.status({fill: "green", shape: "dot", text: "Good Response!"});
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    node.status({fill: "red", shape: "dot", text: "Bad Response!"});
                    msg.payload = err;
                    node.error(msg);
                });
            }

            const update = async  () => {
                const page_id = RED.util.evaluateNodeProperty(config["page-id"], config["page-idType"], config, msg);
                const properties = RED.util.evaluateNodeProperty(config["page-props"], config["page-propsType"], config, msg);
                await this.notion.pages.update({ page_id, properties })
                .then(res => {
                    node.status({fill: "green", shape: "dot", text: "Good Response!"});
                    msg.payload = res;
                    send(msg);
                }).catch(err => {
                    node.status({fill: "red", shape: "dot", text: "Bad Response!"});
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

    RED.nodes.registerType("Notion Page", Page);
}