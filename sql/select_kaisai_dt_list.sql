select
	date_format(KAISAI_DT, '%Y-%m-%d') as KAISAI_DT
from
	KAISAI
group by
	KAISAI_DT
order by
	KAISAI_DT desc
