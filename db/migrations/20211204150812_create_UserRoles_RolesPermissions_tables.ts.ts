import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('roles', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

        table.string('identifier').notNullable();

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    })
    .createTable('user_has_roles', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('users.id');

        table.uuid('role_id').notNullable();
        table.foreign('role_id').references('roles.id');

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    })
    .createTable('permissions', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

        table.string('identifier').notNullable();

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    })
    .createTable('role_has_permissions', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));

        table.uuid('role_id').notNullable();
        table.foreign('role_id').references('roles.id');

        table.uuid('permission_id').notNullable();
        table.foreign('permission_id').references('permissions.id');

        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema

    .dropTable('role_has_permission')
    .dropTable('permissions')
    .dropTable('user_has_role')
    .dropTable('roles');
}

