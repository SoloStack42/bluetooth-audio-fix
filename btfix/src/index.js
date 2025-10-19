module.exports = (Kettu) => {
  let client = Kettu.client;

  const { Client } = require('discord.js');

  // Check if we are on an iOS device
  function isIOSDevice() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  if (isIOSDevice()) {
    console.log('iOS detected, preventing handsfree mode');

    // Listen for voice state update events to detect when you join/leave a call.
    client.on('voiceStateUpdate', (oldVoiceState, newVoiceState) => {
      const guild = oldVoiceState.guild;
      if (!guild || !newVoiceState.channel) return;

      if (newVoiceState.channel.type === 'voice' && 
          (oldVoiceState.channel?.id !== newVoiceState.channel.id || !oldVoiceState.channel)) {

        // We just joined a voice channel or moved to one.
        
        try {
          const win = window; // Access the Electron window object
          setTimeout(() => {
            try {
              // Attempt to find and toggle off handsfree mode if it's active. Note: This requires knowing Discord's specific class names, which might change.

              // Example selector (this may not work without actual inspection):
              let handsfreeToggle = win.document.querySelector('.some-class-name'); 

              // Toggle the button multiple times or interact with it to turn off handsfree mode.
              if (handsfreeToggle) {
                console.log('Found and disabling handsfree toggle');
                try {
                  handsfreeToggle.click();
                  setTimeout(() => { 
                    // This might need adjustment based on actual Discord structure
                    let toggleState = win.document.querySelector('.some-other-class')?.getAttribute('aria-checked');  
                    if (toggleState === 'false') { console.log("Handsfree disabled successfully"); } else { console.log("Failed to disable handsfree mode"); }
                  }, 500);
                } catch(e) {
                  console.error('Error toggling handsfree toggle');
                }
              }
            } catch(e) {
              console.error('Error accessing DOM', e);
            }
          }, 2000); // Wait for the voice channel to load
        });
      }

    });

  }

};