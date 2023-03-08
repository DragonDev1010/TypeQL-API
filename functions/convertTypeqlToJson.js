function get_nodes_by_idx (tree_graph_connects_array, idx) {
  for (let i = 0 ; i < tree_graph_connects_array.length ; i++) {
    if (tree_graph_connects_array[i].id === idx)
      return tree_graph_connects_array[i].nodes
  }
  return null
}

function get_node (tree_graph_array, idx) {
  for (let i = 0 ; i < tree_graph_array.length ; i++) {
    if (tree_graph_array[i].id === idx)
      return tree_graph_array[i]
  }
  return null
}

function convertTypeqlToArray(tree_graph_nodes_array, tree_graph_connects_array) {
  var tree_graph_array = []
  tree_graph_nodes_array.map(node => {
    var nodes = get_nodes_by_idx(tree_graph_connects_array, node.id)
    tree_graph_array.push({
      id: node.id,
      value: node.value,
      nodes: nodes
    })
  })
  return tree_graph_array
}

function convertTreeArrayToJson(treeArray, parentNode) {
  var jsonData = {}
  if (parentNode.nodes !== null) {
    var nodes_array = []
    parentNode.nodes.map((child_node_id) => {
      const child_node_item = get_node(treeArray, child_node_id)
      nodes_array.push(convertTreeArrayToJson(treeArray, child_node_item))
    })
    Object.assign(jsonData, {id: parentNode.id, value: parentNode.value}, {nodes: nodes_array})
  } else {
    Object.assign(jsonData, {id: parentNode.id, value: parentNode.value})
  }
  return jsonData
}

function convertTypeqlToJson(tree_graph_nodes_array, tree_graph_connects_array, root_node_id) {
  var tree_graph_array = convertTypeqlToArray(tree_graph_nodes_array, tree_graph_connects_array)
  var root_node = get_node(tree_graph_array, root_node_id)

  var jsonData = convertTreeArrayToJson(tree_graph_array, root_node)
  return jsonData
}
module.exports = {convertTypeqlToJson}