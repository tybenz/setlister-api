var Artist = BaseModel.extend({
    songs: function() {
        return this.hasMany( Song );
    }
});

global.Artist = Artist;
module.exports = Artist;
