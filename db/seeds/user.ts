import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { firstname: knex.raw("crypt('Jean-Michel', gen_salt('bf'))"), lastname: knex.raw("crypt('GRONDIN', gen_salt('bf'))"), email: knex.raw("crypt('jean-michel.grondin@epitech.eu', gen_salt('bf'))"), password: knex.raw("crypt('6JM_api_TEMPLATE9', gen_salt('bf'))") },
    ]);
};
