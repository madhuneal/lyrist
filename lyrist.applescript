-- Lyrist
-- (c) 2013 Sahil Bajaj. Released under the MIT License.
--
-- lyrist.applescript

on appIsRunning(appName)
	tell application "System Events" to (name of processes) contains appName
end appIsRunning

if not appIsRunning("iTunes") then
	return "NOT_RUNNING"
end if

tell application "iTunes"
	if player state is not stopped then
		return "@artist=" & (get artist of current track) & "@song=" & (get name of current track)
	else
		return "STOPPED"
	end if
end tell