export default {
  id: 'sim',
  title: 'Project 2: Coin simulator',
  color: 'yellow',
  summary: 'A collect → upgrade loop with server-checked purchases, a 2x Coins game pass, and ideas for rebirths and pets.',
  lessons: [
    {
      id: 'sim-setup',
      title: 'Setup and coin spawner',
      minutes: 30,
      blocks: [
        { type: 'p', text: 'Simulators are among the most popular Roblox genres because the loop is simple and the progress is visible. Your version 1: coins spawn in an area, players collect them, spend coins on a multiplier upgrade, and can buy a 2x Coins pass.' },
        { type: 'h', text: 'Objects to create in Studio' },
        { type: 'table', head: ['Where', 'Object', 'Settings'], rows: [
          ['Workspace', 'Part `CoinArea`', 'Big and flat (e.g. 120 × 1 × 120), Anchored, Transparency 1, CanCollide off'],
          ['ServerStorage', 'Part `Coin`', 'Shape Cylinder, Size 0.4 × 2 × 2, yellow, Neon, Anchored, CanCollide off'],
          ['ReplicatedStorage/Shared', 'ModuleScript `GameConfig`', 'From the ModuleScripts lesson (upgrade prices)'],
          ['ReplicatedStorage/Remotes', 'RemoteFunction `BuyUpgrade`', ''],
          ['ServerScriptService', 'Script `PlayerData`', 'From the Saving module, with DEFAULTS changed to `Coins = 0, Level = 0`'],
        ] },
        { type: 'code', title: 'ServerScriptService/CoinSpawner (Script)', code: `local Players = game:GetService("Players")
local ServerStorage = game:GetService("ServerStorage")

local template = ServerStorage:WaitForChild("Coin")
local area = workspace:WaitForChild("CoinArea")

local MAX_COINS = 40
local SPAWN_EVERY = 0.5 -- seconds

local folder = Instance.new("Folder")
folder.Name = "Coins"
folder.Parent = workspace

local function randomPoint(): Vector3
	local size = area.Size
	local offset = Vector3.new(
		(math.random() - 0.5) * size.X,
		size.Y / 2 + 1.5,
		(math.random() - 0.5) * size.Z
	)
	return area.CFrame:PointToWorldSpace(offset)
end

local function getMultiplier(player: Player): number
	local level = player.leaderstats.Level.Value
	local pass = if player:GetAttribute("Has2x") then 2 else 1
	return (1 + level) * pass
end

local function spawnCoin()
	local coin = template:Clone()
	coin.Position = randomPoint()
	coin.Parent = folder

	coin.Touched:Connect(function(hit)
		if coin:GetAttribute("Taken") then return end -- debounce
		local character = hit:FindFirstAncestorOfClass("Model")
		local player = character and Players:GetPlayerFromCharacter(character)
		if not player or not player:FindFirstChild("leaderstats") then return end

		coin:SetAttribute("Taken", true)
		player.leaderstats.Coins.Value += getMultiplier(player)
		coin:Destroy()
	end)
end

while true do
	if #folder:GetChildren() < MAX_COINS then
		spawnCoin()
	end
	task.wait(SPAWN_EVERY)
end` },
        { type: 'callout', tone: 'tip', text: 'The `while true` loop is at the bottom on purpose: code below an infinite loop never runs.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'sim-upgrades',
      title: 'Upgrades with a RemoteFunction',
      minutes: 25,
      blocks: [
        { type: 'p', text: 'The client asks “please upgrade me”. The server checks the price **from its own config**, checks the player can afford it, and replies with a result. The client never sends a price.' },
        { type: 'code', title: 'ServerScriptService/Upgrades (Script)', code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local GameConfig = require(ReplicatedStorage.Shared.GameConfig)
local buyUpgrade = ReplicatedStorage.Remotes.BuyUpgrade

local busy = {} -- simple rate limit

buyUpgrade.OnServerInvoke = function(player: Player)
	if busy[player] then
		return false, "Slow down"
	end
	busy[player] = true
	task.delay(0.3, function() busy[player] = nil end)

	local stats = player:FindFirstChild("leaderstats")
	if not stats then
		return false, "Still loading"
	end

	local price = GameConfig.getUpgradePrice(stats.Level.Value)
	if not price then
		return false, "Max level"
	end
	if stats.Coins.Value < price then
		return false, "Need " .. price .. " coins"
	end

	stats.Coins.Value -= price
	stats.Level.Value += 1
	return true, "Level " .. stats.Level.Value .. "!"
end

Players.PlayerRemoving:Connect(function(player)
	busy[player] = nil
end)` },
        { type: 'code', title: 'StarterGui/HUD/UpgradeButton/Buy (LocalScript)', code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local GameConfig = require(ReplicatedStorage:WaitForChild("Shared"):WaitForChild("GameConfig"))
local buyUpgrade = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("BuyUpgrade")

local player = Players.LocalPlayer
local button = script.Parent
local level = player:WaitForChild("leaderstats"):WaitForChild("Level")

local function refresh()
	local price = GameConfig.getUpgradePrice(level.Value)
	button.Text = if price then "Upgrade: " .. price .. " coins" else "Max level"
end
level.Changed:Connect(refresh)
refresh()

button.Activated:Connect(function()
	local ok, message = buyUpgrade:InvokeServer()
	button.Text = message
	task.wait(1)
	refresh()
end)` },
        { type: 'quiz', id: 'quiz-sim', questions: [
          { q: 'Why does the client not send the price to the server?', options: ['It would be slower', 'An exploiter could send price 0', 'RemoteFunctions cannot send numbers', 'The price is secret'], answer: 1 },
          { q: 'What does the `busy` table protect against?', options: ['Spamming the remote many times per second', 'Data loss', 'Lag', 'Wrong prices'], answer: 0 },
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'sim-pass',
      title: '2x Coins game pass',
      minutes: 20,
      blocks: [
        { type: 'p', text: 'Create a pass in Creator Hub (Monetization → Passes), set a price, and copy its ID. Passes are bought once and owned forever.' },
        { type: 'code', title: 'ServerScriptService/GamePasses (Script)', code: `local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local PASS_2X = 0 -- paste your pass ID

local function checkOwnership(player: Player)
	local ok, owns = pcall(function()
		return MarketplaceService:UserOwnsGamePassAsync(player.UserId, PASS_2X)
	end)
	if ok and owns then
		player:SetAttribute("Has2x", true)
	end
end

Players.PlayerAdded:Connect(checkOwnership)
for _, player in Players:GetPlayers() do
	task.spawn(checkOwnership, player)
end

-- Give the perk right away when bought in-game (no rejoin needed)
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, purchased)
	if purchased and passId == PASS_2X then
		player:SetAttribute("Has2x", true)
	end
end)` },
        { type: 'code', title: 'StarterGui/HUD/Buy2x/Prompt (LocalScript)', code: `local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local PASS_2X = 0 -- same pass ID
local button = script.Parent

button.Activated:Connect(function()
	MarketplaceService:PromptGamePassPurchase(Players.LocalPlayer, PASS_2X)
end)` },
        { type: 'callout', tone: 'info', text: 'For passes, `PromptGamePassPurchaseFinished` is fine to use, because ownership is permanent and is checked again on every join. Developer products are different and always need `ProcessReceipt`.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'sim-next',
      title: 'Version 2 ideas',
      minutes: 10,
      blocks: [
        { type: 'p', text: 'Ship version 1 first. Then pick **one** of these per update, based on what your analytics say.' },
        { type: 'table', head: ['Feature', 'Why players like it', 'Watch out'], rows: [
          ['Rebirth', 'Reset coins for a permanent bonus: long-term goal', 'Balance so the first rebirth takes about 20–30 minutes'],
          ['Second world', 'New place to unlock: a “wow” moment', 'Lock it behind a coin price, not only Robux'],
          ['Pets (earned)', 'Collecting is fun; pets follow you', 'If pets come from **paid** random eggs, you must show the odds'],
          ['Daily reward', 'Reason to come back tomorrow (Day-1 retention)', 'Save the last-claim time on the server'],
          ['Leaderboard', 'Competition with friends', 'Use OrderedDataStore; update every few minutes, not every second'],
        ] },
        { type: 'prompt', text: 'Add a Rebirth system: when a player has at least 5,000 coins and is Level 5+, they can rebirth. Rebirth resets Coins and Level to 0 and adds 1 to a saved "Rebirths" value; each rebirth adds +50% to the coin multiplier. Add a confirm dialog on the client, do all checks on the server, and update the PlayerData DEFAULTS. Plan first, then build in steps.' },
        { type: 'notes' },
      ],
    },
  ],
}
