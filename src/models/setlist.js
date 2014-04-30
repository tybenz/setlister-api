var Setlist = BaseModel.extend({
    songs: function() {
        return this.hasMany( Song ).through( SetlistSong );
    },
    group: function() {
        return this.belongsTo( Group );
    }
});

module.exports = Setlist;
