const jwt= require('jsonwebtoken');

exports.generateToken=(email,role)=>{
    return jwt.sign({email,role},process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );
};
