select
	ODDS_TIME_NO,
	date_format(TNPK_ODDS_TIME, '%H:%i') as TNPK_ODDS_TIME,
	date_format(UMRN_ODDS_TIME, '%H:%i') as UMRN_ODDS_TIME
from
	RACE_ODDS
where
		KAISAI_CD = ?
	and	RACE_NO = ?
