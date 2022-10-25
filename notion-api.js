module.exports = function(RED){
    function test (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function(msg, send, done) {
            msg.test = "Just a test";

            send(msg);
        })
    }
    
    RED.nodes.registerType("notion-api-test", test);
}