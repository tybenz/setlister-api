var BaseModel = require( '../db' ).Model;
var inflect = require( 'i' )();
var path = require( 'path' );

var extend = BaseModel.extend;

BaseModel.extend = function( obj ) {
    // build class the same as before
    var newClass = extend.call( this, obj );

    // using getCaller/getStack to grab current
    // function caller's file name/path
    var caller = getCaller();
    var filepath = caller.filename;
    // stripping out path and .js to get the db table name
    var modelname = path.basename( filepath ).replace( /\.js$/, '' );

    newClass.prototype.tableName = inflect.pluralize( modelname );

    return newClass;
}

function getCaller() {
    var stack = getStack();

    // Remove superfluous function calls on stack
    stack.shift(); // getCaller --> getStack
    stack.shift(); // omfg --> getCaller

    // Return caller's caller
    return stack[1].receiver;
}

function getStack() {
    // Save original Error.prepareStackTrace
    var origPrepareStackTrace = Error.prepareStackTrace;

    // Override with function that just returns `stack`
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    }

    // Create a new `Error`, which automatically gets `stack`
    var err = new Error();

    // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
    var stack = err.stack;

    // Restore original `Error.prepareStackTrace`
    Error.prepareStackTrace = origPrepareStackTrace;

    // Remove superfluous function call on stack
    stack.shift(); // getStack --> Error

    return stack;
}

module.exports = BaseModel;
