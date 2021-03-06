Flowfeeds.ApplicationRoute = Ember.Route.extend({
  events: {
    play: function(playable, controller) {
      this.skipable = controller.get('target');
      this.controllerFor('player').play(playable);
    },

    previous: function() {
      if(this.skipable) this.skipable.send('previous');
    },

    next: function() {
      if(this.skipable) this.skipable.send('next');
    },

    createPlaylist: function() {
      var name = prompt("What would you like to name your new playlists?");
      if(!Ember.isEmpty(name)) {
        var playlists = this.controllerFor('playlists');
        Flowfeeds.Playlist.createPlaylist(name).then(function(playlist) {
          playlists.pushObject(playlist);
        });
      }
    },

    deletePlaylist: function(playlist) {
      this.controllerFor('playlists').removeObject(playlist);
      this.transitionTo('index');
      playlist.destroyRecord();
    },

    logout: function() {
      Ember.$.ajax({
        url: "sessions",
        type: "DELETE",
        context: this,
        success: function(json) {
          this.send('userDidLogout');
          this.controllerFor('login').set('message', json.message);
          this.transitionTo("login");
        }
      });
    },

    userDidLogin: function(user) {
      Flowfeeds.set('user', user);
      Flowfeeds.Genre.loadAll();

      var playlistsContoller = this.controllerFor('playlists');
      Flowfeeds.Playlist.loadAll().done(function(playlists) {
        playlistsContoller.set('content', playlists);
      });
    },

    userDidLogout: function() {
      Flowfeeds.set('user', null);
      Flowfeeds.Genre.loadAll();
    }
  }
});
