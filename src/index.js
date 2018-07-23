// import window from 'global/window'; // Remove if you do not need to access the global `window`
// import document from 'global/document'; // Remove if you do not need to access the global `document`
import mux from 'mux-embed';

const log = mux.log;
const assign = mux.utils.assign;
// const getComputedStyle = mux.utils.getComputedStyle; // If necessary to get

// Helper function to generate "unique" IDs for the player if your player does not have one built in
const generateShortId = function () {
  return ('000000' + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6);
};

const monitorWebOSPlayer = function (player, options) {
  // Make sure we got a player - Check properties to ensure that a player was passed
  if (player.tagName !== ' VIDEO') {
    log.warn('[WebOS-mux] You must provide a valid WebOS to monitorWebOSPlayer.');
    return;
  }

  // Accessor for event namespace if used by your player
  // const YOURPLAYER_EVENTS = || {};

  // Prepare the data passed in
  options = options || {};

  options.data = assign({
    player_software_name: 'WebOS AVPlayer',
    player_software_version: webapis.avplay.getVersion(), // Replace with method to retrieve the version of the player as necessary
    player_mux_plugin_name: 'WebOS-mux',
    player_mux_plugin_version: '0.1.0',
  }, options.data);

  // Retrieve the ID and the player element
  const playerID = generateShortId(); // Replace with your own ID if you have one that's unique per player in page

  // Enable customers to emit events through the player instance
  player.mux = {};
  player.mux.emit = function (eventType, data) {
    mux.emit(playerID, eventType, data);
  };

  // Allow mux to automatically retrieve state information about the player on each event sent
  // If these properties are not accessible through getters at runtime, you may need to set them
  // on certain events and store them in a local variable, and return them in the method e.g.
  //    let playerWidth, playerHeight;
  //    player.on('resize', (width, height) => {
  //      playerWidth = width;
  //      playerHeight = height;
  //    });
  //    options.getStateData = () => {
  //      return {
  //        ...
  //        player_width: playerWidth,
  //        player_height: playerHeight
  //      };
  //    };
  options.getStateData = () => {
    let stateData = {
      // Required properties - these must be provided every time this is called
      // You _should_ only provide these values if they are defined (i.e. not 'undefined')
      player_width: player.offsetWidth,
      player_height: player.offsetHeight,

      // Preferred properties - these should be provided in this callback if possible
      // If any are missing, that is okay, but this will be a lack of data for the customer at a later time
      player_is_fullscreen: player.fullscreen,
      player_autoplay_on: player.autoplay,
      player_preload_on: player.preload,
      video_source_url: player.url,
      video_source_mime_type: player.mimeType,

      // Optional properties - if you have them, send them, but if not, no big deal
      video_poster_url: player.poster,
      player_language_code: player.language,
    };

    // Additional required properties
    var state = webapis.avplay.getState();
    stateData.player_is_paused = (state == 'NONE' || state == 'IDLE' || state == 'READY' || state == 'PAUSED');
    if (videoSourceWidth != 0) {
      stateData.video_source_width = videoSourceWidth;
    }
    if (videoSourceHeight != 0) {
      stateData.video_source_height = videoSourceHeight;
    }
    // Additional peferred properties
    if (lastPlayerState != 'NONE' && lastPlayerState != 'IDLE') {
      const duration = webapis.avplay.getDuration();
      stateData.video_source_duration = (duration == 0 ? Infinity : duration);
    }

    return stateData;
  };

  // Lastly, initialize the tracking
  mux.init(playerID, options);
};

const stopMonitor = function (player) {
  player.mux.emit('destroy');
  player.mux.emit = function(){};
}

export { monitorWebOSPlayer, stopMonitor };
