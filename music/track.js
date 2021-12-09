// this file manages tracks
// that's it

// ..it has the video's title and url..
// ..who actually requested this track..
// ..and even functions that run on start, finish and error!

// once a track is taken from the queue,
// it's converted into an AudioResource for playback

// this file is also pretty much a rewritten version of: https://github.com/discordjs/voice/blob/main/examples/music-bot


import ytdlCore from "ytdl-core";
const { getInfo } = ytdlCore;

import youtubeDlExec from "youtube-dl-exec";
const { raw: ytdl } = youtubeDlExec;

import { demuxProbe, createAudioResource } from "@discordjs/voice";


export class Track {
   constructor({ title, url, requestedBy, onStart, onFinish, onError }) {
      this.title       = title;
      this.url         = url;
      this.requestedBy = requestedBy;
      this.onStart     = onStart;
      this.onFinish    = onFinish;
      this.onError     = onError;
   };


   createAudioResource() {
      return new Promise((resolve, reject) => {
         const process = ytdl(
				this.url,
				{
					o: `-`,
					q: ``,
					f: `bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio`,
					r: `100K`
				},
				{ stdio: [ `ignore`, `pipe`, `ignore` ] }
			);

         if (!process.stdout)
            return reject(new Error(`no stdout!`));

         const stream = process.stdout;

         process
            .once(`spawn`, () =>
               demuxProbe(stream)
                  .then(probe => resolve(createAudioResource(
                     probe.stream,
                     { metadata: this, inputType: probe.type }
                  )))
            )
            .catch(error => {
               if (!process.killed) process.kill(); // kill the process if it hasn't already
               stream.resume();
               reject(error);
            });
      });
   };



   /** @param {string} url @param {string} requesterId @param {Pick<Track, `onStart` | `onFinish` | `onError`>} methods */
   static async loadTrack(url, requesterId, methods) {
      const info  = await getInfo(url);
      const title = info.videoDetails.title;

      const wrappedMethods = { // these methods will only ever be called once
         onStart() {
            wrappedMethods.onStart = () => {};
            methods.onStart(title, requesterId);
         },
         onFinish() {
            wrappedMethods.onFinish = () => {};
            methods.onFinish();
         },
         onError(error) {
            wrappedMethods.onError = () => {};
            methods.onError(error);
         }
      };

      return new Track({
         title: title,
         url: `https://youtu.be/${info.videoDetails.videoId}`,
         requestedBy: requesterId,
         ...wrappedMethods
      });
   };
};