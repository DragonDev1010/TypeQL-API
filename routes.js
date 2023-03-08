require('dotenv').config()
const express = require('express')
const {get_tree_graph} = require('./typedb_query/get_tree_graph')
const {build_tree_graph} = require('./typedb_query/build_tree_graph')
const {delete_tree_graph} = require('./typedb_query/delete_tree_graph')
const { convertTypeqlToJson } = require('./functions/convertTypeqlToJson')
const app = express()
const cors = require('cors')

app.use(cors())
app.listen(
  process.env.SERVER_PORT || 8080,
  () => { console.log(`Example app listening on port ${process.env.SERVER_PORT || 8080}`) }
)

app.get('/initialize', async (req, res) => {
  await build_tree_graph()
  res.send('Database initialized successfully')
})

app.get('/', async (req, res) => {
  var typeql_data = await get_tree_graph()
  var tree_graph_array = convertTypeqlToJson(
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
  res.send('post request is called')
})