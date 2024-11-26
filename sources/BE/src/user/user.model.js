import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../db.config.js'

const TableName = 'users';

class UserModel {
    async createUser(user) {
        try {
            const command = new PutCommand({
                TableName,
                Item: user,
            });

            const response = await db.send(command);
            return { success: true, response };
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, message: 'Error creating user' };
        }
    }

    async getUserByEmail(email) {
        try {
            const command = new GetCommand({
                TableName,
                Key: {
                    email,
                },
            });

            const response = await db.send(command);
            return response.Item || null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    async updateUser(email, updateData) {
        const updateExpressions = [];
        const ExpressionAttributeNames = {};
        const ExpressionAttributeValues = {};

        Object.entries(updateData).forEach(([key, value], index) => {
            const attributeName = `#attr${index}`;
            const attributeValue = `:val${index}`;

            updateExpressions.push(`${attributeName} = ${attributeValue}`);
            ExpressionAttributeNames[attributeName] = key;
            ExpressionAttributeValues[attributeValue] = value;
        });

        const command = new UpdateCommand({
            TableName,
            Key: {
                email,
            },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeValues,
            ReturnValues: "ALL_NEW",
        });

        const response = await docClient.send(command);
        console.log(response);
        return response;
    }

    async deleteUser(email) {
        try {
            const command = new DeleteCommand({
                TableName,
                Key: {
                    email
                },
            });

            const response = await docClient.send(command);
            return { success: true, message: "User deleted successfully" };
        } catch (error) {
            console.error("Error deleting user:", error);
            return { success: false, message: "Error deleting user" };
        }
    }
}

export default new UserModel();
