const { TypeDB, SessionType, TransactionType } = require("typedb-client");

async function get_tree_graph() {
  const client = TypeDB.coreClient('localhost:1729')
  const session = await client.session('blitz', SessionType.DATA)

  const readTransaction = await session.transaction(TransactionType.READ)

  let tree_graph_connects_array = []
  let connect_match_group = await readTransaction.query.matchGroup(
    "match $p isa node, has id $p-id, has node_value $p-value; $con (parent: $p, child: $c) isa connect; $c isa node, has id $c-id; get $p-id, $p-value, $c-id; group $p-id;"
  )
  for await (const concept_map_group of connect_match_group) {
    var concept_map_group_owner = concept_map_group.owner.value // node -> id
    var node_child_idx_list = [] // node->nodes
    concept_map_group.conceptMaps.map((concept_map) => {
      var child_id = concept_map.get('c-id').value
      node_child_idx_list.push(child_id)
    })
    tree_graph_connects_array.push({
      id: concept_map_group_owner,
      nodes: node_child_idx_list
    })
  }

  let tree_graph_nodes_array = []
  let nodes_match = await readTransaction.query.match(
    "match $node isa node, has id $n-id, has node_value $n-value; get $node, $n-id, $n-value;"
  )
  for await (const concept_map of nodes_match) {
    tree_graph_nodes_array.push({
      id: concept_map.get('n-id').value,
      value: concept_map.get('n-value').value
    })
  }

  let root_node = {}
  let root_node_stream = await readTransaction.query.match(
    "match $root isa node, has id $root-id, has node_value $root-value; not { (parent: $parent, child: $root) isa connect; }; get $root-id, $root-value;"
  )
  for await (const root_item of root_node_stream) {
    root_node.id = root_item.get('root-id').value
  }

  await readTransaction.close()
  await session.close()
  return {tree_graph_nodes_array, tree_graph_connects_array, root_node}
}

module.exports = {get_tree_graph}