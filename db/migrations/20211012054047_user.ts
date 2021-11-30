import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
        table.string('firstname');
        table.string('lastname');
        table.string('email');
        table.string('password');
        table.string('status');
    }).createTable('refresh_token', table => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw("gen_random_uuid()"));
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
        table.text('ip');
        table.text('user_agent');
        table.text('token');
        table.timestamp('expiron');
        table.uuid('user_id');
        table.foreign('user_id').references('users.id');
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('refresh_token').dropTable('users')
}

