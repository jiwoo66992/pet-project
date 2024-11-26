import userModel from "./user.model.js";

class UserController {

    createUser = async (req, res) => {
        const { email, name, password } = req.body;
        const newUser = { email, name, password };

        const result = await userModel.createUser(newUser);
        res.status(result.success ? 200 : 500).json(result);
    };

    getUser = async (req, res) => {
        const { email } = req.params;

        const user = await userModel.getUserByEmail(email);
        if (user) {
            delete user.password;
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    };

}

export default new UserController();