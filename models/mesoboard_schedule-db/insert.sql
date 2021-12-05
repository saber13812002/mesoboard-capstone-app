-----http://www.thomascerqueus.fr/scripts-to-populate-the-date-dimension-in-a-postgresql-data-warehouse/

-- function
CREATE OR REPLACE FUNCTION get_date_primary_key(ts timestamp) RETURNS integer AS $$
BEGIN
	RETURN 10000 * EXTRACT(YEAR FROM ts) +
		100 * EXTRACT(MONTH FROM ts) +
		EXTRACT(DAY FROM ts);
END;
$$ LANGUAGE plpgsql;


-- insert
WITH date1 AS (
-- 	SELECT generate_series('2020-11-08'::timestamp, '2020-12-15'::timestamp, '1 day') AS ts
    SELECT generate_series('2021-11-09'::timestamp, '2021-12-10'::timestamp, '1 day') AS ts
), date2 AS (
	SELECT get_date_primary_key(ts) AS schedule_id,
		ts AS date,
		to_char(ts, 'MM/DD/YYYY') AS date_format,
		EXTRACT(MONTH FROM ts) || '/' || EXTRACT(DAY FROM ts) || '/' || EXTRACT(YEAR FROM ts) AS date_short_format,
		to_char(ts, 'YYYY-MM-DD') AS date_iso_format,
		EXTRACT(YEAR FROM ts) AS num_year,
		EXTRACT(MONTH FROM ts) AS num_month_in_year, --used to determine holidays
-- 		EXTRACT(WEEK FROM ts) AS num_week_in_year,
-- 		EXTRACT(WEEK FROM ts) - EXTRACT(WEEK FROM date(date_trunc('MONTH', ts))) + 1 AS num_week_in_month,
-- 		EXTRACT(DOY FROM ts) AS num_day_in_year,
		EXTRACT(DAY FROM ts) AS num_day_in_month,
		EXTRACT(ISODOW FROM ts - INTERVAL '1 DAY') AS num_day_in_week
	FROM date1
), date3 AS (
	SELECT *,
		num_month_in_year = 1 AND num_day_in_month = 1 OR
		num_month_in_year = 7 AND num_day_in_month = 4 OR
		num_month_in_year = 12 AND num_day_in_month = 25 AS is_holiday
	FROM date2
), date4 AS (
	SELECT
		*,
		CASE
			WHEN num_month_in_year = 1 THEN 'January'
			WHEN num_month_in_year = 2 THEN 'February'
			WHEN num_month_in_year = 3 THEN 'March'
			WHEN num_month_in_year = 4 THEN 'April'
			WHEN num_month_in_year = 5 THEN 'May'
			WHEN num_month_in_year = 6 THEN 'June'
			WHEN num_month_in_year = 7 THEN 'July'
			WHEN num_month_in_year = 8 THEN 'August'
	 		WHEN num_month_in_year = 9 THEN 'September'
			WHEN num_month_in_year = 10 THEN 'October'
			WHEN num_month_in_year = 11 THEN 'November'
			WHEN num_month_in_year = 12 THEN 'December'
		END AS name_month_en,
		CASE
			WHEN num_day_in_week = 1 THEN 'Tuesday'
			WHEN num_day_in_week = 2 THEN 'Wednesday'
			WHEN num_day_in_week = 3 THEN 'Thursday'
			WHEN num_day_in_week = 4 THEN 'Friday'
			WHEN num_day_in_week = 5 THEN 'Saturday'
			WHEN num_day_in_week = 6 THEN 'Sunday'
            WHEN num_day_in_week = 7 THEN 'Monday'
		END AS name_day_en
	FROM date3
), date5 AS (
	SELECT *,
		substring(name_month_en from 1 for 3) AS name_month_abbreviated_en,
		substring(name_day_en from 1 for 2) AS name_day_abbreviated_en
	FROM date4
)
INSERT INTO schedule
	SELECT schedule_id, date,
		date_format, date_short_format, date_iso_format,
		num_year,
		num_month_in_year,
-- 		num_week_in_year,
-- 	    num_week_in_month,
-- 		num_day_in_year,
	    num_day_in_month, num_day_in_week,
		is_holiday,
		name_month_en, name_month_abbreviated_en, name_day_en, name_day_abbreviated_en
	FROM date5;


-- select * from schedule;
-- drop table schedule;