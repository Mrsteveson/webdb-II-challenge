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
    db('zoos')
    .then(zoo => {
        res.status(200).json(zoo)
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'The Zoo is busted! (Error fetching zoo data).'})
    })
});

// Get by ID. 
router.get('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id })
    .first()
    .then(zoo => {
        if(zoo) {
            res.status(200).json(zoo)
        } else {
            res.status(404).json({ message: 'The animals escaped, the specified zoo does not exist.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error fetching specified item.'})
    })
});

// Post.
router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ message: 'Please provide a name for this new item.'})
    } else {
        db('zoos')
        .insert(req.body, 'id')
        .then(ids => {
            db('zoos')
                .where({ id: ids[0] })
                .first()
                .then(zoo => {
                    res.status(201).json(zoo)
                })
                .catch(err => {
                    res.status(500).json({ err: err, message: 'Error adding this item.'})
                })
        })
        .catch(err => {
            res.status(500).json({ err: err, message: 'Error adding this item.'})
        })
    }
});

// Update.
router.put('/:id', (req,res) => {
    db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(updates => {
        if(updates > 0) {
            res.status(200).json({ message: `${updates} zoo successfully updated.`})
        } else {
            res.status(404).json({ message: 'Item not found.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error updating this item.'})
    })
});

// Delete.
router.delete('/:id', (req, res) => {
    db('zoos')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
        if(count > 0) {
        res.status(200).json({ message: `${count} zoos deleted.`})
        } else {
        res.status(404).json({ message: 'Item not found.'})
        }
    })
    .catch(err => {
        res.status(500).json({ err: err, message: 'Error deleting this item.'})
    })
});

module.exports = router;