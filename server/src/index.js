import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

// ============================================
// ROUTES - These handle requests from frontend
// ============================================

// Health Check - Test if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// GET all items from database
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single item by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new item
app.post('/api/items', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE an item
app.put('/api/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
