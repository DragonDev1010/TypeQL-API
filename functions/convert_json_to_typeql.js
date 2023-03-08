var node_list = []
var connect_list = []
const recursive = (jsonData) => {
  var node_item = { id: jsonData.id, node_value: jsonData.value }
  node_list.push(node_item)

  jsonData.nodes && jsonData.nodes.map(node => {
    connect_list.push({ parent_id: jsonData.id, child_id: node.id })
    recursive(node)
  })
}

const convert_json_to_typeql = (jsonData) => {
  node_list = []
  connect_list = []
  recursive(jsonData)
  return { node_list, connect_list }
}

module.exports = { convert_json_to_typeql }