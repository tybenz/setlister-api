var Setlist = BaseModel.extend({
    songs: function() {
        return this.belongsToMany( Song ).through( SetlistSong );
    },

    setlist_songs: function() {
        return this.hasMany( SetlistSong );
    },

    group: function() {
        return this.belongsTo( Group );
    }
});

module.exports = Setlist;
