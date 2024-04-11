    const SERVER_TIMEOUT = 10000; 
    const formatMessage = require('format-message');
    const languageNames = require('scratch-translate-extension-languages');
    const ArgumentType = require('../../extension-support/argument-type');
    const BlockType = require('../../extension-support/block-type');
    const Cast = require('../../util/cast');
    const MathUtil = require('../../util/math-util');
    const Clone = require('../../util/clone');
    const log = require('../../util/log');
    const {fetchWithTimeout} = require('../../util/fetch-with-timeout');
  // const abc = global;
class Scratch3Text2SpeechvietnameseBlocks  {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
      
        this._soundPlayers = new Map();
    }
    // const SERVER_TIMEOUT = 10000; 
// const {fetchWithTimeout} = require('fetch-with-timeout.js');
    getInfo() {
        let defaultTextToSpeak = 'xin chào';
        return {
            "id": "text2speechvietnamese",
            "name": "text2speechvietnamese",
            "blocks": [{
                "opcode": "speakAndWait",
                "blockType": "command",
                "text": "đọc [WORDS]?",
                "arguments": {
                    "WORDS": {
                        "type": "string",
                        "defaultValue": defaultTextToSpeak
                    }
                }
            }],
            "menus": {
               
            }
        };
    }
    
    speakAndWait (args, w) {

        // Build up URL
        let path = `https://goosef.com/thaiminhdung/bot_tts.php`;
        path += `?text=${encodeURIComponent(args.WORDS.substring(0, 128))}`;
       // console.log(path);
        //return path;
        //Perform HTTP request to get audio file

   
        // return fetch(path).then(res => {
        //     console.log("res");
        //     console.log(res)
        //     if (res.status !== 200) {
        //         throw new Error(`HTTP ${res.status} error reaching translation service`);
        //     }

        //     return res.arrayBuffer();
        // }).then(buffer => {
        //     // Play the sound
        //     console.log("buffer");
        //     console.log(buffer)
        //     const sound = {
        //         data: {
        //             buffer
        //         }
        //     };
        //     return this.runtime.audioEngine.decodeSoundPlayer(sound);
        // }).then(soundPlayer => {
        //     console.log("soundPlayer");
        //     console.log(soundPlayer)
        //     this._soundPlayers.set(soundPlayer.id, soundPlayer);

        //     soundPlayer.setPlaybackRate(playbackRate);

        //     // Increase the volume
        //     const engine = this.runtime.audioEngine;
        //     const chain = engine.createEffectChain();
        //     chain.set('volume', SPEECH_VOLUME);
        //     soundPlayer.connect(chain);

        //     soundPlayer.play();
        //     return new Promise(resolve => {
        //         soundPlayer.on('stop', () => {
        //             this._soundPlayers.delete(soundPlayer.id);
        //             resolve();
        //         });
        //     });
        // })
        // .catch(err => '');

        return fetchWithTimeout(path, {}, SERVER_TIMEOUT)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`HTTP ${res.status} error reaching translation service`);
                }

                return res.arrayBuffer();
            })
            .then(buffer => {
                // Play the sound
                const sound = {
                    data: {
                        buffer
                    }
                };
                return this.runtime.audioEngine.decodeSoundPlayer(sound);
            })
            .then(soundPlayer => {
                this._soundPlayers.set(soundPlayer.id, soundPlayer);

                soundPlayer.setPlaybackRate(playbackRate);

                // Increase the volume
                const engine = this.runtime.audioEngine;
                const chain = engine.createEffectChain();
                chain.set('volume', SPEECH_VOLUME);
                soundPlayer.connect(chain);

                soundPlayer.play();
                return new Promise(resolve => {
                    soundPlayer.on('stop', () => {
                        this._soundPlayers.delete(soundPlayer.id);
                        resolve();
                    });
                });
            })
            .catch(err => {
                log.warn(err);
            });
     }

}
Scratch.extensions.register(new Scratch3Text2SpeechvietnameseBlocks());