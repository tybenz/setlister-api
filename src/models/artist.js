var Artist = BaseModel.extend({
    songs: function() {
        return this.hasMany( Song );
    }
});

module.exports = Artist;
