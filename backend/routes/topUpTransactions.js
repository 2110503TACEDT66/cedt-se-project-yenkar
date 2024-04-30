const {
  getTopUpTransactions,
  createTopUpTransaction,
  getSingleTopUpTransaction,
} = require("../controllers/topUpTransactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "user"), getTopUpTransactions);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getSingleTopUpTransaction);

router
  .route("/")
  .post(protect, authorize("admin", "user"), createTopUpTransaction);

module.exports = router;

/**
* @swagger
* tags:
*   name: TopUpTransactions
*   description: TopUpTransaction API
*/

/**
*  @swagger
*  components:
*    schemas:
*      TopUpTransaction:
*        type: object
*        required:
*          - stripeId
*          - amount
*        properties:
*          stripeId:
*            type: string
*            description: The Stripe transaction ID associated with the top-up
*          buyerId:
*            type: string
*            description: The ID of the user who initiated the top-up
*          amount:
*            type: number
*            description: The amount topped up
*          plan:
*            type: string
*          credits:
*            type: number
*          createdAt:
*            type: string
*            format: date-time
*            description: The date and time the transaction was created
*
*/

/**
 * @swagger
 * /topUpTransactions:
 *   get:
 *     summary: Get all topUpTransactions
 *     description: Retrieves a list of topUpTransactions. Admins can see all transactions, while users can only see their own.
 *     tags: [TopUpTransactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of topUpTransactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopUpTransaction'
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
 *
 *   post:
 *     summary: Create a topUpTransaction
 *     description: Creates a new topUpTransaction and logs it in the transactions database.
 *     tags: [TopUpTransactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TopUpTransaction'
 *     responses:
 *       201:
 *         description: New topUpTransaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TopUpTransaction'
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
 *                   example: "Cannot create topUpTransaction"
 */

/**
 * @swagger  
 * /topUpTransactions/{id}:
 *   get:
 *     summary: Get a topUpTransaction
 *     description: Retrieves a specific topUpTransaction by ID.
 *     tags: [TopUpTransactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the topUpTransaction to retrieve
 *     responses:
 *       200:
 *         description: Specific topUpTransaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TopUpTransaction'
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
 *                   example: "Cannot find topUpTransaction"
 */

