var mongoose = require('mongoose');
var User = mongoose.model('User');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport) {

     passport.serializeUser(function(user, done) {
        done(null, user);
    });

     passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    // Configuración del autenticado con Twitter
	passport.use(new TwitterStrategy({
		consumerKey		 : '1qFRiM11BEzgyVrlBYHHXjtcE',
		consumerSecret	: 'MzMUjR585Tb3bWjP0KOP5UDzq1wrWTHYOLNPc54k1roJsIMt4N',
		callbackURL		 : '/auth/twitter/callback'
	}, function(accessToken, refreshToken, profile, done) {
		// Busca en la base de datos si el usuario ya se autenticó en otro
		// momento y ya está almacenado en ella
		User.findOne({provider_id: profile.id}, function(err, user) {
			if(err) throw(err);
			// Si existe en la Base de Datos, lo devuelve
			if(!err && user!= null) return done(null, user);

			// Si no existe crea un nuevo objecto usuario
			var user = new User({
				provider_id	: profile.id,
				provider		 : profile.provider,
				name				 : profile.displayName,
        photo				: profile.photos[0].value
			});
			//...y lo almacena en la base de datos
			user.save(function(err) {
				if(err) throw err;
				done(null, user);
			});
		});
	}));

     passport.use(new FacebookStrategy({
        clientID: '356249854732540',
        clientSecret: '98193a8c62c6ab1241d71f0e50b72c4e',
        callbackURL: '/auth/facebook/callback'
    }, function(accessToken, refreshToken, profile, done) {
        console.log('token: '+accessToken+' '+profile.id+' '+profile.displayName);
        User.findOne({provider_id: profile.id}, function(err, user) {
            if(err) throw(err);
            if(!err && user!= null){
                console.log('user != null');
                return done(null, user);
            }

            var user = new User({
                provider_id: profile.id,
                provider: profile.provider,
                name: profile.displayName,
                photo: profile.photos[0].value
            });

            user.save(function(err) {
                if(err) throw err;
                console.log('ok');
                done(null, user);
            });
        });
    }));
 }
