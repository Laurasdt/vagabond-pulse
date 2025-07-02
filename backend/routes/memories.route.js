const router = require("express").Router();
const memoryController = require("../controller/memory.controller");
const {verifyToken} = require('../middleware/auth.middleware')

/**
 * @swagger
 * tags:
 *   name: Memories
 *   description: Endpoints for uploading and retrieving memories
 */

/**
 * @swagger
 * /memories:
 *   post:
 *     tags:
 *       - Memories
 *     summary: Upload a new memory
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image or media file to upload
 *               description:
 *                 type: string
 *                 description: A short description of the memory
 *     responses:
 *       201:
 *         description: Memory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memory'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/", verifyToken, memoryController.upload, memoryController.createMemory);
router.delete('/:id', verifyToken, memoryController.deleteMemory)
/**
 * @swagger
 * /memories:
 *   get:
 *     tags:
 *       - Memories
 *     summary: Retrieve all memories
 *     responses:
 *       200:
 *         description: A list of all memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memory'
 */
router.get("/", verifyToken, memoryController.getAllMemories);

/**
 * @swagger
 * /memories/{userId}:
 *   get:
 *     tags:
 *       - Memories
 *     summary: Retrieve all memories for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose memories you want
 *     responses:
 *       200:
 *         description: A list of that user’s memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memory'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:userId", memoryController.getUserMemoryData);

module.exports = router;
