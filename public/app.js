document.addEventListener('DOMContentLoaded', () => {
    const addRecipeForm = document.getElementById('addRecipeForm');
    const submitButton = document.getElementById('submitButton');
    const recipeList = document.getElementById('recipeList');
    let editingRecipeId = null;

    // Load recipes on page load
    loadRecipes();

    // Add/Edit recipe form submission
    addRecipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const recipe = {
            name: document.getElementById('name').value,
            ingredients: document.getElementById('ingredients').value.split(',').map(item => item.trim()),
            instructions: document.getElementById('instructions').value,
            category: document.getElementById('category').value
        };

        if (editingRecipeId) {
            await updateRecipe(editingRecipeId, recipe);
            editingRecipeId = null;
        } else {
            await addRecipe(recipe);
        }

        addRecipeForm.reset();
        submitButton.textContent = 'Add Recipe';
        loadRecipes();
    });

    async function addRecipe(recipe) {
        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    }

    async function loadRecipes() {
        try {
            const response = await fetch('/api/recipes');
            const recipes = await response.json();
            displayRecipes(recipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
        }
    }

    function displayRecipes(recipes) {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.innerHTML = `
                <h3>${recipe.name}</h3>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <p><strong>Ingredients:</strong> ${parseIngredients(recipe.ingredients)}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
                <hr>
            `;
            recipeList.appendChild(recipeElement);
        });
    }

    function parseIngredients(ingredients) {
        try {
            return JSON.parse(ingredients).join(', ');
        } catch (e) {
            return ingredients;
        }
    }

    window.editRecipe = async (id) => {
        editingRecipeId = id;
        const recipe = await getRecipe(id);
        document.getElementById('name').value = recipe.name;
        document.getElementById('ingredients').value = parseIngredients(recipe.ingredients);
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('category').value = recipe.category;
        submitButton.textContent = 'Update Recipe';
    };

    window.deleteRecipe = async (id) => {
        if (confirm('Are you sure you want to delete this recipe?')) {
            await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
            loadRecipes();
        }
    };

    async function getRecipe(id) {
        const response = await fetch(`/api/recipes/${id}`);
        return (await response.json())[0];
    }

    async function updateRecipe(id, recipe) {
        try {
            const response = await fetch(`/api/recipes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipe)
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating recipe:', error);
        }
    }
});
