require('dotenv').config()
const { TypeDB, SessionType, TransactionType } = require("typedb-client");
const fs = require("fs");
const { parser } = require("stream-json");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { chain } = require("stream-chain");

const inital_data_input = [
  { dataPath: "./inital_db_data/treeNode", template: treeNodeTemplate },
  { dataPath: "./inital_db_data/nodeConnect", template: nodeConnectTemplate }
]

const build_tree_graph = async () => {
  const client = TypeDB.coreClient(process.env.DATABASE_CONNECT_URL)
  const session = await client.session(process.env.DATABASE_NAME, SessionType.DATA);

  for (input of inital_data_input) {
    console.log("Loading from [" + input.dataPath + "] into TypeDB ...");
    await loadDataIntoTypeDB(input, session); // 3
  }

  await session.close(); // 4
  client.close(); // 5
}

async function loadDataIntoTypeDB(input, session) {
  const items = await parseDataToObjects(input);

  for (item of items) {
    const transaction = await session.transaction(TransactionType.WRITE)
    const typeqlInsertQuery = input.template(item)
    console.log("Executing TypeQL Query: " + typeqlInsertQuery);
    await transaction.query.insert(typeqlInsertQuery);
    await transaction.commit();
  }

  console.log(
    `\nInserted ${items.length} items from [${input.dataPath}] into TypeDB.\n`
  );
}

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

function parseDataToObjects(input) {
  const items = [];
  return new Promise(function (resolve, reject) {
    const pipeline = chain([
      fs.createReadStream(input.dataPath + ".json"),
      parser(),
      streamArray()
    ]);

    pipeline.on("data", function (result) {
      items.push(result.value);
    });

    pipeline.on("end", function () {
      resolve(items);
    });
  });
}

module.exports = {build_tree_graph}