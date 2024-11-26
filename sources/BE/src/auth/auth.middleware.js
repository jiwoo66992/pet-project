import userModel from '../user/user.model.js';
import authMethod from './auth.methods.js';
class AuthMiddleware {
    isAuth = async (req, res, next) => {
        const accessTokenFromHeader = req.headers['authorization'];
        if (!accessTokenFromHeader) {
            return res.status(401).send('Không tìm thấy access token!');
        }

        const verified = await authMethod.verifyToken(
            accessTokenFromHeader.substr(7),
            process.env.JWT_TOKEN_SECRET
        );
        if (!verified) {
            return res
                .status(401)
                .send('Bạn không có quyền truy cập vào tính năng này!');
        }

        const user = await userModel.getUserByEmail(verified.payload.email);
        if (!user) {
            return res.status(404).send('Người dùng không tồn tại!');
        }

        req.user = user;
        return next();
    };

    
    isAuthorized = (requiredRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).send('Người dùng chưa xác thực!');
            }

            const { role } = req.user;
            if (!requiredRoles.includes(role)) {
                return res
                    .status(403)
                    .send('Bạn không có quyền truy cập vào tính năng này!');
            }

            return next();
        };
    };
}

export default new AuthMiddleware();
