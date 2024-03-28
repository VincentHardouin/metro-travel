/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('routes', (table) => {
    table.text('route_id').primary();
    table.text('route_short_name').defaultTo('');
    table.text('route_long_name').defaultTo('');
    table.text('route_desc').defaultTo('');
    table.integer('route_type');
    table.text('route_color').notNullable();
    table.text('route_text_color').notNullable();
  });

  await knex.schema.createTable('stops', (table) => {
    table.text('stop_id').primary();
    table.text('stop_name').notNullable();
    table.text('stop_desc').nullable();
    table.double('stop_lat').notNullable();
    table.double('stop_lon').notNullable();
    table.text('zone_id');
    table.text('stop_url');
    table.text('parent_station');
    table.text('platform_code').nullable();
  });

  await knex.schema.createTable('stop_times', (table) => {
    table.text('trip_id').notNullable();
    table
      .text('arrival_time')
      .notNullable();
    table.check('??::interval = ??::interval', ['arrival_time', 'arrival_time']);
    table
      .text('departure_time')
      .notNullable();
    table.check('??::interval = ??::interval', ['departure_time', 'departure_time']);
    table.text('stop_id');
    table.integer('stop_sequence').notNullable();
    table.integer('pickup_type');
    table.integer('drop_off_type');
    table.primary(['trip_id', 'stop_sequence']);
    table.index(['trip_id', 'stop_id'], 'stop_times_key');
  });

  await knex.schema.createTable('trips', (table) => {
    table.text('route_id').notNullable();
    table.text('service_id').notNullable();
    table.text('trip_id').notNullable().primary();
    table.text('trip_headsign');
    table.integer('direction_id');
    table.text('block_id');
    table.text('shape_id');
    table.index('trip_id');
  });

  await knex.schema.createTable('pathways', (table) => {
    table.text('pathway_id').notNullable();
    table.text('from_stop_id');
    table.text('to_stop_id');
    table.text('pathway_mode').notNullable();
    table.boolean('is_bidirectional').defaultTo(false);
    table.float('length');
    table.integer('traversal_time').notNullable();
    table.integer('stair_count');
    table.float('max_slope');
    table.float('min_width');
    table.text('signposted_as');
    table.text('reversed_signposted_as');
    table.primary(['pathway_id']);
  });

  await knex.schema.createTable('transfers', (table) => {
    table.text('from_stop_id').notNullable();
    table.text('to_stop_id').notNullable();
    table.integer('transfer_type').notNullable();
    table.integer('min_transfer_time').notNullable();
    table.primary(['from_stop_id', 'to_stop_id']);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('routes');
  await knex.schema.dropTable('stops');
  await knex.schema.dropTable('stop_times');
  await knex.schema.dropTable('trips');
  await knex.schema.dropTable('pathways');
  await knex.schema.dropTable('transfers');
}
