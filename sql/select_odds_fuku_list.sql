select
	fk.UMA_NO,
	fk.FUKU_ODDS_MAX
from
	RACE_ODDS_FUKU fk
where
		fk.KAISAI_CD = ?
	and fk.RACE_NO = ?
	and fk.ODDS_TIME_NO = ?
order by
	FUKU_ODDS_MAX,
	FUKU_ODDS_MIN,
	UMA_NO
