-- CREATE DATABASE mesodb;

CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  first_name      TEXT,
  last_name       TEXT,
  email           TEXT,
  password        TEXT,
  creation_date   DATE,
  is_deleted      BOOLEAN,
  user_type       TEXT,
  gender          TEXT,
  salt            TEXT
);

 -- /* tokens */
CREATE TABLE tokens (
  token_id        SERIAL PRIMARY KEY,
  token           TEXT UNIQUE NOT NULL,
  user_id         INTEGER REFERENCES users(user_id) NOT NULL,
  expiration_date TIMESTAMP,
  -- user_type       TEXT
);

-- /* administrators */
-- CREATE TABLE admins (
--   admin_id        SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id),
-- );

-- /* managers */
CREATE TABLE managers (
  manager_id      SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(user_id),
  is_assistant    BOOLEAN,
);

-- -- /* employees */
-- CREATE TABLE employees (
--   employee_id    SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id),
--   phone           TEXT
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

CREATE TABLE notifications (
  notification_id   SERIAL PRIMARY KEY,
  title             TEXT,
  body              TEXT,
  sent_date         TIMESTAMP,
  type              TEXT
);

create table user_notifications (
  user_id         INTEGER REFERENCES users(user_id),
  notification_id INTEGER REFERENCES notifications(notification_id),
  seen            BOOLEAN,
  seen_date       TIMESTAMP,
  PRIMARY KEY (user_id, notification_id)
);

-- CREATE TABLE activity_logs (
--   log_id            SERIAL PRIMARY KEY,
--   log_date          DATE,
--   action_performed  TEXT,
--   user_id           INTEGER REFERENCES users(user_id)
-- );


-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

insert into permissions (email, code, permission_type) values('kevin.ramirez3@upr.edu', 'provi_123456', 'admin');












-- create table users(
--   user_id serial not null primary key, 
--   code integer not null, 
--   first_name varchar(20),
--   last_name varchar(30), 
--   phone varchar(14),
--   email varchar(30) unique, 
--   password varchar(130), 
--   restaurant varchar(40),
--   user_type varchar(10)
-- );

-- insert into users(code, first_name, last_name, phone, email, password, restaurant, user_type)
-- values(1234, 'first', 'last', '7874307478', 'test@gmail.com', 'password', 'hatillo', 'manager');