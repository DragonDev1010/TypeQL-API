const express = require('express')
const {buildTreeGraph} = require('./typedb_query/build_tree_graph')
const {getTreeGraph} = require('./typedb_query/get_tree_graph')
const app = express()

const listen = () => {
  app.listen(
    process.env.SERVER_PORT || 3000, 
    () => { console.log(`Example app listening on port ${process.env.SERVER_PORT || 3000}`) }
  )
}

const buildTreeGraphRequest = () => {
  app.get('/initialized-db', (req, res) => {
    buildTreeGraph()
    res.send('Database initialized successfully')
  })
}

const getTreeGraphRequest = () => {
  app.get('/', (req, res) => {
    var result = getTreeGraph()
    res.send(result)
  })
}


module.exports = {listen, buildTreeGraphRequest, getTreeGraphRequest}