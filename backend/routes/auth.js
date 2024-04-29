const express = require('express');
const {register, login, getMe, logout ,deleteUser} = require('../controllers/auth/user');
const { carProviderRegister, carProviderLogin, getMeCarProvider } = require("../controllers/auth/carProvider");

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

///////// For Customer /////
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.delete('/deleteuser/:id',protect,authorize('admin'),deleteUser);
///////////////////////////////////

///////// For Car Provider /////
router.post('/register/carProvider', carProviderRegister);
router.post('/login/carProvider', carProviderLogin);
router.get('/me/carProvider', protect, getMeCarProvider);
router.get('/logout', logout);

////////////////////////////////

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - telephone
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's name
 *         telephone:
 *           type: string
 *           uniqueItems: true
 *           maxLength: 10
 *           description: Telephone number
 *           example: '0123456789'
 *         email:
 *           type: string
 *           uniqueItems: true
 *           description: User's email address
 *           pattern: '^(([^<>()\[\]\\.,;:\s@"]+(\\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
 *           example: 'john@example.com'
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password
 *         resetPasswordToken:
 *           type: string
 *           description: Token used for password reset
 *         resetPasswordExpire:
 *           type: string
 *           format: date-time
 *           description: Expiration date for password reset token
 *         balance:
 *          type: number
 *          description: User's account balance
 *          minimum: 0
 *          default: 0
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *           default: user
 *           description: User's role
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was created
 *         address:
 *           type: string
 *           description: User's address
 */


/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     TokenResponse:
*       type: object
*       properties:
*         _id:
*           type: string
*           example: '6093f1a3d94cb31c64e7d3f2'
*           description: The unique identifier for the user
*         name:
*           type: string
*           example: 'John Doe'
*           description: The user's name
*         email:
*           type: string
*           example: 'john.doe@example.com'
*           description: The user's email address
*         role:
*           type: string
*           example: 'user'
*           enum:
*             - user
*             - admin
*           description: The user's role
*         token:
*           type: string
*           example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTNmMWEzZDk0Y2IzMWM2NGU3ZDNmMiIsImlhdCI6MTYyMDIzMjY3NywiZXhwIjoxNjIwMzE5MDc3fQ.RlW3ix2yJYVmk5V2dCBVYFW2_Sbr8paAmqz1YzW0zrg'
*           description: The user's authentication token
*/

/**
* @swagger
* tags:
*   name: User
*   description: The user API
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: Create a new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TokenResponse'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /auth/login:
*   post:
*     summary: Log-in to the system
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties: 
*               email: 
*                   type: string
*               password: 
*                   type: string
*     responses:
*       201:
*         description: Log-in Successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/TokenResponse'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /auth/me:
*   get:
*     security:
*       - bearerAuth: []
*     summary: information about me
*     tags: [User]
*     responses:
*       201:
*         description: user profile
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       500:
*         description: Some server error
*/

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags: [User]
 *     summary: Log user out and clear cookie
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     tags: [User]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No user with id of ${userId}"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot delete user"
 */

