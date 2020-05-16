const LocalStrategy = require('passport-local')
const User = require('./../model/user')

module.exports = (passport) => {
    passport.serializeUser((user, cb) => {
        return cb(null, user._id)
    })

    passport.deserializeUser((id, cb) => {
        User.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err, {}))
    })

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username', 
        passwordField: 'password', 
        passReqToCallback: true
    }, (req, username, password, cb) => {
            User.findOne({username: username})
                .then((userExists) => {
                    if(!userExists) {
                        let user = new User(req.body)
                        user.password = user.genHash(user.password)

                        return user
                                .save()
                                .then((user) => {
                                return cb(null, user)
                            })
                            .catch((error) => {
                                console.log(error)
                                return
                            }) 
                    }
                    return cb(null, false)
                }).catch((err) => {
                    return cb(err, false)
                })
        }
    ))

    //Lógica de Login de fato
    passport.use('local-signin', new LocalStrategy({
        usernameField: 'username', 
        passwordField: 'password', 
        passReqToCallback: true
    }, (req, username, password, cb) => {
            User.findOne({username})
                .then((user) => {
                    console.log('Debbuging Logic of Login' + user)
                    if(!user) {
                        return cb(null, false)
                    }

                    user.valid(password, (err, result) => {
                        if(err) {
                            console.log(`Error found => ${err}`)
                            return cb(null, false)
                        }
                        if(!result) {                            
                            console.log(`DEBUG RESULT VAR => ${result}`)
                            return cb(null, false)
                        }
                        console.log(`Log in of user =>  ${user}`)
                        return cb(null, user)
                    })
                })
                .catch((error) => {
                    console.log(`Error Except => ${error}`)
                    return
                })
        }
    ))
}