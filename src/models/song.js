var Song = BaseModel.extend({
    setlist: function() {
        return this.belongsTo( Setlist );
    },
    artist: function() {
        return this.belongsTo( Artist );
    }
});

module.exports = Song;
