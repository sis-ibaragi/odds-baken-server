select
	UMA_NO,
	WAKU_NO,
	UMA_NM,
	JOCKEY_NM
from
	RACE_UMA_LIST
where
		KAISAI_CD = ?
	and	RACE_NO = ?
order by
	UMA_NO
