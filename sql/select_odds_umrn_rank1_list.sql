select
	ur.UMA_NO_1 as UMA_NO,
    tn.SORT_NO
from
	race_odds_umrn ur
    inner join race_odds_tan tn
		on	ur.KAISAI_CD = tn.KAISAI_CD
        and	ur.RACE_NO = tn.RACE_NO
        and	ur.ODDS_TIME_NO = tn.ODDS_TIME_NO
        and	ur.UMA_NO_1 = tn.UMA_NO
where
		ur.KAISAI_CD = ?
	and ur.RACE_NO = ?
	and	ur.ODDS_TIME_NO = ?
	and	ur.NINKI_NO = 1
union all
select
	ur.UMA_NO_2 as UMA_NO,
    tn.SORT_NO
from
	race_odds_umrn ur
    inner join race_odds_tan tn
		on	ur.KAISAI_CD = tn.KAISAI_CD
        and	ur.RACE_NO = tn.RACE_NO
        and	ur.ODDS_TIME_NO = tn.ODDS_TIME_NO
        and	ur.UMA_NO_2 = tn.UMA_NO
where
		ur.KAISAI_CD = ?
	and ur.RACE_NO = ?
	and	ur.ODDS_TIME_NO = ?
	and	ur.NINKI_NO = 1
order by
	SORT_NO