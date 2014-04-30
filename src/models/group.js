var Group = BaseModel.extend({
    users: function() {
        return this.belongsToMany( User ).through( GroupUser );
    },
    setlists: function() {
        return this.hasMany( Setlist );
    }
});

module.exports = Group;
