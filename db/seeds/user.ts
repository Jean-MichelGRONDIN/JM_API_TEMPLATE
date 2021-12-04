import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        { firstname: "Jean-Michel", lastname: "GRONDIN", email: "jean-michel.grondin@epitech.eu", password: knex.raw("crypt('6JM_api_TEMPLATE9', gen_salt('bf'))") },
    ]);
};
