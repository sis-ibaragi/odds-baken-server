select
	v1.KAISAI_CD,
	v1.KAISAI_NM,
	v1.RACE_NO,
	v1.UMA_NUM,
	to_char(v1.TNPK_ODDS_TIME, 'HH24:MI') as TNPK_ODDS_TIME,
	to_char(v1.UMRN_ODDS_TIME, 'HH24:MI') as UMRN_ODDS_TIME,
	v1.TAN_ODDS,
	v1.UMRN_ODDS,
	v1.FUKU_ODDS_MAX,
	case
		when v1.TAN_ODDS <= 30 then 1 else 0
	end as TAN_FLG,
	case
		when v1.UMRN_ODDS >= 9 then 1 else 0
	end as UMRN_FLG,
	case
		when v1.FUKU_ODDS_MAX <= 6 then 1 else 0
	end as FUKU_FLG
from (
		select
			ka.KAISAI_CD,
			ka.KAISAI_NM,
			rc.RACE_NO,
			max(ul.UMA_NO) over (
				partition by
					ul.KAISAI_CD,
					ul.RACE_NO
			)	as UMA_NUM,
			ro.TNPK_ODDS_TIME,
			ro.UMRN_ODDS_TIME,
			tn.TAN_ODDS,
			ur.UMRN_ODDS,
			fk.FUKU_ODDS_MAX,
			row_number() over (
				partition by
					ul.KAISAI_CD,
					ul.RACE_NO
				order by
					ul.UMA_NO
			)	as UMA_RNUM
		from
			KAISAI ka
			inner join RACE rc
				on	ka.KAISAI_CD = rc.KAISAI_CD
			inner join RACE_UMA_LIST ul
				on	rc.KAISAI_CD = ul.KAISAI_CD
				and	rc.RACE_NO = ul.RACE_NO
			inner join RACE_ODDS ro
				on	rc.KAISAI_CD = ro.KAISAI_CD
				and	rc.RACE_NO = ro.RACE_NO
				and	ro.ODDS_TIME_NO = ?
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
				ka.KAISAI_DT = ?
	)	v1
where
	v1.UMA_RNUM = 1
order by
	v1.KAISAI_CD,
	v1.RACE_NO
