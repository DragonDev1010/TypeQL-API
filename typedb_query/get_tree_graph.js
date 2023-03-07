const { TypeDB, SessionType, TransactionType } = require("typedb-client");

const getTreeGraph = async () => {
  const client = TypeDB.coreClient(process.env.DATABASE_CONNECT_URL)
  const session = await client.session(process.env.DATABASE_NAME, SessionType.DATA);
  const transaction = await session.transaction(TransactionType.READ)
  let typeqlGetQuery = [
    "match",
    "  $connect isa connect;",
    "  $node isa node, has id $node_id;",
    "get $connect, $node_id;"
  ];
  
  console.log("\nQuery:\n", typeqlGetQuery.join("\n"));
  typeqlGetQuery = typeqlGetQuery.join("");

  const iterator = await transaction.query.match(typeqlGetQuery);
  const answers = await iterator.collect();
  let result = []
  answers.map(answer => {
    result.push(answer.get('node_id').value)
  })
  // const result = await Promise.all(
  //   answers.map(answer => answer.get("node_id").value)
  // );

  console.log("\nResult:\n", result);

  await transaction.query.insert(typeqlGetQuery);
  await transaction.commit();

  return result
}

module.exports = {getTreeGraph}