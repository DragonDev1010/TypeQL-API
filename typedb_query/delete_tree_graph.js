const { TypeDB, SessionType, TransactionType } = require("typedb-client");

async function delete_tree_graph() {
  const client = TypeDB.coreClient('localhost:1729')
  const session = await client.session('blitz', SessionType.DATA)

  const writeTransaction = await session.transaction(TransactionType.WRITE)

  const node_del_query_future = await writeTransaction.query.delete("match $n isa node; delete $n isa node;")
  const connect_del_query_future = await writeTransaction.query.delete("match $c isa connect; delete $c isa connect;")
}

module.exports = {delete_tree_graph}