var passwordHash = require( 'password-hash' );

var UsersController = {
    index: function( params ) {
        var users = new Users();
        return { result: users.fetch() }
    },

    show: function( params ) {
        var user = new Users( { id: params.id } );
        return { result: user.fetch() };
    },

    create: function( params ) {
        var hash = passwordHash.generate( params.password );
        var encrypted_password = hash.split( '$' )[ 3 ];
        var salt = hash.split( '$' )[ 1 ];

        var user = new User({
            email: params.email,
            encrypted_password: encrypted_password,
            salt: salt
        });

        return { result: user.save() };
    },

    update: function( params ) {
        var user = new User( { id: params.id } );

        return { result: user.save( params )}
    },

    destroy: function( params ) {
        var user = new User( { id: params.id } );

        return { result: user.destroy() }
    }
};

module.exports = UsersController;
