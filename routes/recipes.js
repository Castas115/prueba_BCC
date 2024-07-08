const express = require('express');
const router = express.Router();
const db = require(`../db`);

router.post('/', async (req, res) => {
    const recipe = req.body;
    db.query(
      `INSERT INTO recipe (name, ingredients, instructions, category) VALUES ('` +
      recipe.name + `', '` + JSON.stringify(recipe.ingredients) + `', '` + recipe.instructions + `', '` + recipe.category + `')`
      , function (err, result) {
        res.send({ id: result.insertId, ...recipe });
      }
    );
});

router.get('/', async (req, res) => {
    db.query(`SELECT * FROM recipe`
    , function (err, result) {
      res.send(result);
    });
});

router.get('/:id', async (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM recipe WHERE id = ` + id
    , function (err, result) {
      res.send(result);
    });
});

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const recipe = req.body;
    db.query('UPDATE recipe SET ? WHERE id = ' + id, recipe, function(err, result) {
      res.send(result);
    });
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    db.query(`DELETE FROM recipe WHERE id = ` + id
    , function (err, result) {
      res.send(result);
    });
});

module.exports = router;