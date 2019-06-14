select
	rank() over (
		order by 
			v1.NINKI_NO
    ) as NINKI_NO,
	v1.UMA_NO,
	v1.UMRN_ODDS
from (
	select
		ur.UMA_NO_1 as UMA_NO,
        ur.NINKI_NO,
        ur.SORT_NO,
		ur.UMRN_ODDS
	from
		RACE_ODDS_UMRN ur
	where
			ur.KAISAI_CD = ?
		and ur.RACE_NO = ?
		and	ur.ODDS_TIME_NO = ?
		and	ur.UMA_NO_2 = ?
	union all
	select
		ur.UMA_NO_2 as UMA_NO,
        ur.NINKI_NO,
        ur.SORT_NO,
		ur.UMRN_ODDS
	from
		RACE_ODDS_UMRN ur
	where
			ur.KAISAI_CD = ?
		and ur.RACE_NO = ?
		and	ur.ODDS_TIME_NO = ?
		and	ur.UMA_NO_1 = ?
	union all
	select
		? as UMA_NO,
		NULL as NINKI_NO,
        0 as SORT_NO,
		NULL as UMRN_ODDS
	from
		DUAL
	) v1
order by
	v1.SORT_NO
