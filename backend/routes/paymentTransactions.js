const {
  getPaymentTransactions,
  createPaymentTransaction,
  getSinglePaymentTransaction,
} = require("../controllers/PaymentTransactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "user"), getPaymentTransactions)
  .post(protect, authorize("admin", "user"), createPaymentTransaction);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getSinglePaymentTransaction);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentTransactions:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: Number
 *           description: Amount of money to pay
 *         createdAt:
 *           type: Date,
 *           default: Date.now,
 *         buyerId:
 *           type: string
 *           description: Customer Id
 *         sellerId:
 *           type: string
 *           description: Car Provider Id
 *         renting:
 *           type: string
 *           description: Renting Id
 *       example:
 *         amount: 500
 *         buyerId: "609bda561452242d88d36e37"
 *         sellerId: "662d10a37471a94d841bd1bb"
 *         renting: "65e5a1c8d1ed717a4fe87578"
 */

/**
 * @swagger
 * tags:
 *   name: PaymentTransactions
 *   description: Payment transactions API
 */

/**
 * @swagger
 * /paymenttransactions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all payment transactions
 *     tags: [PaymentTransactions]
 *     responses:
 *       '200':
 *         description: All payment transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentTransactions'
 *       '500':
 *          description: Some Server Error
 */

/**
 * @swagger
 * /paymenttransactions/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a single payment transaction by ID
 *     tags: [PaymentTransactions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the payment transaction
 *         type: string
 *     responses:
 *       '200':
 *         description: A payment transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentTransactions'
 *       '500':
 *         description: Some Server Error
 */

/**
 * @swagger
 * /paymenttransactions:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a payment transaction
 *     tags: [PaymentTransactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentTransactions'
 *     responses:
 *       '201':
 *         description: A payment transaction
 *         content:
 *           application/json:
 *               schema:
 *                 items:
 *                   $ref: '#/components/schemas/PaymentTransactions'
 *       '500':
 *         description: Some server error
 *       '400':
 *         description: Bad Request
 */
