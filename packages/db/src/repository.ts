/**
 * Inspired by
 * https://github.com/Enalmada/drizzle-helpers
 *
 *
 * Sources:
 *  * https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-2126704308
 *
 * Todos:
 *  * Make the schema input generic to make it reusable ( see `Schema` type )
 */

import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  InferInsertModel,
  Operators,
  Simplify,
  SQL,
} from "drizzle-orm"
import type { PgDatabase, PgUpdateSetSource } from "drizzle-orm/pg-core"
import type {
  PgRelationalQuery,
  RelationalQueryBuilder,
} from "drizzle-orm/pg-core/query-builders/query"
import { getOperators, getTableColumns } from "drizzle-orm"
import { getTableConfig } from "drizzle-orm/pg-core"

import * as schemas from "./schemas"

type Schema = typeof schemas
type TablesWithRelations = ExtractTablesWithRelations<Schema>
type TableNames = keyof TablesWithRelations

type QueryConfig<TableName extends TableNames> = DBQueryConfig<
  "one" | "many",
  boolean,
  TablesWithRelations,
  TablesWithRelations[TableName]
>

export type InferQueryModel<
  TableName extends TableNames,
  QBConfig extends QueryConfig<TableName> = object,
> = PgRelationalQuery<
  BuildQueryResult<TablesWithRelations, TablesWithRelations[TableName], Omit<QBConfig, "limit">>
>

interface CreateRepositoryProps<TableName extends TableNames> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: PgDatabase<any, Schema, TablesWithRelations>
  table: TableName
  queryBuilder: RelationalQueryBuilder<TablesWithRelations, TablesWithRelations[TableName]>
}

