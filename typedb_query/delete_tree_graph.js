const { TypeDB, SessionType, TransactionType } = require("typedb-client");

async function delete_tree_graph() {
  const client = TypeDB.coreClient(process.env.DATABASE_CONNECT_URL)
  const session = await client.session(process.env.DATABASE_NAME, SessionType.DATA)

  const writeTransaction = await session.transaction(TransactionType.WRITE)

  const node_del_query_future = await writeTransaction.query.delete("match $n isa node; delete $n isa node;")
  const connect_del_query_future = await writeTransaction.query.delete("match $c isa connect; delete $c isa connect;")
  writeTransaction.commit()

  return { node_del_query_future, connect_del_query_future }
}

module.exports = { delete_tree_graph }