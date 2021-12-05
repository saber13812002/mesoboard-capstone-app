-- /* create db  */
-- CREATE DATABASE mesodb;

-- function
CREATE OR REPLACE FUNCTION get_week_schedule_primary_key(ts timestamp) RETURNS integer AS $$
BEGIN
	RETURN 10000 * EXTRACT(YEAR FROM ts) +
		100 * EXTRACT(MONTH FROM ts) +
		EXTRACT(DAY FROM ts);
END;
$$ LANGUAGE plpgsql;

CREATE TABLE restaurant (
    restaurant_id       INTEGER UNIQUE,
    location            TEXT UNIQUE,
    category            TEXT,
    manager_name        TEXT,
    phone               TEXT,
    physical_address    TEXT
);

CREATE TABLE permission (
    permission_id           SERIAL PRIMARY KEY,
    restaurant_id           INTEGER REFERENCES restaurant(restaurant_id),
    employee_id             TEXT,
    email                   TEXT,
    permission_type         TEXT,
    code                    TEXT,
    last_update             TIMESTAMP,
    is_assistant_manager    BOOLEAN
);

CREATE TABLE users (
    user_id             SERIAL PRIMARY KEY,
    restaurant_id       INTEGER REFERENCES restaurant(restaurant_id),
    employee_id         TEXT,
    first_name          TEXT,
    last_name           TEXT,
    email               TEXT,
    user_type           TEXT,
    gender              TEXT,
    phone               TEXT,
    creation_date       DATE,
    is_deleted          BOOLEAN,
    password            TEXT,
    salt                TEXT
);

-- /* manager */
CREATE TABLE manager (
    manager_id      SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(user_id),
    is_assistant    BOOLEAN
);

 -- /* tokens */
CREATE TABLE tokens (
    token_id        SERIAL PRIMARY KEY,
    token           TEXT UNIQUE NOT NULL,
    user_id         INTEGER REFERENCES users(user_id) NOT NULL,
    expiration_date TIMESTAMP,
    user_type       TEXT
);


CREATE TABLE reset_password (
    reset_id          SERIAL PRIMARY KEY,
    user_id           INTEGER REFERENCES users(user_id),
    request_date      TIMESTAMP
);

-- CREATE TABLE activity_logs (
--   log_id            SERIAL PRIMARY KEY,
--   log_date          DATE,
--   action_performed  TEXT,
--   user_id           INTEGER REFERENCES users(user_id)
-- );


CREATE TABLE schedule (
--     schedule_id    INTEGER PRIMARY KEY,
    schedule_id    SERIAL PRIMARY KEY,
    week_start          DATE NOT NULL,
    week_end            DATE NOT NULL,
    is_approved         BOOLEAN
);

create table user_schedule (
--     user_schedule_id        INTEGER REFERENCES schedule(schedule_id),
    user_schedule_id        SERIAL PRIMARY KEY,
    user_id                 INTEGER REFERENCES users(user_id),
--     turn_id                 INTEGER REFERENCES turn(turn_id), -- only if manager is not allowed to set same turn hours
    turn_id                 INTEGER NOT NULL,
    schedule_id             INTEGER REFERENCES schedule(schedule_id),
    date_start              TIMESTAMP,
    date_end                TIMESTAMP,
    date_lunch              TIMESTAMP,
    is_hour_lunch           BOOLEAN
);


WITH date1 AS (
	SELECT generate_series('2021-11-09'::timestamp, '2021-12-29'::timestamp, '7 day') AS ts
)
, date2 AS (
	SELECT
	    get_week_schedule_primary_key(ts) AS schedule_id,
        ts AS week_start,
	    ts + INTERVAL '6 DAY' AS week_end,
	    FALSE AS is_approved
	FROM date1
)
INSERT INTO schedule
	SELECT
        schedule_id,
        week_start,
        week_end,
        is_approved
	FROM date2;

CREATE TABLE turn (
--     turn_id         SERIAL PRIMARY KEY,
--     turn_id         INTEGER NOT NULL UNIQUE, -- specified through the frontend
    turn_id         INTEGER NOT NULL, -- specified through the frontend
    user_id         INTEGER REFERENCES users(user_id),
    time_start      TIME,
    time_end        TIME,
    time_lunch      TIME
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
VALUES(2, 'Mayagüez Mall', 'In-line', 'Héctor Rivera', '787-833-6409', 'PR-2 Mayaguez Mall, Local D Frente al Banco Santander, Mayagüez, PR 00680');
INSERT INTO restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
VALUES(3, 'Plaza Las Américas, Hato Rey', 'Food Court', 'Luis Gavillan', '787-753-1705', 'La Terraza Local 315');

INSERT INTO permission(email, permission_type, code, employee_id, is_assistant_manager)
VALUES('admin@test.com', 'admin', '123456', '123456', false);

