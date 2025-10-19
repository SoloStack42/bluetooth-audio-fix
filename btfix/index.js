// PreventHandsfreeMode.js

// Function to prevent handsfree mode
function preventHandsfreeMode() {
    // Override the default behavior of enabling handsfree mode
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });

    // Monitor for changes in the audio output settings
    const originalSetSinkId = window.RTCPeerConnection.prototype.setSinkId;
    window.RTCPeerConnection.prototype.setSinkId = function(sinkId) {
        if (sinkId === 'handsfree') {
            // Prevent setting the sink to handsfree
            return Promise.resolve();
        }
        return originalSetSinkId.call(this, sinkId);
    };
}

// Initialize the plugin
function onPluginStart() {
    preventHandsfreeMode();
}

// Export the plugin definition
module.exports = {
    onPluginStart
};
