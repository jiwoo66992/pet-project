import jwt from 'jsonwebtoken'
import util from 'util';

const promisify = util.promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

class AuthMethod {
    generateToken = async (payload, secretSignature, tokenLife) => {
        try {
            return await sign(
                {
                    payload,
                },
                secretSignature,
                {
                    algorithm: 'HS256',
                    expiresIn: tokenLife,
                },
            );
        } catch (error) {
            console.log(`Error in generate access token:  + ${error}`);
            return null;
        }
    };

    verifyToken = async (token, secretKey) => {
        try {
            return await verify(token, secretKey);
        } catch (error) {
            console.log(`Error in verify access token:  + ${error}`);
            return null;
        }
    };

    decodeToken = async (token, secretKey) => {
        try {
            return await verify(token, secretKey, {
                ignoreExpiration: true,
            });
        } catch (error) {
            console.log(`Error in decode access token: ${error}`);
            return null;
        }
    };
}

export default new AuthMethod();