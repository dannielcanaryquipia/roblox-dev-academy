export default {
  id: 'data',
  title: 'Saving player data',
  color: 'red',
  summary: 'DataStoreService done right: load, save, autosave, shutdown saves, and when to use a library.',
  lessons: [
    {
      id: 'datastore-basics',
      title: 'DataStore basics',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Players expect their coins and progress to be there tomorrow. Roblox gives you a free cloud database: **DataStoreService**. It works like a big dictionary: you save a value under a key, and load it later.' },
        { type: 'steps', items: [
          { title: 'Publish your place first.', text: 'DataStores only work in a published game (File → Publish to Roblox).' },
          { title: 'Allow Studio to use them.', text: 'Game Settings → Security → turn on **Enable Studio Access to API Services**. Now Play-tests in Studio save real data.' },
        ] },
        { type: 'code', code: `local DataStoreService = game:GetService("DataStoreService")
local store = DataStoreService:GetDataStore("PlayerData_v1")

-- Save
local ok, err = pcall(function()
	store:SetAsync("Player_12345", { Coins = 50, Stage = 3 })
end)

-- Load
local ok2, data = pcall(function()
	return store:GetAsync("Player_12345")
end)
if ok2 then print(data) end  -- nil if nothing was saved yet` },
        { type: 'table', head: ['Method', 'Use it when'], rows: [
          ['`GetAsync(key)`', 'Loading when a player joins'],
          ['`SetAsync(key, value)`', 'Simple overwrite. Fine for learning.'],
          ['`UpdateAsync(key, fn)`', 'Safer saving: you get the old value and return the new one. Prefer this in real games.'],
          ['`RemoveAsync(key)`', 'Deleting a player’s data (for example, a data-deletion request)'],
        ] },
        { type: 'callout', tone: 'warn', title: 'Rules that prevent data loss', items: [
          'Always use `pcall`. DataStore calls fail sometimes.',
          'Use the **UserId** in the key, never the username (names can change).',
          'Do not save on every coin pickup. There are request limits. Save on leave, on a timer, and at shutdown.',
          'If loading **fails**, do not let the player play with default data. When they leave, that empty data would overwrite their real save.',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'datastore-full',
      title: 'A complete save system',
      minutes: 25,
      blocks: [
        { type: 'p', text: 'This script handles everything for a small game: creates leaderstats, loads with retries, kicks safely if loading fails, autosaves every 2 minutes, saves when players leave, and saves everyone when the server shuts down. Use it in both projects.' },
        { type: 'code', title: 'ServerScriptService/PlayerData (Script)', code: `local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local store = DataStoreService:GetDataStore("PlayerData_v1")

-- Every value you want to save. Add new fields here later; old saves get the default.
local DEFAULTS = {
	Coins = 0,
	Stage = 1,
}

local loaded = {} -- [player] = true once their data loaded correctly

local function keyFor(player: Player): string
	return "Player_" .. player.UserId
end

local function retry(fn)
	for attempt = 1, 3 do
		local ok, result = pcall(fn)
		if ok then return true, result end
		warn("DataStore attempt " .. attempt .. " failed:", result)
		task.wait(attempt * 2)
	end
	return false
end

local function loadPlayer(player: Player)
	local ok, saved = retry(function()
		return store:GetAsync(keyFor(player))
	end)
	if not ok then
		player:Kick("Could not load your data. Please rejoin in a minute.")
		return
	end

	saved = saved or {}
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	for name, default in DEFAULTS do
		local value = Instance.new("IntValue")
		value.Name = name
		value.Value = if saved[name] ~= nil then saved[name] else default
		value.Parent = leaderstats
	end
	leaderstats.Parent = player
	loaded[player] = true
end

local function savePlayer(player: Player)
	if not loaded[player] then return end -- never save data that did not load
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then return end

	local data = {}
	for name in DEFAULTS do
		data[name] = leaderstats[name].Value
	end

	retry(function()
		store:UpdateAsync(keyFor(player), function(_old)
			return data
		end)
	end)
end

Players.PlayerAdded:Connect(loadPlayer)
for _, player in Players:GetPlayers() do -- players who joined before this script ran
	task.spawn(loadPlayer, player)
end

Players.PlayerRemoving:Connect(function(player)
	savePlayer(player)
	loaded[player] = nil
end)

-- Autosave every 2 minutes
task.spawn(function()
	while true do
		task.wait(120)
		for _, player in Players:GetPlayers() do
			task.spawn(savePlayer, player)
		end
	end
end)

-- When the server shuts down, save everyone before it closes
game:BindToClose(function()
	local pending = 0
	for _, player in Players:GetPlayers() do
		pending += 1
		task.spawn(function()
			savePlayer(player)
			pending -= 1
		end)
	end
	while pending > 0 do
		task.wait()
	end
end)` },
        { type: 'h', text: 'Test it' },
        { type: 'steps', items: [
          { title: 'Press Play and change your Coins.', text: 'In the Explorer during play, switch to Server view (the Client/Server toggle), select Players → you → leaderstats → Coins, and change the Value.' },
          { title: 'Stop, then Play again.', text: 'Your coins should still be there.' },
          { title: 'Watch Output for warnings.', text: 'Any “DataStore attempt failed” line means something is wrong, usually API access is off.' },
        ] },
        { type: 'callout', tone: 'info', title: 'When your game grows', text: 'For bigger games, the community library **ProfileStore** adds session locking (prevents two servers saving the same player at once, a source of item duplication). Ask Claude Code to migrate to it when you have real players and items worth duplicating.' },
        { type: 'prompt', text: 'Read the PlayerData script in ServerScriptService. Explain in simple words what happens when (1) a player joins, (2) loading fails, (3) the player leaves, (4) the server shuts down. Then point out one weakness of this approach compared with session locking.' },
        { type: 'quiz', id: 'quiz-data', questions: [
          { q: 'Why does the script refuse to save if loading failed?', options: ['To save request limits', 'So empty default data never overwrites a real save', 'Because Roblox forbids it', 'It is just style'], answer: 1 },
          { q: 'What should a DataStore key be based on?', options: ['player.Name', 'player.DisplayName', 'player.UserId', 'A random number'], answer: 2, why: 'UserId never changes. Names and display names can.' },
          { q: 'What does BindToClose do here?', options: ['Kicks everyone', 'Gives the script time to save all players before the server closes', 'Closes the DataStore', 'Disables autosave'], answer: 1 },
        ] },
        { type: 'notes' },
      ],
    },
  ],
}
