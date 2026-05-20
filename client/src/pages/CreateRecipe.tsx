import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import type { Ingredient, Nutrient } from '../types'
import './CreateRecipe.css'

const DISH_TYPES = [
    'Main Course', 'Side Dish', 'Dessert', 'Appetizer',
    'Salad', 'Bread', 'Breakfast', 'Soup', 'Snack', 'Beverage',
]

const DISH_TYPE_COLOURS: Record<string, string> = {
    'Main Course': '#c0392b',
    'Side Dish':   '#e67e22',
    'Dessert':     '#8e44ad',
    'Appetizer':   '#2980b9',
    'Salad':       '#27ae60',
    'Bread':       '#d35400',
    'Breakfast':   '#16a085',
    'Soup':        '#f39c12',
    'Snack':       '#e74c3c',
    'Beverage':    '#2ecc71',
}

const DEFAULT_NUTRIENTS: Nutrient[] = [
    { name: 'Calories',      amount: 0, unit: 'kcal' },
    { name: 'Protein',       amount: 0, unit: 'g'    },
    { name: 'Fat',           amount: 0, unit: 'g'    },
    { name: 'Saturated Fat', amount: 0, unit: 'g'    },
    { name: 'Carbohydrates', amount: 0, unit: 'g'    },
    { name: 'Sugar',         amount: 0, unit: 'g'    },
    { name: 'Fiber',         amount: 0, unit: 'g'    },
    { name: 'Sodium',        amount: 0, unit: 'mg'   },
]

type IngredientInput = Omit<Ingredient, 'id'>

