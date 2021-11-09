CREATE TABLE IF NOT EXISTS day_times (
	day_times_id integer PRIMARY KEY,
	hour integer NOT NULL,
	minute integer NOT NULL,
	is_am boolean NOT NULL,
	is_pm boolean NOT NULL,
    time_format text NOT NULL
);