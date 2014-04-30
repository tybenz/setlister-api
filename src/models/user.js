var User = BaseModel.extend({
    groups: function () {
        return this.belongsToMany( Group );
    }
});

global.User = User;
module.exports = User;
