require('dotenv').config()
const { TypeDB, SessionType, TransactionType } = require("typedb-client");
const {convert_json_to_typeql} = require('../functions/convert_json_to_typeql')

function treeNodeTemplate(node) {
  const { id, node_value } = node
  let typeqlInsertQuery = `insert $node isa node, has id ${id}`;
  typeqlInsertQuery += `, has node_value "${node_value}"`

  typeqlInsertQuery += ";"
  return typeqlInsertQuery
}

function nodeConnectTemplate(connect) {
  const { parent_id, child_id } = connect

  let typeqlInsertQuery = `match $parent isa node, has id ${parent_id};`
  typeqlInsertQuery += `$child isa node, has id ${child_id};`
  typeqlInsertQuery += "insert (parent: $parent, child: $child) isa connect;"

  return typeqlInsertQuery
}

async function loadDataIntoTypeDB(items_list, item_list_template, session) {
  for (item of items_list) {
    const transaction = await session.transaction(TransactionType.WRITE)
    const typeqlInsertQuery = item_list_template(item)
    console.log("Executing TypeQL Query: " + typeqlInsertQuery);
    await transaction.query.insert(typeqlInsertQuery);
    await transaction.commit();
  }

  console.log(
    `\nInserted ${items_list.length} items into TypeDB.\n`
  );
}

const insert_new_tree_graph = async (json_data) => {
  const client = TypeDB.coreClient(process.env.DATABASE_CONNECT_URL)
  const session = await client.session(process.env.DATABASE_NAME, SessionType.DATA);

  // convert JSON Object data into array of nodes and connects
  var converted_typeql_data = convert_json_to_typeql(json_data) // { node_list: [], connect_list: [] }
  console.log(converted_typeql_data)
  await loadDataIntoTypeDB(
    converted_typeql_data.node_list, 
    treeNodeTemplate,
    session
  )

  await loadDataIntoTypeDB(
    converted_typeql_data.connect_list, 
    nodeConnectTemplate,
    session
  )
  
  await session.close();
  client.close();
}

module.exports = {insert_new_tree_graph}