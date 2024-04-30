const express = require('express');
const {getRentings, getRenting, addRenting, updateRenting, deleteRenting, getOverdueRentings} = require('../controllers/rentings');
const { protect, authorize } = require('../middleware/auth');
const { getCarsForCarProvider } = require('../controllers/carProviders');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(protect,getRentings)     
    .post(protect,authorize('admin' ,'user'),addRenting);       
router.route('/nearandover').get(protect, getOverdueRentings);
router.route('/:id')
    .get(protect,getRenting)        
    .put(protect, authorize('admin', 'user'),updateRenting)      
    .delete(protect, authorize('admin', 'user'),deleteRenting);  

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Renting:
 *       type: object
 *       required:
 *         - rentDate
 *         - user
 *         - carProvider
 *         - car
 *       properties:
 *         rentDate:
 *           type: Date
 *           description: The day that rent the car
 *         rentTo:
 *           type: Date
 *           description: The day that return the car
 *           default: function() { return this.rentDate }
 *         user:
 *           type: string
 *           description: Customer Id
 *         carProvider:
 *           type: string
 *           description: Car Provider Id
 *         car:
 *           type: string
 *           description: Car Id
 *         createdAt:
 *           type: Date
 *           default: Date.now
 *         returned:
 *           type: Boolean
 *           default: false
 *       example:
 *         rentDate: "2024-02-26"
 *         rentTo: "2024-03-10"
 *         user: "65e1ead9d5be2fa3f163be3c"
 *         carProvider: "609bda561452242d88d36e37"
 *         car: "6621651edbabc144897c21ee"
 *         returned: true
 */


/**
* @swagger
* tags:
*   name: Rentings
*   description: The Rentings managing API
*/

/**
 * @swagger
 * /rentings:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all rentings
 *     tags: [Rentings]
 *     responses:
 *       '200':
 *         description: A list of rentings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Renting'
 *       '500':
 *          description: Some Server Error
 */

/**
 * @swagger
 * /rentings/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a single renting by ID
 *     tags: [Rentings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the renting
 *         type: string
 *     responses:
 *       '200':
 *         description: A renting
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Renting'
 *       '500':
 *          description: Some Server Error
 */



/**
 * @swagger
 * /carproviders/{id}/rentings:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a renting 
 *     tags: [Rentings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the car provider
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Renting'
 *             carModel: string
 *     responses:
 *       '200':
 *         description: A renting
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Renting'
 *       '500':
 *          description: Some Server Error
 */

/**
 * @swagger
 * /rentings/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a renting by ID
 *     tags: [Rentings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the renting
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Renting'
 *     responses:
 *       '200':
 *         description: A renting
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Renting'
 *       '500':
 *          description: Some Server Error
 */

/**
 * @swagger
 * /rentings/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: delete a renting by ID
 *     tags: [Rentings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the renting
 *         type: string
 *     responses:
 *       '200':
 *         description: A renting
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Renting'
 *       '500':
 *          description: Some Server Error
 */






