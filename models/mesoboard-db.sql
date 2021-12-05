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
  -- UNIQUE uniqueTokens (token)
);


-- -- /* admin */
-- CREATE TABLE admin (
--   admin_id        SERIAL PRIMARY KEY,
--   user_id         INTEGER REFERENCES users(user_id),
--   admin_type      TEXT
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
  code              TEXT,
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

insert into permissions (email, code, permission_type) 
values('kevin.ramirez3@upr.edu', '123456', 'manager');


create table restaurant (
    restaurant_id   INTEGER UNIQUE,
    location        TEXT UNIQUE,
    category        TEXT,
    manager_name    TEXT,
    phone           TEXT,
    physical_address    TEXT

);

insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (002, 'Mayagüez Mall', 'In-line',	'Héctor Rivera',	'787-833-6409',	'PR-2 Mayaguez Mall, Local D Frente al Banco Santander, Mayagüez, PR 00680');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (003,	'Plaza Las Américas, Hato Rey',	'Food Court',	'Luis Gavillan',	'787-753-1705',	'La Terraza Local 315');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (005,	'Viejo San Juan',	'Salón Comedor','Jaime Marrero',	'787-721-5286',	'Calle San José 261, Esquina San Francisco');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (006,	'Plaza del Caribe, Ponce ',	'Food Court','Josean Baez',	'787-848-4971',	'El Carrousel Local 239');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (007, 'Plaza del Norte, Hatillo', 'Food Court',	'Javier Deliz',	'787-878-7707',	'La Cantina Local F-104');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (009,	'Plaza Carolina',	'Food Court',	'René Ramos',	'787-769-0790',	'La Plazoleta Local 304');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (010,	'Plaza del Oeste, San Germán',	'In-line','Luis Alicea',	'787-892-5855',	'Carr. # 2,  al frente de Hospital La Concepción');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (012,	'Las Catalinas Mall, Caguas',	'Food Court','Herminio Pantojas',	'787-743-9317',	'Local 003');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (013, 'Aguadilla Borinquen', 'Stand Alone',	'Carlos Hernandez',	'787-882-2702',	'Carretera 107 Km 7.2, Hacia la Base Ramey');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (014,	'Western Plaza, Mayagüez',	'In-line',	'Margarita Ruiz',	'787-265-1237',	'Carretera #2 Barrio Sabanetas');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (016,	'Aguadilla Mall',	'In-line','Militza Vicenty',	'787-819-1393',	'Carretera #2 Km 126.5');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (017, 'Hatillo II', 'Stand Alone',	'Heriberto Martínez',	'787-820-9114',	'Carretera #2 Km 87 Barrio Pueblo');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (018,	'Parque Escorial, Carolina',	'Stand Alone',	'Jessica Carmona',	'787-762-0130',	'65 de Infantería, Carolina');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (019,	'Ponce II, Séctor El Tuque',	'Stand Alone','Kevin Ayala',	'787-259-2176',	'Carretera # 2 Km.223.5 Bo. Canas');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (020,	'Yauco Plaza',	'Stand Alone','Marisol Irizarry',	'787-267-4242',	'Carr. #2 128 Int.Local#2');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (021, 'The Outlet, Canóvanas', 'Food Court',	'Michael Santos',	'787-256-5010',	'Carr. #3 Km 18.4 Local 086');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (022,	'Rexville Towne Center, Bayamón',	'Stand Alone',	'Raul Ramos',	'787-797-5077',	'Ave. Comerio, Bayamón');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (024,	'Fajardo Shopping Center',	'Stand Alone','Pablo Rodriguez',	'787-863-2090',	'Carr. #3  Fajardo Shopping Center');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (025,	'Santa Isabel Shopping',	'Stand Alone','Natalie Lugo',	'787-845-4572',	'Plaza Jauca State Road  Carretera #153, Km 6.9 Esquina Carretera PR 52, Bo. Usera');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (026, 'El Trigal Plaza, Manatí', 'Stand Alone',	'Carlos Gonzalez',	'787-884-6206',	'Carretera #2 km 4.8, Esquina Carretera #149, Manatí');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (010,	'Plaza del Oeste, San Germán',	'In-line','Luis Alicea',	'787-892-5855',	'Carr. # 2,  al frente de Hospital La Concepción');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (028,	'Aeropuerto Luis Muñoz Marín',	'In-line',	'',	'',	'Terminal C, Local 3 segundo nivel, Food Court, Isla Verde, Carolina');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (029,	'El Monte Town Center, Ponce',	'Stand Alone','Heriberto Jacome',	'787-290-3335',	'Carr 14 Km 7, Barrio Coto Laurel');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (030, 'Galería 100 Shopping Center', 'In-line',	'Minelly Nuñiz',	'787-255-6005',	'PR 100, Cabo Rojo');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (031,	'Mayagüez Terrace',	'Stand Alone',	'Yahaira Camacho',	'787-833-8114',	'Carr 2 Km 153.2, Bo Miradero, Mayagüez');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (032,	'Villa Humacao',	'Stand Alone','Elias Laracuente',	'787-850-8511',	'Carr. #3, Río Abajo, Humacao');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (033, 'Montehiedra', '',	'Miguel Diaz',	'787-731-1330',	'Local 1400 Montehiedra Mall, Rio Piedras');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (034,	'Cayey',	'Stand Alone',	'Norman García',	'787-738-7007',	'Carr. PR 1 Km 55.7 Lote 23 Bo. Montellano');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (035,	'Dorado',	'Stand Alone','Angel Otero',	'939-202-2984',	'Dorado Shopping Center 693 km 1.5 int. lote A 3 Bo Maguallo');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (036,	'Guaynabo',	'Stand Alone','Roberto del Valle',	'939-205-1136',	'Sanchez Food Court PR 199 Las Cumbres Guaynabo 00965');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (037,	'Santurce',	'Food Court',	'Ezequiel Santiago',	'787-725-4900',	'Condominio Plaza de Diego Local 1-A Ave de Diego #310 Bo. Santurce, SJ, P.R. 00909-1730');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (038,	'San Sebastian',	'Stand Alone','Samely Aponte',	'787-675-3535',	'Barrio Guatemala , Carr 111 Km. 17.7 San Sebartian, PR 00685-0000');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (039, 'San Patricio', 'Stand Alone',	'Felix Arroyo',	'787-955-6403',	'Local 1400 Montehiedra Mall, Rio Piedras');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (040,	'Plaza Centro',	'Stand Alone',	'Rose Morales',	'787-955-6403',	'200 Avenida Rafael Cordero Plaza Centro Site 201365 B Carr #156 km. 56.5 Caguas, P.R. 00726 ');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (041,	'Rio Bayamón',	'Stand Alone','Ruben Marrero',	'787-955-6403',	'CARR PR- 177 km 4.5 BO. JUAN SANCHEZ PARCELA #3 CENTRO COMERCIAL PLAZA RIO BAYAMON BAYAMON, PR 00959');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (015,	'Sierra, Bayamón',	'In-line','Alma Santiago',	'787-269-3896',	'West Main Esq. North Main');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (023,	'Plaza del Sol, Bayamón',	'Food Court','Sharai Soto',	'787-778-0075',	'Plaza del Sol Shopping Center, Ave. Main Sierra,  Bayamón');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (027, 'Plaza Río Hondo, Bayamón', 'Food Court',	'Milton Ralat',	'787-261-5464',	'Food Court "El Embarcadero", Local #10, Ave. Comerío, Expreso de Diego, Bayamón');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (1101,	'Florida Mall',	'Food Court',	'Alain Jorge',	'1-407-850-9580',	'8001 S Orange Blossom Trail Orlando, FL 32809');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (1102,	'Osceola',	'Food Court','Joel Vargas',	'1-407-572-8092',	'1010 W Osceola Parkway Kissimmee, FL 34741');
insert into restaurant(restaurant_id, location, category, manager_name, phone, physical_address)
values (1104,	'Lee Vista',	'In-line','Jonathan Cancel',	'1-407-852-3131',	'6622 Eagle Watch Dr. Ste 555 Orlando FL 32822-2397');

