CREATE OR REPLACE FUNCTION get_date_primary_key(ts timestamp) RETURNS integer AS $$
BEGIN
	RETURN 10000 * EXTRACT(YEAR FROM ts) +
		100 * EXTRACT(MONTH FROM ts) +
		EXTRACT(DAY FROM ts);
END;
$$ LANGUAGE plpgsql;