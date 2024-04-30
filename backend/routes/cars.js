const express = require("express");

const { deleteCar, getCars ,getSingleCar , updateCar} = require("../controllers/cars");
// const carsRouter = require("./cars");

const router = express.Router({mergeParams: true});
const { protect, authorize } = require("../middleware/auth");

// router.use("/:carProviderId/rentings", rentingsRouter);

router
  .route("/")
  .get(getCars)

router
  .route("/:id")
  .get(getSingleCar)
  .delete(protect, deleteCar)
  .put(protect,updateCar);

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - carProvider
 *         - brand
 *         - model
 *         - doors
 *         - seats
 *         - price
 *         - vrm
 *       properties:
 *         carProvider:
 *           type: string
 *           description: Reference to which CarProvider's _id
 *         brand:
 *           type: string
 *           description: Car's brand
 *         model:
 *           type: string
 *           description: Car's model
 *         doors:
 *           type: integer
 *           description: Number of doors
 *         seats:
 *           type: integer
 *           description: Number of seats
 *         transmission:
 *           type: string
 *           description: Transmission type
 *           enum:
 *             - manual
 *             - auto
 *             - AWT
 *             - other
 *         cargo:
 *           type: string
 *           description: Cargo size
 *           enum:
 *             - "-"
 *             - small
 *             - medium
 *             - large
 *             - super large
 *         radio:
 *           type: boolean
 *           description: Whether the car has a radio
 *           default: false
 *         air:
 *           type: boolean
 *           description: Whether the car has air conditioning
 *           default: false
 *         price:
 *           type: number
 *           description: Car's rental price
 *           minimum: 0
 *         src:
 *           type: string
 *           description: Image source
 *         vrm:
 *           type: string
 *           description: Car's plate number
 *           unique: true
 *       example:
 *         carProvider: "609bda561452242d88d36e37"
 *         brand: "Toyota"
 *         model: "Corolla"
 *         doors: 4
 *         seats: 5
 *         transmission: "auto"
 *         cargo: "medium"
 *         radio: true
 *         air: true
 *         price: 50
 *         src: "https://example.com/car-image.jpg"
 *         vrm: "ABC123"
 */


/**
* @swagger
* tags:
*   name: Cars
*   description: The Car managing API
*/

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Retrieve all cars
 *     tags: [Cars]
 *     responses:
 *       '200':
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */



/**
* @swagger
* /cars/{id}:
*   get:
*     summary: Retrieve a single car by ID
*     tags: [Cars]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: ID of the car
*         type: string
*     responses:
*       '200':
*         description: A single car object
*         content:
*           application/json:
*               schema:
*                 $ref: '#/components/schemas/Car'
*       '500':
*         description: Some Server Error
*/


/**
* @swagger
* /carproviders/{id}/cars:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new car
*     tags: [Cars]
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
*             $ref: '#/components/schemas/Car'
*     responses:
*       '201':
*         description: A single car object
*         content:
*           application/json:
*               schema:
*                 items:    
*                   $ref: '#/components/schemas/Car'
*       '500':
*         description: Some server error
*       '400':
*         description: Bad Request
*/

/**
* @swagger
* /cars/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update a new car
*     tags: [Cars]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: ID of the car
*         type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Car'
*     responses:
*       '200':
*         description: A single car object
*         content:
*           application/json:
*               schema:
*                 items:    
*                   $ref: '#/components/schemas/Car'
*       '500':
*         description: Some server error
*       '404':
*         description: The car was not found
*/

/**
* @swagger
* /cars/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Remove the car by ID
*     tags: [Cars]
*     parameters:
*       - name: id
*         in: path
*         required: true
*         description: ID of the car
*         type: string
*     responses:
*       '200':
*         description: A single car object
*         content:
*           application/json:
*               schema:
*                 type: array
*                 items:    
*                   $ref: '#/components/schemas/Car'
*       '500':
*         description: Some server error
*       '404':
*         description: The car was not found
*/


