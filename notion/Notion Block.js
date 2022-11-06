module.exports = function(RED){

    function Block (config){
        RED.nodes.createNode(this, config);
        const node = this;
        this.notion = RED.nodes.getNode(config.integrationToken).client;

        node.on('input', function(msg, send, done) {

            const query = async () => {
                node.send("This Feature is not implemented yet :(")
            }

            const queryChildren = async = () => {
                node.send("This Feature is not implemented yet :(")
            }

            const appendChildren = async = () => {
                node.send("This Feature is not implemented yet :(")
            }

            const update = async = () => {
                node.send("This Feature is not implemented yet :(")
            }

            const deleteBlock = async = () => {
                node.send("This Feature is not implemented yet :(")
            }


            switch (config.action) {
                case "query-children":
                    queryChildren();
                    break;
                case "append-children":
                    appendChildren();
                    break;
                case "update":
                    update();
                    break;
                case "delete":
                    deleteBlock();
                    break;
                default:
                    query();
                    break;
            }
        })
    }

    RED.nodes.registerType("Notion Block", Block);
}