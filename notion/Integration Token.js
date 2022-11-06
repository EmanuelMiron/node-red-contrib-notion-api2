const {Client} = require("@notionhq/client");

module.exports = function(RED) {

    function integrationToken(config){
        RED.nodes.createNode(this, config);
        this.client = new Client({auth: this.credentials.integrationToken});
    }

    RED.nodes.registerType("Integration Token", integrationToken, {
        credentials: {
            integrationToken: {type: "password"}
        }
    });

};