const {topUp} = require('../controllers/topUp');
const {protect, authorize} = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.route('/').post(protect, authorize('admin', 'user'),topUp);

module.exports = router;

/**
* @swagger
* tags:
*   name: Topup
*   description: TopUp API
*/

/**
*  @swagger
*  /topUp:
*    post:
*      summary: Top up user balance
*      description: Allows users and admins to top up balances, with admins being able to top up any user's balance.
*      tags: [Topup]
*      security:
*        - bearerAuth: []
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              properties:
*                userId:
*                  type: string
*                  description: The user ID of the user whose balance is to be topped up (required for admins).
*                balance:
*                  type: number
*                  description: The amount to be added to the user's balance.
*              required:
*                - balance
*      responses:
*        200:
*          description: Balance top up successful
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  success:
*                    type: boolean
*                  data:
*                    $ref: '#/components/schemas/User'
*        400:
*          description: Bad request - input validation errors or other issues.
*          content:
*            application/json:
*              schema:
*                type: object
*                properties:
*                  success:
*                    type: boolean
*                    example: false
*                  msg:
*                    type: string
*   
*/