export default function CreateRecipe() {
    const navigate = useNavigate()

    const [title, setTitle]               = useState('Untitled Recipe')
    const [image, setImage]               = useState('')
    const [sourceUrl, setSourceUrl]       = useState('')
    const [summary, setSummary]           = useState('')
    const [instructions, setInstructions] = useState('')
    const [readyInMinutes, setReadyInMinutes] = useState('')
    const [servings, setServings]         = useState('')
    const [healthScore, setHealthScore]   = useState('')
    const [dishTypes, setDishTypes]       = useState<string[]>([])
    const [cuisines, setCuisines]         = useState<string[]>([''])
    const [diets, setDiets]               = useState<string[]>([''])
    const [vegetarian, setVegetarian]     = useState(false)
    const [vegan, setVegan]               = useState(false)
    const [glutenFree, setGlutenFree]     = useState(false)
    const [dairyFree, setDairyFree]       = useState(false)
    const [ingredients, setIngredients]   = useState<IngredientInput[]>([{ name: '', amount: 0, unit: '' }])
    const [nutrients, setNutrients]       = useState<Nutrient[]>(DEFAULT_NUTRIENTS)
    const [saving, setSaving]             = useState(false)
    const [saved, setSaved]               = useState(false)

    function toggleDishType(type: string) {
        setDishTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        )
    }

    function addIngredient() {
        setIngredients(prev => [...prev, { name: '', amount: 0, unit: '' }])
    }

    function updateIngredient(index: number, field: keyof IngredientInput, value: string) {
        setIngredients(prev => prev.map((ing, i) =>
            i === index
                ? { ...ing, [field]: field === 'amount' ? Number(value) || 0 : value }
                : ing
        ))
    }

    function removeIngredient(index: number) {
        setIngredients(prev => prev.filter((_, i) => i !== index))
    }

    function updateNutrient(index: number, value: string) {
        setNutrients(prev => prev.map((n, i) =>
            i === index ? { ...n, amount: Number(value) || 0 } : n
        ))
    }

    function addCuisine() { setCuisines(prev => [...prev, '']) }
    function updateCuisine(index: number, value: string) {
        setCuisines(prev => prev.map((c, i) => i === index ? value : c))
    }
    function removeCuisine(index: number) {
        setCuisines(prev => prev.filter((_, i) => i !== index))
    }

    function addDiet() { setDiets(prev => [...prev, '']) }
    function updateDiet(index: number, value: string) {
        setDiets(prev => prev.map((d, i) => i === index ? value : d))
    }
    function removeDiet(index: number) {
        setDiets(prev => prev.filter((_, i) => i !== index))
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
                image,
                sourceUrl,
                summary,
                instructions,
                readyInMinutes: Number(readyInMinutes) || 0,
                servings:       Number(servings)       || 0,
                healthScore:    Number(healthScore)    || 0,
                dishTypes,
                cuisines: cuisines.filter(c => c.trim() !== ''),
                diets:    diets.filter(d => d.trim() !== ''),
                vegetarian,
                vegan,
                glutenFree,
                dairyFree,
                ingredients: ingredients
                    .filter(ing => ing.name.trim() !== '')
                    .map((ing, i) => ({ id: i + 1, ...ing })),
                nutrition: {
                    nutrients: nutrients.filter(n => n.amount > 0),
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
                {/* <div className="cr-header-icons">
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
                </div> */}
            </div>

            <div
                className="cr-cover"
                style={image ? { backgroundImage: `url(${image})` } : {}}
            >
                {!image && <span className="cr-cover-placeholder">+ Add Cover Photo</span>}
            </div>

            <div className="cr-body">

                <div className="cr-field">
                    <label className="cr-label">Cover Image URL (optional)</label>
                    <input
                        className="cr-input"
                        placeholder="Paste an image URL here"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                </div>

                <input
                    className="cr-title-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Untitled Recipe"
                />

                <div className="cr-field">
                    <label className="cr-label">Source URL (optional)</label>
                    <input
                        className="cr-input"
                        placeholder="Link to original recipe"
                        value={sourceUrl}
                        onChange={e => setSourceUrl(e.target.value)}
                    />
                </div>

                <div className="cr-field">
                    <label className="cr-label">Dish Types</label>
                    <div className="cr-tags">
                        {DISH_TYPES.map(type => {
                            const val = type.toLowerCase()
                            return (
                                <button
                                    key={type}
                                    className="cr-tag"
                                    onClick={() => toggleDishType(val)}
                                    style={{
                                        background: dishTypes.includes(val) ? DISH_TYPE_COLOURS[type] : '#e0e0e0',
                                        color: dishTypes.includes(val) ? 'white' : '#555',
                                    }}
                                >
                                    {type}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Ready In</label>
                    <div className="cr-row">
                        <span>⏱</span>
                        <input
                            className="cr-input cr-input-sm"
                            type="number"
                            min="0"
                            value={readyInMinutes}
                            onChange={e => setReadyInMinutes(e.target.value)}
                            placeholder="0"
                        />
                        <span>minutes</span>
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Servings</label>
                    <div className="cr-row">
                        <input
                            className="cr-input cr-input-sm"
                            type="number"
                            min="0"
                            value={servings}
                            onChange={e => setServings(e.target.value)}
                            placeholder="0"
                        />
                        <span>servings</span>
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Health Score (0–100)</label>
                    <input
                        className="cr-input cr-input-sm"
                        type="number"
                        min="0"
                        max="100"
                        value={healthScore}
                        onChange={e => setHealthScore(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="cr-field">
                    <label className="cr-label">Dietary Info</label>
                    <div className="cr-checkboxes">
                        {([
                            ['Vegetarian', vegetarian,  setVegetarian ],
                            ['Vegan',      vegan,       setVegan      ],
                            ['Gluten Free',glutenFree,  setGlutenFree ],
                            ['Dairy Free', dairyFree,   setDairyFree  ],
                        ] as [string, boolean, (v: boolean) => void][]).map(([label, val, setter]) => (
                            <label key={label} className="cr-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={val}
                                    onChange={e => setter(e.target.checked)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Summary</label>
                    <textarea
                        className="cr-textarea"
                        rows={3}
                        placeholder="Describe your recipe..."
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                </div>

                <div className="cr-field">
                    <label className="cr-label">Instructions</label>
                    <textarea
                        className="cr-textarea"
                        rows={5}
                        placeholder="Write the cooking instructions..."
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                    />
                </div>

                <div className="cr-field">
                    <label className="cr-label">Ingredients</label>
                    {ingredients.map((ing, i) => (
                        <div key={i} className="cr-list-row">
                            <input
                                className="cr-input cr-input-grow"
                                value={ing.name}
                                onChange={e => updateIngredient(i, 'name', e.target.value)}
                                placeholder="Name"
                            />
                            <input
                                className="cr-input cr-input-sm"
                                type="number"
                                min="0"
                                value={ing.amount || ''}
                                onChange={e => updateIngredient(i, 'amount', e.target.value)}
                                placeholder="Amount"
                            />
                            <input
                                className="cr-input cr-input-sm"
                                value={ing.unit}
                                onChange={e => updateIngredient(i, 'unit', e.target.value)}
                                placeholder="Unit"
                            />
                            {ingredients.length > 1 && (
                                <button className="cr-remove-btn" onClick={() => removeIngredient(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button className="cr-add-btn" onClick={addIngredient}>+ Add Ingredient</button>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Cuisines</label>
                    {cuisines.map((cuisine, i) => (
                        <div key={i} className="cr-list-row">
                            <input
                                className="cr-input cr-input-grow"
                                value={cuisine}
                                onChange={e => updateCuisine(i, e.target.value)}
                                placeholder="e.g. Italian"
                            />
                            {cuisines.length > 1 && (
                                <button className="cr-remove-btn" onClick={() => removeCuisine(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button className="cr-add-btn" onClick={addCuisine}>+ Add Cuisine</button>
                </div>

                <div className="cr-field">
                    <label className="cr-label">Diets</label>
                    {diets.map((diet, i) => (
                        <div key={i} className="cr-list-row">
                            <input
                                className="cr-input cr-input-grow"
                                value={diet}
                                onChange={e => updateDiet(i, e.target.value)}
                                placeholder="e.g. gluten free"
                            />
                            {diets.length > 1 && (
                                <button className="cr-remove-btn" onClick={() => removeDiet(i)}>✕</button>
                            )}
                        </div>
                    ))}
                    <button className="cr-add-btn" onClick={addDiet}>+ Add Diet</button>
                </div>

                <div className="cr-field">
                    <label className="cr-label cr-label-bold">Nutritional Information</label>
                    <div className="cr-nutrition">
                        {nutrients.map((nutrient, i) => (
                            <div key={nutrient.name} className="cr-nutrition-row">
                                <span className="cr-nutrition-label">{nutrient.name} ({nutrient.unit})</span>
                                <input
                                    className="cr-input cr-input-sm"
                                    type="number"
                                    min="0"
                                    value={nutrient.amount || ''}
                                    onChange={e => updateNutrient(i, e.target.value)}
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
