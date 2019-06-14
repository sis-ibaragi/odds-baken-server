select
	rank() over (
		order by 
			v1.NINKI_NO
    ) as NINKI_NO,
	v1.UMA_NO,
	v1.UMRN_ODDS,
	mk.MARK_CD
from (
	select
		ur.KAISAI_CD,
		ur.RACE_NO,
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
		ur.KAISAI_CD,
		ur.RACE_NO,
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
		? as KAISAI_CD,
		? as RACE_NO,
		? as UMA_NO,
		NULL as NINKI_NO,
        0 as SORT_NO,
		NULL as UMRN_ODDS
	from
		DUAL
	) v1
	left outer join RACE_UMA_MARK mk
		on	v1.KAISAI_CD = mk.KAISAI_CD
		and	v1.RACE_NO = mk.RACE_NO
		and	v1.UMA_NO = mk.UMA_NO
order by
	v1.SORT_NO