export const createRepository = <TableName extends TableNames>({
  db,
  table,
  queryBuilder,
}: CreateRepositoryProps<TableName>) => {
  return {
    /**
     * Find the first record matching the given query configuration.
     *
     * @param qbConfig - The query configuration to use when finding the first record.
     * @returns A promise that resolves with the found record, or undefined if no record was found.
     */
    findFirst: async <QBConfig extends QueryConfig<TableName>>(
      qbConfig?: QBConfig,
    ): Promise<InferQueryModel<TableName, QBConfig> | undefined> => {
      return (await queryBuilder.findFirst(qbConfig)) as unknown as Promise<
        InferQueryModel<TableName, QBConfig> | undefined
      >
    },

    /**
     * Find a list of records matching the given query configuration.
     *
     * @param qbConfig - The query configuration to use when finding multiple records.
     * @returns A promise that resolves with a list of found records, or an empty list if no records were found.
     */
    findMany: async <QBConfig extends QueryConfig<TableName>>(
      qbConfig?: QBConfig,
    ): Promise<InferQueryModel<TableName, QBConfig>[] | undefined> => {
      return queryBuilder.findMany(qbConfig) as unknown as Promise<
        InferQueryModel<TableName, QBConfig>[] | undefined
      >
    },

    /**
     * Create a new record in the specified table and returns the created record.
     *
     * @param data - The data to insert into the table.
     * @returns A promise that resolves with the created record, or undefined if no record was created.
     */
    create: async (data: InferInsertModel<Schema[TableName]>) => {
      const newRecord = await db
        .insert(schemas[table] as Schema[TableName])
        .values(data)
        .returning()

      // ensure we return the correct type
      // for now, we only return the data from the current table
      // maybe we could add also support for `with` to support relations
      // but I hope we will get the new version of the query builder in the next months
      return newRecord[0] as unknown as Promise<InferQueryModel<TableName> | undefined>
    },

    /**
     * Create multiple records in the specified table and returns a list of created records.
     *
     * @param data - A list of data to insert into the table.
     * @returns A promise that resolves with a list of created records, or an empty list if no records were created.
     */
    createMany: async (data: InferInsertModel<Schema[TableName]>[]) => {
      return (await db
        .insert(schemas[table] as Schema[TableName])
        .values(data)
        .returning()) as unknown as Promise<InferQueryModel<TableName>[]>
    },

    /**
     * Perform an upsert operation on the specified table.
     * Behind the scenes, it uses the specified unique fields to determine whether an existing record should be updated instead of inserted.
     *
     * The `upsert` method takes a single object with two properties: `create` and `update`.
     * - `create`: An object containing data to insert into the table if no matching record exists.
     * - `update`: An object containing data to update in the table if a matching record is found.
     *
     * @param {Object} opts - Options for the upsert operation.
     * @param {InferInsertModel<Schema[TableName]>} opts.create - Data to insert into the table if no matching record exists.
     * @param {PgUpdateSetSource<Schema[TableName]>} opts.update - Data to update in the table if a matching record is found.
     *
     * @returns A promise that resolves with the upserted record, or undefined if no record was created.
     */
    upsert: async ({
      create,
      update,
      conflictFields,
    }: {
      create: InferInsertModel<Schema[TableName]>
      update: PgUpdateSetSource<Schema[TableName]>
      conflictFields: (keyof Schema[TableName]["_"]["columns"])[]
    }) => {
      const { columns } = getTableConfig(schemas[table] as Schema[TableName])

      const targetFields = columns.filter((c) => (conflictFields as string[]).includes(c.name))

      return (
        (await db
          .insert(schemas[table] as Schema[TableName])
          .values(create)
          .onConflictDoUpdate({ set: update, target: targetFields })
          // ensure we return the correct type
          // for now, we only return the data from the current table
          .returning()) as unknown as Promise<InferQueryModel<TableName> | undefined>
      )
    },

    /**
     * Update a record in the specified table.
     *
     * @param {Object} opts - Options for the update operation.
     * @param {PgUpdateSetSource<Schema[TableName]>} opts.data - Data to update in the table.
     * @param {SQL | undefined} opts.where - The condition to use when finding the record to update. If omitted, all records are updated.
     *
     * @returns A promise that resolves with the updated record, or undefined if no record was found.
     */
    update: async ({
      data,
      where,
    }: {
      data: PgUpdateSetSource<Schema[TableName]>
      where?:
        | SQL
        | undefined
        | ((
            fields: Simplify<
              [Schema[TableName]["_"]["columns"]] extends [never]
                ? object
                : Schema[TableName]["_"]["columns"]
            >,
            operators: Operators,
          ) => SQL | undefined)
    }) => {
      // workaround until drizzle supports the callback for `where`
      // https://github.com/drizzle-team/drizzle-orm/issues/3524
      const columns = getTableColumns(schemas[table] as Schema[TableName])
      const operators = getOperators()
      const condition = typeof where === "function" ? where(columns, operators) : where

      return (await db
        .update(schemas[table] as Schema[TableName])
        .set(data)
        .where(condition)
        .returning()) as unknown as Promise<InferQueryModel<TableName> | undefined>
    },

    /**
     * Delete a record from the specified table.
     *
     * @param {Object} opts - Options for the delete operation.
     * @param {SQL | undefined} opts.where - The condition to use when finding the record to delete. If omitted, all records are deleted.
     *
     * @returns A promise that resolves with the deleted count, or undefined if no records were deleted.
     */
    delete: async ({
      where,
    }: {
      where?:
        | SQL
        | undefined
        | ((
            fields: Simplify<
              [Schema[TableName]["_"]["columns"]] extends [never]
                ? object
                : Schema[TableName]["_"]["columns"]
            >,
            operators: Operators,
          ) => SQL | undefined)
    }) => {
      // workaround until drizzle supports the callback for `where`
      // https://github.com/drizzle-team/drizzle-orm/issues/3524
      const columns = getTableColumns(schemas[table] as Schema[TableName])
      const operators = getOperators()
      const condition = typeof where === "function" ? where(columns, operators) : where

      return await db
        .delete(schemas[table] as Schema[TableName])
        .where(condition)
        .returning()
    },
  }
}
