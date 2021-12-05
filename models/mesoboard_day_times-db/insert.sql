WITH time1 AS (
    SELECT generate_series('2020-01-01 4:00:00'::timestamp, '2020-01-02 03:59:00'::timestamp, '10 minute') AS ts
)
, time2 AS (
	SELECT
		get_time_primary_key(ts) AS day_times_id,
		EXTRACT(HOUR FROM ts) AS hour,
		EXTRACT(MINUTE FROM ts) AS minute
	FROM time1
)
, time3 AS (
	SELECT *,
		CASE
			WHEN hour < 10 THEN '0' || hour
			ELSE hour::text
		END AS hour_long,
		CASE
			WHEN minute < 10 THEN '0' || minute
			ELSE minute::text
		END AS minute_long,
	    hour < 13 AS is_am,
		hour >= 13 AS is_pm
	FROM time2
)
, time4 AS (
	SELECT *,
		hour_long || ':' || minute_long as time_format
	FROM time3
)
INSERT INTO day_times
	SELECT day_times_id, hour, minute, is_am, is_pm, time_format
FROM time4;