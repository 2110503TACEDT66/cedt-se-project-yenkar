const {
  createTransaction,
  getTransactions,
  getSingleTransaction,
} = require("../controllers/transactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

router.route("/:id").get(protect, getSingleTransaction);

router;

module.exports = router;

/**
* @swagger
* tags:
*   name: Transactions
*   description: Transactions API
*/

/**
*  @swagger
*  components:
*    schemas:
*      Transaction:
*        type: object
*        required:
*          - stripeId
*          - amount
*        properties:
*          stripeId:
*            type: string
*            description: The Stripe transaction ID associated with the top-up
*          userId:
*            type: string
*            description: user's ID 
*          carProviderId:
*            type: string
*            description: carProvider's ID
*          amount:
*            type: number
*            description: The amount topped up
*          type:
*            type: string
*            enum:
*              - topUp
*              - payment
*              - refund
*          direction:
*            type: string
*            enum:
*              - userToCarProvider
*              - carProviderToUser
*              - userTopUp
*          createdAt:
*            type: string
*            format: date-time
*            description: The date and time the transaction was created
*
*/

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all Transactions
 *     description: Retrieves a list of Transactions. Admins can see all transactions, while users can only see their own.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Cannot find transactions"
 *
 *   post:
 *     summary: Create a Transaction
 *     description: Creates a new Transaction and logs it in the transactions database.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: New Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Error creating transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Cannot create Transaction"
 */

/**
 * @swagger  
 * /transactions/{id}:
 *   get:
 *     summary: Get a Transaction
 *     description: Retrieves a specific Transaction by ID.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Transaction to retrieve
 *     responses:
 *       200:
 *         description: Specific Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Cannot find transaction"
 */
