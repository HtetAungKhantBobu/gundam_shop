const jwt = require("jsonwebtoken");
module.exports.createToken = function (id) {
    let payload = { id };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
}

module.exports.handleErr = function (err) {
    errors = {}
    if (err.code == 11000) {
        let path = Object.keys(Object.values(err)[0].keyPattern)[0]
        errors[path] = `${path} is already taken`;
        return errors;
    }
    if (err.message.includes("validation fail")) {
        Object.values(err.errors).forEach(({ properties }) => {
            //Object.values(err.errors).forEach(({properties})=>e.properties)
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}