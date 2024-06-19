const bctypt = require('bcrypt')

function createHash(password){ 
    passHash = bctypt.hashSync(password, bctypt.genSaltSync(10))
    console.log(passHash)
    return passHash
}

function isValidPassword(userPassword, password){
    const passValid = bctypt.compareSync(password, userPassword)
    console.log(passValid)
    return passValid
}



module.exports = {
    createHash,
    isValidPassword,
}