import { seed } from "drizzle-seed"

import { db } from "./client"
import { users } from "./schemas"

async function main() {
  await seed(db, { users }, { count: 10 })
}

void main()
