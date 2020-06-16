const express = require('express');

const router  = express.Router();
const { create, readList, readSingle }= require('./../queries/links');
const { createValidator, }= require('./../middlewares/links');
const paginateValidator = require('./../middlewares/common/paginate');
const searchQuery = require('./../middlewares/common/searchQuery');




router.get('/list', paginateValidator, searchQuery, (req, res, next)=>{
    readList(req).then((data)=> {
        res.json(data)
    }).catch((e)=>{
        res.status(500).json({
            msg: 'server error'
        })
    });
})

router.get('/:link_id', (req, res, next)=>{
    readSingle(req).then(( [data] )=> {
        if(data){
            res.json(data)
        }else {
            res.status(404).json({
                msg: 'resource not found'
            }) 
        }
    }).catch((e)=>{
        res.status(500).json({
            msg: 'server error'
        })
    });
})



router.post('/', createValidator, (req, res, next)=>{
    
    create(req).then((data)=> {
        res.json({
            msg: 'success',
            id: data
        })
    }).catch((e)=>{
        res.status(400).json({
            msg: 'bad request'
        })
    });
})

module.exports = router;