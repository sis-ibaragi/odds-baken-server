select
	rank() over (
		order by fk.FUKU_ODDS_MAX
    )	as NINKI_NO,
	fk.UMA_NO,
	fk.FUKU_ODDS_MAX,
	ifnull(ur.NINKI_NO, 0) + 1 as UMRN_NINKI_NO
from
	RACE_ODDS o
	inner join RACE_ODDS_FUKU fk
		on	o.KAISAI_CD = fk.KAISAI_CD
		and	o.RACE_NO = fk.RACE_NO
		and o.ODDS_TIME_NO = fk.ODDS_TIME_NO
	left outer join (
		select
			u.KAISAI_CD,
			u.RACE_NO,
			u.ODDS_TIME_NO,
			u.UMA_NO,
			rank() over (
				order by 
					u.NINKI_NO
			) as NINKI_NO
		from (
			select
				KAISAI_CD,
				RACE_NO,
				ODDS_TIME_NO,
				UMA_NO_1 as UMA_NO,
				NINKI_NO
			from
				RACE_ODDS_UMRN
			where
					KAISAI_CD = ?
				and RACE_NO = ?
				and ODDS_TIME_NO = ?
				and UMA_NO_2 = ?
			union all
			select
				KAISAI_CD,
				RACE_NO,
				ODDS_TIME_NO,
				UMA_NO_2 as UMA_NO,
				NINKI_NO
			from
				RACE_ODDS_UMRN
			where
					KAISAI_CD = ?
				and RACE_NO = ?
				and ODDS_TIME_NO = ?
				and UMA_NO_1 = ?
			) u
	)	ur
		on	o.KAISAI_CD = ur.KAISAI_CD
		and	o.RACE_NO = ur.RACE_NO
		and o.ODDS_TIME_NO = ur.ODDS_TIME_NO
		and	fk.UMA_NO = ur.UMA_NO
where
		o.KAISAI_CD = ?
	and o.RACE_NO = ?
	and o.ODDS_TIME_NO = ?
order by
	NINKI_NO,
	UMA_NO
