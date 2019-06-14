select
	um.UMA_NO,
	tn1.TAN_ODDS		as TAN_ODDS_1,
	tn2.TAN_ODDS		as TAN_ODDS_2,
	fk1.FUKU_ODDS_MAX	as FUKU_ODDS_MAX_1,
	fk2.FUKU_ODDS_MAX	as FUKU_ODDS_MAX_2
from
	RACE	rc
	inner join RACE_UMA_LIST	um
		on	rc.KAISAI_CD = um.KAISAI_CD
		and	rc.	RACE_NO = um.RACE_NO
	inner join RACE_ODDS	od1
		on	rc.KAISAI_CD = od1.KAISAI_CD
		and	rc.	RACE_NO = od1.RACE_NO
	inner join RACE_ODDS	od2
		on	rc.KAISAI_CD = od2.KAISAI_CD
		and	rc.	RACE_NO = od2.RACE_NO
	inner join RACE_ODDS_TAN tn1
		on	od1.KAISAI_CD = tn1.KAISAI_CD
		and	od1.RACE_NO = tn1.RACE_NO
		and	od1.ODDS_TIME_NO = tn1.ODDS_TIME_NO
		and	um.UMA_NO = tn1.UMA_NO
	inner join RACE_ODDS_TAN tn2
		on	od2.KAISAI_CD = tn2.KAISAI_CD
		and	od2.RACE_NO = tn2.RACE_NO
		and	od2.ODDS_TIME_NO = tn2.ODDS_TIME_NO
		and	um.UMA_NO = tn2.UMA_NO
	inner join RACE_ODDS_FUKU fk1
		on	od1.KAISAI_CD = fk1.KAISAI_CD
		and	od1.RACE_NO = fk1.RACE_NO
		and	od1.ODDS_TIME_NO = fk1.ODDS_TIME_NO
		and	um.UMA_NO = fk1.UMA_NO
	inner join RACE_ODDS_FUKU fk2
		on	od2.KAISAI_CD = fk2.KAISAI_CD
		and	od2.RACE_NO = fk2.RACE_NO
		and	od2.ODDS_TIME_NO = fk2.ODDS_TIME_NO
		and	um.UMA_NO = fk2.UMA_NO
where
		rc.KAISAI_CD = ?
	and	rc.RACE_NO = ?
	and	od1.ODDS_TIME_NO = ?
	and	od2.ODDS_TIME_NO = ?
order by
	UMA_NO
