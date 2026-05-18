import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: 'Untitled Recipe',
        },
        tags: {
            type: [String],
            default: [],
        },
        cookingTime: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            default: '',
        },
        ingredients: {
            type: [String],
            default: [],
        },
        steps: {
            type: [String],
            default: [],
        },
        imageUrl: {
            type: String,
            default: '',
        },
        nutrition: {
            energy:        { type: Number, default: 0 },
            totalFat:      { type: Number, default: 0 },
            saturatedFat:  { type: Number, default: 0 },
            carbohydrates: { type: Number, default: 0 },
            sugars:        { type: Number, default: 0 },
            fibre:         { type: Number, default: 0 },
            sodium:        { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Recipe', recipeSchema);