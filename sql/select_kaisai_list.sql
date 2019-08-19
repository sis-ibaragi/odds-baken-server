select
	KAISAI_CD,
    KAISAI_NM,
    date_format(KAISAI_DT, '%Y-%m-%d') as KAISAI_DT
from
	KAISAI
where
	KAISAI_DT = ?
order by
	INSERT_DTTM
