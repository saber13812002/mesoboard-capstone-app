const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * Why public key? 
 * Because passport is the the verification peace of the jwt process.
 * With a digital signature we sign the issuance with the private key and 
 * then we verify the identity with the public key
 */
const options = {
    // At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Authorization: Bearer <token>
    secretOrKey: PUB_KEY, //public key generated in generateKeypair.js
    algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        /**
         * Behind the scenes the JwtStrategy is taking the options, its grabbing the jwt 
         * from the authorization header, its validating that jwt with the jwt library, and 
         * then when its validated, it passes the payload argument to grab the id of the user 
         * from the payload.sub object
         */
        console.log(jwt_payload);

        // We will assign the `sub` property on the JWT to the database ID of user
        User.findOne({ _id: jwt_payload.sub }, function (err, user) {

            // This flow look familiar?  It is the same as when we implemented the `passport-local` strategy
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user); //returns the user to passport to attach it to the req object
            } else {
                return done(null, false);
            }

        });

    }));
}