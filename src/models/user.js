var passwordHash = require( 'password-hash' );

var User = BaseModel.extend({
    groups: function () {
        return this.belongsToMany( Group ).through( GroupUser );
    },

    setPassword: function( plainText ) {
        var hash = passwordHash.generate( plainText );
        var encryptedPassword = hash.split( '$' )[ 3 ];
        var salt = hash.split( '$' )[ 1 ];

        this.set({
            encrypted_password: encryptedPassword,
            salt: salt
        });
    },

    verify: function ( password ) {
        var email = this.get( 'email' );
        var hash = 'sha1$' + this.get( 'salt' ) + '$1$' + this.get( 'encrypted_password' );

        return passwordHash.verify( password, hash );
    },

    isAdmin: function() {
        return this.get( 'admin' );
    }
});

module.exports = User;
