import { OAuth2Server } from "oauth2-mock-server"

import { createLogger } from "@acme/logging"

const logger = createLogger()
const server = new OAuth2Server()
await server.issuer.keys.generate("RS256")
await server.start(8080, "localhost")
logger.withMetadata({ url: server.issuer.url }).info("Issuer URL:") // -> http://localhost:8080
