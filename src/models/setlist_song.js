var SetlistSong = BaseModel.extend({
    song: function() {
        return this.belongsTo( Song );
    },

    setlist: function() {
        return this.belongsTo( Setlist );
    }
});

module.exports = SetlistSong;
