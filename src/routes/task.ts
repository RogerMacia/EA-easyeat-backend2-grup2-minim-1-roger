import express from 'express';
import TaskController from '../controllers/task';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Tasks
 *     description: CRUD endpoints for tasks
 *
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         restaurant_id:
 *           type: string
 *           description: Restaurant ObjectId
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties:
 *               type: boolean
 *           description: List of task descriptions and their completion state
 *
 *     TaskCreateUpdate:
 *       type: object
 *       required:
 *         - restaurant_id
 *         - tasks
 *       properties:
 *         restaurant_id:
 *           type: string
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties:
 *               type: boolean
 */

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Creates a task set
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', TaskController.createTask);

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Lists all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', TaskController.getAllTasks);

/**
 * @openapi
 * /tasks/restaurant/{restaurantId}:
 *   get:
 *     summary: Get tasks by restaurant
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/restaurant/:restaurantId', TaskController.getTaskByRestaurant);

/**
 * @openapi
 * /tasks/{start}/{end}:
 *   get:
 *     summary: Get a paginated slice of tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: start
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: end
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated tasks
 */
router.get('/:start/:end', TaskController.getPaginatedTask);

/**
 * @openapi
 * /tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Not found
 */
router.get('/:taskId', TaskController.getTask);

/**
 * @openapi
 * /tasks/{taskId}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateUpdate'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:taskId', TaskController.updateTask);

/**
 * @openapi
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:taskId', TaskController.deleteTask);

export default router;
