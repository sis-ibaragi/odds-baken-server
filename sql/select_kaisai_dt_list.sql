select
	to_char(KAISAI_DT, 'YYYY-MM-DD') as KAISAI_DT
from
	KAISAI
group by
	KAISAI_DT
order by
	KAISAI_DT desc
