// PreventHandsfreeMode.ts

// Function to prevent handsfree mode
function preventHandsfreeMode(): void {
    // Check if the platform is iOS
    if (navigator.platform.includes('iPhone') || navigator.platform.includes('iPad') || navigator.platform.includes('iPod')) {
        // Override the default behavior of enabling handsfree mode
        window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        });

        // Monitor for changes in the audio output settings
        const originalSetSinkId = window.RTCPeerConnection.prototype.setSinkId;
        window.RTCPeerConnection.prototype.setSinkId = function(this: RTCPeerConnection, sinkId: string): Promise<void> {
            if (sinkId === 'handsfree') {
                // Prevent setting the sink to handsfree
                return Promise.resolve();
            }
            return originalSetSinkId.call(this, sinkId);
        };

        // Additional hook for Kettu-specific audio settings
        if (typeof Kettu !== 'undefined' && Kettu.audio) {
            const originalSetAudioOutput = Kettu.audio.setAudioOutput;
            Kettu.audio.setAudioOutput = function(this: typeof Kettu.audio, output: string): Promise<void> {
                if (output === 'handsfree') {
                    // Prevent setting the output to handsfree
                    return Promise.resolve();
                }
                return originalSetAudioOutput.call(Kettu.audio, output);
            };
        }
    }
}

// Initialize the plugin
function onPluginStart(): void {
    preventHandsfreeMode();
}

// Export the plugin definition
export = {
    onPluginStart
};
