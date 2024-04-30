const express = require("express");
const {
  getCarProviders,
  getCarProvider,
  createCarProvider,
  updateCarProvider,
  deleteCarProvider,
  getNearByCarProviders,
  getCarsForCarProvider,
  getCarProvidersWithAvailableCars,
} = require("../controllers/carProviders");
const { addCar } = require("../controllers/cars");
const rentingsRouter = require("./rentings");
const carsRouter = require("./cars");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getCarProviders)
  .post(protect, authorize("admin"), createCarProvider);

router.use("/:carProviderId/rentings", rentingsRouter);
router.route("/:id/cars").get(getCarsForCarProvider).post(protect, addCar);

router.route("/nearby").get(protect, getNearByCarProviders);

router.route("/availablecars").get(getCarProvidersWithAvailableCars);
router
  .route("/:id")
  .get(getCarProvider)
  .put(protect, updateCarProvider)
  .delete(protect, authorize("admin"), deleteCarProvider);

module.exports = router;

/**
* @swagger
* tags:
*   name: CarProviders
*   description: API endpoints for managing car providers
*/

/**
*  @swagger
*  components:
*
*   schemas:
*     CarProviderListResponse:
*       type: object
*       properties:
*         success:
*           type: boolean
*         count:
*           type: integer
*         data:
*           type: array
*           items:
*             $ref: '#/components/schemas/CarProvider'
*         pagination:
*           $ref: '#/components/schemas/PaginationObject'
*     PaginationObject:
*       type: object
*       properties:
*         next:
*           type: object
*           properties:
*             page:
*               type: integer
*             limit:
*               type: integer
*         prev:
*           type: object
*           properties:
*             page:
*               type: integer
*             limit:
*               type: integer
*/

/**
* @swagger
* /carproviders:
*   get:
*     summary: Get all car providers
*     tags: [CarProviders]
*     parameters:
*         - in: query
*           name: select
*           schema:
*             type: string
*           description: Fields to include in the response (comma-separated)
*         - in: query
*           name: sort
*           schema:
*             type: string
*           description: Fields to sort by (comma-separated)
*         - in: query
*           name: page
*           schema:
*             type: integer
*           description: Page number
*         - in: query
*           name: limit
*           schema:
*             type: integer
*           description: Number of results per page
*     responses:
*       '200':
*         description: Successful response
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
*                     $ref: '#/components/schemas/CarProvider'
*   post:
*     summary: Create a new car provider
*     tags: [CarProviders]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CarProvider'
*     responses:
*       '201':
*         description: Successful response
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CarProvider'
*/

/**
*   @swagger
*   /carproviders/{id}:
*     get:
*       summary: Get a car provider
*       tags: [CarProviders]
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: string
*             example: 662d10a37471a94d841bd1bb
*           description: The ID of the car provider
*       responses:
*         '200':
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   success:
*                     type: boolean
*                   data:
*                     $ref: '#/components/schemas/Car'
*         '400':
*           description: Car provider not found
*     put:
*       summary: Update a car provider
*       tags: [CarProviders]
*       security:
*         - bearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: string
*           description: The ID of the car provider
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CarProvider'
*       responses:
*         '200':
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/CarProvider'
*         '400':
*           description: Car provider not found
*     delete:
*       summary: Delete a car provider
*       tags: [CarProviders]
*       security:
*         - bearerAuth: []
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: string
*           description: The ID of the car provider
*       responses:
*         '200':
*           description: Successful response
*           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
*         '400':
*           description: Car provider not found
*
 */

/**
*   @swagger 
*   /carproviders/{id}/cars:
*     get:
*       summary: Get cars for a car provider
*       tags: [CarProviders]
*       parameters:
*         - in: path
*           name: id
*           required: true
*           schema:
*             type: string
*             example: 662d10a37471a94d841bd1bb
*           description: The ID of the car provider
*       responses:
*         '200':
*           description: Successful response
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   success:
*                     type: boolean
*                   data:
*                     type: array
*                     items:
*                       $ref: '#/components/schemas/Car'
*         '400':
*           description: Car provider not found
*         '500':
*           description: Internal server error
*/

