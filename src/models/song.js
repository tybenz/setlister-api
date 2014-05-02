var Song = BaseModel.extend({
    setlists: function() {
        return this.belongsToMany( Setlist ).through( SetlistSong );
    },

    artist: function() {
        return this.belongsTo( Artist );
    }
});

module.exports = Song;
