import express from 'express';
import controller from '../controllers/dish';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Dishes
 *     description: CRUD endpoints for dishes
 */

/**
 * @openapi
 * /dishes:
 *   post:
 *     summary: Creates a dish
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DishCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 *       422:
 *         description: Validation failed (Joi)
 */
router.post('/', ValidateJoi(Schemas.dish.create), controller.createDish);

/**
 * @openapi
 * /dishes/{dishId}:
 *   get:
 *     summary: Gets a dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:dishId', controller.readDish);

/**
 * @openapi
 * /dishes:
 *   get:
 *     summary: Lists all dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', controller.readAll);

/**
 * @openapi
 * /dishes/{dishId}:
 *   put:
 *     summary: Updates a dish by ID
 *     tags: [Dishes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DishCreateUpdate'
 *     responses:
 *       201:
 *         description: Updated
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed (Joi)
 */
router.put('/:dishId', ValidateJoi(Schemas.dish.update), controller.updateDish);

/**
 * @openapi
 * /dishes/{dishId}:
 *   delete:
 *     summary: Deletes a dish by ID
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.delete('/:dishId', controller.deleteDish);

export default router;
