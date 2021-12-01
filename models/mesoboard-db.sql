-- /* create db  */
-- CREATE DATABASE IF NOT EXISTS mesodb;

-- function
CREATE OR REPLACE FUNCTION get_week_schedule_primary_key(ts timestamp) RETURNS integer AS $$
BEGIN
	RETURN 10000 * EXTRACT(YEAR FROM ts) +
		100 * EXTRACT(MONTH FROM ts) +
		EXTRACT(DAY FROM ts);
END;
$$ LANGUAGE plpgsql;


CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT,
  creation_date   DATE,
  is_deleted      BOOLEAN,
  user_type       TEXT,
--   code        BOOLEAN,
  gender          TEXT,
  password        TEXT,
  salt            TEXT
);
 -- /* tokens */
CREATE TABLE tokens (
  token_id        SERIAL PRIMARY KEY,
  token           TEXT UNIQUE NOT NULL,
  user_id         INTEGER REFERENCES users(user_id) NOT NULL,
  expiration_date TIMESTAMP,
  user_type       TEXT
  -- UNIQUE uniqueTokens (token)
);

-- -- /* admin */
-- CREATE TABLE admin (
--   admin_id        SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id),
--   admin_type      TEXT
-- );
--
-- -- /* manager */
-- CREATE TABLE manager (
--   manager_id      SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id),
--   is_assistant    BOOLEAN
-- );

-- -- /* employee */
-- CREATE TABLE employee (
--   employee_id      SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id)
-- --   employee_code       TEXT
-- );

CREATE TABLE reset_password (
  reset_id          SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(user_id),
  request_date      TIMESTAMP
);


CREATE TABLE permissions (
  permission_id     SERIAL PRIMARY KEY,
  email             TEXT,
  code              TEXT UNIQUE,
  last_update       TIMESTAMP,
  permission_type   TEXT
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
    is_hour_lunch           BOOLEAN,
    num_day_in_week         INTEGER
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

insert into permissions (email, code, permission_type) values('kevin.ramirez3@upr.edu', '123456', 'manager');

