const router = require("express").Router();
const { verifyToken } = require("../middleware/auth.middleware");
const eventCtrl = require("../controller/event.controller");

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Retrieve a list of events
 *     responses:
 *       200:
 *         description: A JSON array of event objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", eventCtrl.list);

/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Retrieve a single event by ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: A single event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:eventId", eventCtrl.show);

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/", verifyToken, eventCtrl.create);

/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Updated event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:eventId", verifyToken, eventCtrl.update);

/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an event by ID
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to delete
 *     responses:
 *       204:
 *         description: Event deleted successfully (no content)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:eventId", verifyToken, eventCtrl.destroy);

module.exports = router;
