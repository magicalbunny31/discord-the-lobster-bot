// each voice connection has music data,
// with its own queue per-guild
// this will also handle error/reconnecting logic, too

// this file is also pretty much a rewritten version of: https://github.com/discordjs/voice/blob/main/examples/music-bot


import wait from "../assets/wait.js";

import { Track } from "./track.js";

import { ThreadChannel } from "discord.js";
import { VoiceConnection, createAudioPlayer, VoiceConnectionStatus, VoiceConnectionDisconnectReason, entersState, AudioPlayerStatus } from "@discordjs/voice";



// why use classes?
// well, here's some of my reasons~
// one: this is pretty much an object, so it can reference itself (or else i'd end up having multiple files with multiple parameters/arguments)
// two: it's simpler
// three: classes are awesome
export class Player {
   // create a Player
   /** @param {VoiceConnection} connection @param {ThreadChannel} thread */
   constructor(connection, thread) {
      this.connection = connection;          // the voice connection to a voice channel
      this.player     = createAudioPlayer(); // the channel's audio player
      this.thread     = thread;              // the thread this player is attached to
      this.current    = false;               // the current track playing
      this.queue      = [];                  // this guild's queue
      this.lockQueue  = false;               // lock the queue for any new entries
      this.lockReady  = false;               // lock the player for any modifications
      this.loopSingle = false;               // whether to loop a single track or not
      this.loopQueue  = false;               // whether to loop the whole queue or not


      // logic for each voice connection status
      this.connection.on(`stateChange`, async newState => {
         if (newState.status === VoiceConnectionStatus.Disconnected) { // the connection to the voice channel has been severed, however we can still attempt to reconnect

            if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) { // don't try to manually reconnect; it could either mean that the bot was moved to a new channel or it was removed from the voice channel
               try {
                  await entersState(this.connection, VoiceConnectionStatus.Connecting, 5000); // attempt to reconnect back to connecting in five seconds, if it hasn't then the promise will reject
               } catch {
                  this.connection.destroy(); // couldn't reconnect, destroy the connection
               };

            } else if (this.connection.rejoinAttempts < 5) { // this disconnect is recoverable, try to reconnect for a maximum of five tries
               await wait((this.connection.rejoinAttempts + 1) * 5000);
               this.connection.rejoin(); // attempt to rejoin the voice channel

            } else { // well we did all we can chef, just disconnect
               this.connection.destroy();
            };

         } else if (newState.status === VoiceConnectionStatus.Destroyed) { // the connection has been destroyed, stop this data
            this.stop();

         } else if (!this.lockReady && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) { // the connection is trying to connect to the voice channel
            this.lockReady = true; // lock ready

            try {
               await entersState(this.connection, VoiceConnectionStatus.Ready, 20000); // attempt to connect in twenty seconds, if it hasn't then the promise will reject

            } catch {
               if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) // couldn't connect, destroy the connection if it hasn't already
                  this.connection.destroy();

            } finally {
               this.lockReady = false; // unlock ready
            };

         }; // this state change isn't of any concern
      });


      // logic for the audio player
      this.player.on(`stateChange`, async (oldState, newState) => {
         if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) { // the current audio resource has finished playing!
            oldState.resource.metadata.onFinish(); // attempt to start playing the next track in the queue
            void this.processQueue();

         } else if (newState.status === AudioPlayerStatus.Playing) { // the current audio resource is now playing
            newState.resource.metadata.onStart();

         }; // this state change isn't of any concern
      });


      // there's an error, do something about it man
      this.player.on(`error`, error => error.resource.metadata.onError(error));

      // subscribe this connection to the player
      connection.subscribe(this.player);
   };



   // add a track to the queue
   /** @param {Track} track */
   enqueue(track) {
      this.queue.push(track);   // add this track to the queue
      void this.processQueue(); // process the queue
   };



   // stop the player
   stop() {
      this.lockQueue = true; // lock the queue
      this.queue     = [];   // clear the queue

      this.player.stop(true); // stop the player
   };



   // try to play the next track in the queue
   async processQueue() {
      if (this.lockQueue || this.player.state.status !== AudioPlayerStatus.Idle || !this.queue.length) // the queue is locked (being processed), playing something, is paused or locked so don't do anything
         return;

      this.lockQueue = true; // lock the queue
      const nextTrack = this.loopSingle
         ? this.current        // get the track that just played
         : this.queue.shift(); // get the next track

      if (this.loopQueue)
         this.queue.push(this.current); // add the track that just played back to the end of the list

      this.current = nextTrack; // update the track that just played

      try { // try to start playing the track
         const resource = await nextTrack.createAudioResource();
         this.lockQueue = false;
         this.player.play(resource);

      } catch (error) { // an error occurred trying to play this track, skip to the next track in the queue instead
         nextTrack.onError(error);
         this.lockQueue = false;
         return this.processQueue();
      };
   };
};