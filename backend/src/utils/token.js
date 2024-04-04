import jwt from 'jsonwebtoken'
class Token {
    generateTokenAccess = (user) => {
        return jwt.sign({user}, 'secret', {expiresIn: '1h'})
    }

    verifyTokenAccess = (token) => {
        const { bearer } = token.headers;

        if (!bearer) {
            return false
        }

        return jwt.verify(bearer, 'secret')
    }

    decodeToken = (token) => {
        const {bearer} = token.headers
        const payload = bearer.split('.')[1]
        return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
    }

    getToken = (req) => {
        const {bearer} = req.headers
        return bearer
    }
}

export default new Token()