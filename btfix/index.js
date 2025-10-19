// This is just an example. Actual implementation may require more specific details about Kettu's plugin architecture.

const { KettuPlugin } = require('kettu');

class DisableHandsfreeMode extends KettuPlugin {
  constructor(client) {
    super(client);
    this._callStartHandlers = [];
  }

  enable() {
    // Listen for voice state updates
    this.client.on("voiceStateUpdate", (oldState, newState) => {
      if (!newState.channel?.call && oldState.inCall !== newState.inCall) {
        // Check if the user is on iOS device.
        if (this.client.utils.isIOS()) {
          if (newState.inCall) {
            this.disableHandsfreeMode(newState);
          }
        }
      }
    });

    this.client.on("callStarted", call => {
      // Store call start handlers
      this._callStartHandlers.push(call);
    });
  }

  disableHandsfreeMode(call) {
    // Here you should implement the logic to disable hands-free mode.
    // This would involve finding and manipulating Discord's internal DOM elements, which is not recommended as it may lead to account bans or other issues.
    console.log("Disabling Hands-Free Mode for call with ID: " + call.callId);
  }

  disable() {
    this.client.off("voiceStateUpdate", this.voiceStateUpdate);
    this.client.off("callStarted", this.callStarted);

    // Remove stored call start handlers
    while (this._callStartHandlers.length) {
      const call = this._callStartHandlers.shift();
      if (!call) return;
      DiscordClient.delete(call).then(() => console.log(`Deleted ${call}`));
    }
  }

}

module.exports = DisableHandsfreeMode;
