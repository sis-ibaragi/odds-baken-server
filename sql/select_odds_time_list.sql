select
	ODDS_TIME_NO,
	to_char(TNPK_ODDS_TIME, 'HH24:MI') as TNPK_ODDS_TIME,
	to_char(UMRN_ODDS_TIME, 'HH24:MI') as UMRN_ODDS_TIME
from
	RACE_ODDS
where
		KAISAI_CD = ?
	and	RACE_NO = ?
