select
	tn.NINKI_NO,
	tn.UMA_NO,
	tn.TAN_ODDS
from
	RACE_ODDS_TAN tn
where
		tn.KAISAI_CD = ?
	and tn.RACE_NO = ?
	and tn.ODDS_TIME_NO = ?
order by
	NINKI_NO,
	UMA_NO
