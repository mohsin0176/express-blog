var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use(new LocalStrategy(function(username, password, done) {
    User.findByUsername(username, function(err, result) {
        if(err) throw err;
        if(!result.rows.length) {
            return done(null, false, { message: 'Unknown User' });
        }
        user = result.rows[0];
        User.comparePassword(password, user.password, function(err, isMatch) {
            if(err) throw err;
            if(isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid Password' });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, result) {
        done(err, result.rows[0]);
    });
});

module.exports.passport = passport;

module.exports.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('users/login');
}
