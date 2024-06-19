const passport = require('passport')
const local = require('passport-local')
const GitHubStrategy = require('passport-github2')
const { getUserEmail, registerUser, getUserById } = require('../service/users.services.js')
const { createHash, isValidPassword } = require('../utils/bcryptPassword.js')

const LocalStrategy = local.Strategy

function initialPassport() {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv23liyCSmZpqqs6i1Fc',
            clientSecret: '85a52855c617094414e21814713d2ca89e037db1',
            callbackURL: 'http://localhost:8080/api/session/githubcallback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile_json.email
                console.log({profile}
                )
                const user = await getUserEmail(email)
                if(user){
                    return done (null, user)
                }
                const newUser={
                    name: profile._json.name,
                    email,
                    password:'.$',

                }
                const result = await registerUser({...newUser})
                return done(null, result)
            } catch (error) {
                done(error)
            }
        }

    ))

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const { confirmPassword } = req.body
                if (password !== confirmPassword) {
                    console.log('Las contraseñas no coinciden')
                    return done(null, false)
                }
                const user = await getUserEmail(username)
                if (user) {
                    console.log('El usuario ya existe')
                    return done(null, false)
                }
                req.body.password = createHash(password)

                const newUser = await registerUser({ ...req.body })
                if (newUser) {
                    return done(null, newUser)
                }
                return done(null, false)

            } catch (error) {
                done(error)
            }

        }))
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await getUserEmail(username)
                if (!user) {
                    console.log('El usuario no existe')
                    done(null, false)
                }
                if (isValidPassword(password, user.password)) {
                    console.log('La Password no Coinciden')
                    return done(null, false)
                }
                return done(null, user)

            } catch (error) {
                done(error)
            }
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id)
        done(null, user)
    })
}

module.exports = {
    initialPassport
}