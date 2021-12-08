-- table
CREATE TABLE IF NOT EXISTS schedule (
	schedule_id integer PRIMARY KEY,
	date timestamp NOT NULL,
	date_format text NOT NULL, 		-- mm/dd/yyyy
	date_short_format text NOT NULL, -- m/d/yyyy
	date_iso_format text NOT NULL, 		-- yyyy-mm-dd
	num_year integer NOT NULL,
	num_month_in_year integer NOT NULL,
-- 	num_week_in_year integer NOT NULL,
-- 	num_week_in_month integer NOT NULL,
-- 	num_day_in_year integer NOT NULL,
	num_day_in_month integer NOT NULL,
	num_day_in_week integer NOT NULL,
	is_holiday boolean NOT NULL,
	---- Names
	name_month_en text NOT NULL,
	name_month_abbreviated_en text NOT NULL,
	name_day_en text NOT NULL,
	name_day_abbreviated_en text NOT NULL
);