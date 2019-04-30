const knex = require('knex');
const router = require('express').Router();

// configure knex.
const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true,
};
// use knex.
const db = knex(knexConfig);

// Endpoints. CRUD.
// Get.
router.get('/', (req, res) => {
    db('bears')
    .then(bears => {
        res.status(200).json(bears)
    })
    .catch(err => {
        res.status(500).json({ message: 'The Bears are loose! Cannot retrieve the bears. Someone call Brian Urlacher.'})
    })
})

// Get by ID. 
router.get('/:id', (req, res) => {
    db('bears')
    .where({ id: req.params.id })
    .first()
    .then(bear => {
        if(bear) {
            res.status(200).json(bear)
        } else {
            res.status(404).json({ message: 'Bear down, the specified bear does not exist.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error fetching specified item.'})
    })
});

// Post.
router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ message: 'Please provide a name for this new bear.'})
    } else {
        db('bears')
        .insert(req.body, 'id')
        .then(ids => {
            db('bears')
                .where({ id: ids[0] })
                .first()
                .then(bear => {
                    res.status(201).json(bear)
                })
                .catch(err => {
                    res.status(500).json({ err: err, message: 'Error adding this bear.'})
                })
        })
        .catch(err => {
            res.status(500).json({ err: err, message: 'Error adding this bear.'})
        })
    }
});

// Update.
router.put('/:id', (req,res) => {
    db('bears')
    .where({ id: req.params.id })
    .update(req.body)
    .then(updates => {
        if(updates > 0) {
            res.status(200).json({ message: `${updates} bears successfully updated.`})
        } else {
            res.status(404).json({ message: 'Bear not found.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error updating this bear.'})
    })
});

// Delete.
router.delete('/:id', (req, res) => {
    db('bears')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
        if(count > 0) {
        res.status(200).json({ message: `${count} bears deleted.`})
        } else {
        res.status(404).json({ message: 'Bear not found.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error deleting this bear.'})
    })
});

module.exports = router;