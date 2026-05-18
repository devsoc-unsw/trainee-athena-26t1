import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import './CreateRecipe.css'

type NutritionFields = {
    energy: string
    totalFat: string
    saturatedFat: string
    carbohydrates: string
    sugars: string
    fibre: string
    sodium: string
}

const AVAILABLE_TAGS = [
    'Vegetarian', 'Vegan', 'Dessert', 'Lunch',
    'Dinner', 'Healthy', 'Hot', 'Cold', 'Breakfast', 'Snack',
]

const TAG_COLOURS: Record<string, string> = {
    Vegetarian:  '#27ae60',
    Vegan:       '#2ecc71',
    Dessert:     '#e67e22',
    Lunch:       '#f39c12',
    Dinner:      '#c0392b',
    Healthy:     '#16a085',
    Hot:         '#e74c3c',
    Cold:        '#2980b9',
    Breakfast:   '#8e44ad',
    Snack:       '#d35400',
}

export default function CreateRecipe() {
    const navigate = useNavigate()

    const [title, setTitle]               = useState('Untitled Recipe')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [cookingTime, setCookingTime]   = useState('')
    const [description, setDescription]   = useState('')
    const [ingredients, setIngredients]   = useState<string[]>([''])
    const [steps, setSteps]               = useState<string[]>([''])
    const [imageUrl, setImageUrl]         = useState('')
    const [nutrition, setNutrition]       = useState<NutritionFields>({
        energy: '', totalFat: '', saturatedFat: '',
        carbohydrates: '', sugars: '', fibre: '', sodium: '',
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved]   = useState(false)

    function toggleTag(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    function addIngredient() {
        setIngredients(prev => [...prev, ''])
    }

    function updateIngredient(index: number, value: string) {
        setIngredients(prev => prev.map((item, i) => i === index ? value : item))
    }

    function removeIngredient(index: number) {
        setIngredients(prev => prev.filter((_, i) => i !== index))
    }

    function addStep() {
        setSteps(prev => [...prev, ''])
    }

    function updateStep(index: number, value: string) {
        setSteps(prev => prev.map((item, i) => i === index ? value : item))
    }

    function removeStep(index: number) {
        setSteps(prev => prev.filter((_, i) => i !== index))
    }

    function updateNutrition(field: keyof NutritionFields, value: string) {
        setNutrition(prev => ({ ...prev, [field]: value }))
    }

    async function handleSave() {
        if (!title.trim()) {
            alert('Please give your recipe a title.')
            return
        }

        setSaving(true)
        try {
            await api.post('/api/create-recipe', {
                title,
                tags: selectedTags,
                cookingTime: Number(cookingTime) || 0,
                description,
                ingredients: ingredients.filter(i => i.trim() !== ''),
                steps: steps.filter(s => s.trim() !== ''),
                imageUrl,
                nutrition: {
                    energy:        Number(nutrition.energy)        || 0,
                    totalFat:      Number(nutrition.totalFat)      || 0,
                    saturatedFat:  Number(nutrition.saturatedFat)  || 0,
                    carbohydrates: Number(nutrition.carbohydrates) || 0,
                    sugars:        Number(nutrition.sugars)        || 0,
                    fibre:         Number(nutrition.fibre)         || 0,
                    sodium:        Number(nutrition.sodium)        || 0,
                },
            })
            setSaved(true)
        } catch (err) {
            console.error(err)
            alert('Something went wrong saving the recipe. Is the server running?')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="cr-page">

            <div className="cr-header">
                <span className="cr-header-title">NEW RECIPE</span>
                <div className="cr-header-icons">
                    <button className="cr-icon-btn" onClick={() => navigate('/saved')} title="Saved Recipes">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                    <button className="cr-icon-btn" onClick={() => navigate('/profile')} title="My Profile">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className="cr-cover"
                style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
            >
                {!imageUrl && <span className="cr-cover-placeholder">+ Add Cover Photo</span>}
            </div>

            <div className="cr-body">

                <div className="cr-field">
                    <label className="cr-label">Cover Image URL (optional)</label>
                    <input
                        className="cr-input"
                        placeholder="Paste an image URL here"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                    />
                </div>

                <input
                    className="cr-title-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Untitled Recipe"
                />

                <div className="cr-field">
                    <label className="cr-label">Tags</label>
                    <div className="cr-tags">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                key={tag}
                                className="cr-tag"
                                onClick={() => toggleTag(tag)}
                                style={{
                                    background: selectedTags.includes(tag)
                                        ? TAG_COLOURS[tag]
                                        : '#e0e0e0',
                                    color: selectedTags.includes(tag) ? 'white' : '#555',
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Cooking Time</label>
                    <div className="cr-row">
                        <span>⏱</span>
                        <input
                            className="cr-input cr-input-sm"
                            type="number"
                            min="0"
                            value={cookingTime}
                            onChange={e => setCookingTime(e.target.value)}
                            placeholder="0"
                        />
                        <span>minutes</span>
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Description</label>
                    <textarea
                        className="cr-textarea"
                        rows={3}
                        placeholder="Describe your recipe..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="cr-field">
                    <label className="cr-label">Ingredients</label>
                    {ingredients.map((ingredient, i) => (
                        <div key={i} className="cr-list-row">
                            <span className="cr-bullet">•</span>
                            <input
                                className="cr-input cr-input-grow"
                                value={ingredient}
                                onChange={e => updateIngredient(i, e.target.value)}
                                placeholder={`e.g. 2 cups flour`}
                            />
                            {ingredients.length > 1 && (
                                <button
                                    className="cr-remove-btn"
                                    onClick={() => removeIngredient(i)}
                                >✕</button>
                            )}
                        </div>
                    ))}
                    <button className="cr-add-btn" onClick={addIngredient}>+ Add Ingredient</button>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Steps</label>
                    {steps.map((step, i) => (
                        <div key={i} className="cr-list-row cr-list-row-top">
                            <span className="cr-step-num">{i + 1}.</span>
                            <textarea
                                className="cr-textarea cr-input-grow"
                                rows={2}
                                value={step}
                                onChange={e => updateStep(i, e.target.value)}
                                placeholder={`Step ${i + 1}...`}
                            />
                            {steps.length > 1 && (
                                <button
                                    className="cr-remove-btn"
                                    onClick={() => removeStep(i)}
                                >✕</button>
                            )}
                        </div>
                    ))}
                    <button className="cr-add-btn" onClick={addStep}>+ Add Step</button>
                </div>

                <div className="cr-field">
                    <label className="cr-label cr-label-bold">Nutritional Information</label>
                    <div className="cr-nutrition">
                        {(
                            [
                                ['energy',        'Energy (kcal)'],
                                ['totalFat',      'Total Fat (g)'],
                                ['saturatedFat',  'Saturated Fat (g)'],
                                ['carbohydrates', 'Carbohydrates (g)'],
                                ['sugars',        'Sugars (g)'],
                                ['fibre',         'Fibre (g)'],
                                ['sodium',        'Sodium (g)'],
                            ] as [keyof NutritionFields, string][]
                        ).map(([field, label]) => (
                            <div key={field} className="cr-nutrition-row">
                                <span className="cr-nutrition-label">{label}</span>
                                <input
                                    className="cr-input cr-input-sm"
                                    type="number"
                                    min="0"
                                    value={nutrition[field]}
                                    onChange={e => updateNutrition(field, e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {saved ? (
                    <div className="cr-success">Recipe saved!</div>
                ) : (
                    <button
                        className="cr-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Recipe'}
                    </button>
                )}

            </div>
        </div>
    )
}
