const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = (io) => {
  const router = express.Router();
  const db = getDB();

  // CRUD Endpoints
  router.post('/', async (req, res) => {
    const { title, description, category, userId } = req.body;
    const task = { title, description, category, userId, order: 0, timestamp: new Date() };
    const result = await db.collection('tasks').insertOne(task);
    io.emit('task-updated', { userId });
    res.status(201).json({ ...task, _id: result.insertedId });
  });  

  router.get('/', async (req, res) => {
    const { userId } = req.query;
    const tasks = await db.collection('tasks').find({ userId }).sort({ order: 1 }).toArray();
    res.json(tasks);
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {  category, order, userId, title ,description } = req.body;
    console.log(req.body)
    try {
      const result = await db.collection('tasks').updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, description, category, order } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Emit real-time updat
      io.emit('task-updated', { userId });
      res.json({ message: 'Task updated' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    io.emit('task-updated', { userId });
    res.json({ message: 'Task deleted' });
  });

  return router;
};

module.exports = router;