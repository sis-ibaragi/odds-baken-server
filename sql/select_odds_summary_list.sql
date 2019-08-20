select
	ka.KAISAI_CD,
	ka.KAISAI_NM,
	rc.RACE_NO,
	ul.CNT	as UMA_NUM,
	date_format(ro.TNPK_ODDS_TIME, '%H:%i') as TNPK_ODDS_TIME,
	date_format(ro.UMRN_ODDS_TIME, '%H:%i') as UMRN_ODDS_TIME,
	tn.TAN_ODDS,
	ur.UMRN_ODDS,
	fk.FUKU_ODDS_MAX,
	case
		when tn.TAN_ODDS <= 30 then 1 else 0
	end as TAN_FLG,
	case
		when ur.UMRN_ODDS >= 9 then 1 else 0
	end as UMRN_FLG,
	case
		when fk.FUKU_ODDS_MAX <= 6 then 1 else 0
	end as FUKU_FLG
from
	KAISAI ka
	inner join RACE rc
		on	ka.KAISAI_CD = rc.KAISAI_CD
	inner join RACE_ODDS ro
		on	rc.KAISAI_CD = ro.KAISAI_CD
		and	rc.RACE_NO = ro.RACE_NO
		and	ro.ODDS_TIME_NO = ?
	inner join (
			select
				KAISAI_CD,
				RACE_NO,
				count(*) as CNT
			from
				RACE_UMA_LIST
			group by
				KAISAI_CD,
				RACE_NO
			)	ul
		on	rc.KAISAI_CD = ul.KAISAI_CD
		and	rc.RACE_NO = ul.RACE_NO
	left outer join RACE_ODDS_TAN tn
		on	ro.KAISAI_CD = tn.KAISAI_CD
		and	ro.RACE_NO = tn.RACE_NO
		and	ro.ODDS_TIME_NO = tn.ODDS_TIME_NO
		and	tn.SORT_NO = 10
	left outer join RACE_ODDS_UMRN ur
		on	ro.KAISAI_CD = ur.KAISAI_CD
		and	ro.RACE_NO = ur.RACE_NO
		and	ro.ODDS_TIME_NO = ur.ODDS_TIME_NO
		and	ur.SORT_NO = 1
	left outer join RACE_ODDS_FUKU fk
		on	ro.KAISAI_CD = fk.KAISAI_CD
		and	ro.RACE_NO = fk.RACE_NO
		and	ro.ODDS_TIME_NO = fk.ODDS_TIME_NO
		and fk.SORT_NO = 8
where
	ka.KAISAI_CD = ?
order by
	KAISAI_CD,
	RACE_NO
