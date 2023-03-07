require('dotenv').config()
const {listen, buildTreeGraphRequest, getTreeGraphRequest }= require('./routes')
const main = () => {
  listen() // bind and listen the connections on the specified host and port
  buildTreeGraphRequest() // Initialize `blitz` database with the mock data
  getTreeGraphRequest()
}

main()