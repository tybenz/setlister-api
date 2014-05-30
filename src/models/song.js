var Song = BaseModel.extend({
    group: function() {
        return this.belongsTo( Group );
    },

    setlists: function() {
        return this.belongsToMany( Setlist ).through( SetlistSong );
    },

    artist: function() {
        return this.belongsTo( Artist );
    }
});

module.exports = Song;
