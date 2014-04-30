var User = BaseModel.extend({
    groups: function () {
        return this.belongsToMany( Group );
    }
});

module.exports = User;
