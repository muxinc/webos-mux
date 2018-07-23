var app = {
    init: function () {
    	if (this.deviceId == undefined || this.deviceName == undefined)
    		return;

    	console.log("initializing...");
        var container = $('#playerContainer');
        var jqPlayer = $('<video id="thePlayer" controls preload="none" width="100%" height="100%"></video>');
        jqPlayer.append('<source src="' + app.url + '" type="video/m3u8">');
        container.append(jqPlayer);
        this.player = jqPlayer.get(0);

        document.addEventListener('keydown', function (event) {
            switch(this.getKeyCode(event)) {
                case app.KEY_LEFT:
                    if (this.currentBtnIndex > 0)
                        this.currentBtnIndex--;
                    break;
                case app.KEY_RIGHT:
                    if (this.currentBtnIndex < 6)
                        this.currentBtnIndex++;
                    break;
                case app.KEY_OK:
                    switch(this.currentBtnIndex) {
                        case 0:
                            this.play();
                            break;
                        case 1:
                            this.stop();
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                        case 5:
                            break;
                    }
                    break;
                default:
                    break;
            }
            switch(this.currentBtnIndex) {
                case 0:
                    $('#btnPlay').focus();
                    break;
                case 1:
                    $('#btnStop').focus();
                    break;
                case 2:
                    $('#btnPause').focus();
                    break;
                case 3:
                    $('#btnResume').focus();
                    break;
                case 4:
                    $('#btnRewind').focus();
                    break;
                case 5:
                    $('#btnForward').focus();
                default:
                    break;
            }
            event.preventDefault();
            return true;
        }.bind(this));      
        this.currentBtnIndex = 0;
        $('#btnPlay').focus();
    },

    getKeyCode: function(event) {
        switch (event.keyCode) {
            case 40:
                return app.KEY_DOWN;
            case 37:
                return app.KEY_LEFT;
            case 39:
                return app.KEY_RIGHT;
            case 38:
                return app.KEY_UP;
            case 13:
                return app.KEY_OK;
            case 8:
            case 27:
            case 10009:
                return app.KEY_BACK;
            case 412:
                return app.KEY_REWIND;
            case 19:
                return app.KEY_PAUSE;
            case 417:
                return app.KEY_FORWARD;
            case 415:
                return app.KEY_PLAY;
            case 413:
                return app.KEY_STOP;
            default:
                return app.KEY_UNKNOWN;
        }
    },

    play: function() {
    	this.player.play();   
    },

    stop: function() {
    	this.player.pause();
    }
};

$(document).ready(function () {
    app.KEY_UNKNOWN = -1;
    app.KEY_OK = 0;
    app.KEY_INFO = 1;
    app.KEY_UP = 2;
    app.KEY_DOWN = 3;
    app.KEY_LEFT = 4;
    app.KEY_RIGHT = 5;
    app.KEY_REWIND = 6;
    app.KEY_FORWARD = 7;
    app.KEY_MENU = 8;
    app.KEY_PLAY = 9;
    app.KEY_PAUSE = 10;
    app.KEY_BACK = 11;
    app.KEY_STOP = 12;
    app.url = 'http://184.72.239.149/vod/smil:BigBuckBunny.smil/playlist.m3u8';
    //app.url = 'https://cspan1nontve-lh.akamaihd.net/i/CSpan1NonTVE_1@312667/index_400_av-p.m3u8';
    
    webOS.service.request('luna://com.webos.service.sm', {
        method: 'deviceid/getIDs',
        parameters: {
            'idType': ['LGUDID']
        },
        onSuccess: function (data) {
            app.deviceId = data.idList[0].idValue;
            app.init();
        }.bind(this),
    });
    webOS.service.request('luna://com.webos.service.tv.systemproperty', {
        method: 'getSystemInfo',
        parameters: {
            'keys': ['modelName', 'firmwareVersion', 'sdkVersion']
        },
        onSuccess: function (data) {
            app.deviceName = data.modelName;
            app.fwVersion = data.firmwareVersion;
            app.sdkVersion = data.sdkVersion;
            app.init();
        }
    });
});
