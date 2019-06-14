insert into RACE_UMA_MARK (
	KAISAI_CD,
	RACE_NO,
	UMA_NO,
	MARK_CD
) values (
	?,
	?,
	?,
	?
)
on duplicate key update
	MARK_CD = ?
