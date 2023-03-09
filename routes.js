require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const {get_tree_graph} = require('./typedb_query/get_tree_graph')
const {initialize_tree_graph} = require('./typedb_query/initialize_tree_graph')
const {delete_tree_graph} = require('./typedb_query/delete_tree_graph')
const {insert_new_tree_graph} = require('./typedb_query/insert_new_tree_graph')
const { convert_typeql_to_json } = require('./functions/convert_typeql_to_json')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({}));
app.use(bodyParser.json({}));

app.listen(
  process.env.SERVER_PORT || 8080,
  () => { console.log(`Example app listening on port ${process.env.SERVER_PORT || 8080}`) }
)

app.get('/initialize', async (req, res) => {
  await delete_tree_graph()
  await initialize_tree_graph()
  res.send('Database initialized successfully')
})

app.get('/', async (req, res) => {
  var typeql_data = await get_tree_graph()
  var tree_graph_array = convert_typeql_to_json(
    typeql_data.tree_graph_nodes_array,
    typeql_data.tree_graph_connects_array,
    typeql_data.root_node.id
  )
  res.send(tree_graph_array)
})

app.get('/delete', async (req, res) => {
  var delete_result = await delete_tree_graph()
  res.send(delete_result)
})

app.post('/save', async (req, res) => {
  await delete_tree_graph()
  await insert_new_tree_graph(req.body)
  res.send('TypeDB is updated successfully.')
})