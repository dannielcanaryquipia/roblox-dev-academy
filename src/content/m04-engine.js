export default {
  id: 'engine',
  title: 'How Roblox games work',
  color: 'blue',
  summary: 'Server vs client, RemoteEvents, never trusting the client, players and characters, touch events, and the services you will use most.',
  lessons: [
    {
      id: 'client-server',
      title: 'Server and client',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Every Roblox game runs in two places at once. The **server** is Roblox’s computer that hosts the match. Each **client** is a player’s phone, PC or console. Understanding this split is the most important idea in Roblox development.' },
        { type: 'table', head: ['Script type', 'Runs on', 'Typical location', 'Use it for'], rows: [
          ['Script', 'Server', 'ServerScriptService, Workspace', 'Game rules, currency, saving, spawning, damage'],
          ['LocalScript', 'One player’s device', 'StarterPlayerScripts, StarterGui, StarterCharacterScripts', 'UI, input, camera, local effects'],
          ['ModuleScript', 'Whoever requires it', 'ReplicatedStorage, ServerScriptService', 'Shared code and config'],
        ] },
        { type: 'h', text: 'Replication: who sees what' },
        { type: 'list', items: [
          'Changes the **server** makes (moving a part, changing a value) are copied to every client automatically.',
          'Changes a **client** makes stay on that client. If a LocalScript deletes a wall, only that player sees it gone.',
          'Exception: a player’s own character movement is controlled by their device, which is why speed hacks exist and why the server should check important things.',
        ] },
        { type: 'callout', tone: 'godot', text: 'Think of Roblox as Godot high-level multiplayer where the server is always the authority and every client is a peer you do not trust. Replication of the world is automatic, but you never write peer-to-peer logic.' },
        { type: 'quiz', id: 'quiz-cs', questions: [
          { q: 'A LocalScript sets a player’s Coins value to 9999. What happens?', options: ['Everyone sees 9999 and it saves', 'Only that player sees 9999; the server still has the real value', 'The game crashes', 'Roblox bans the player automatically'], answer: 1, why: 'Client changes do not replicate to the server. That is exactly why the server must own currency.' },
          { q: 'Where does a shop UI button script run?', options: ['Server', 'Client (LocalScript)', 'Both', 'Neither'], answer: 1, why: 'UI lives on the player’s screen, so it is a LocalScript. The purchase itself must then be requested from the server.' },
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'remotes',
      title: 'RemoteEvents and RemoteFunctions',
      minutes: 20,
      blocks: [
        { type: 'p', text: 'Clients and the server talk through objects in ReplicatedStorage. Create a Folder named **Remotes** inside ReplicatedStorage and put them there.' },
        { type: 'table', head: ['Object', 'Direction', 'Methods'], rows: [
          ['RemoteEvent', 'Client → server', 'Client: `:FireServer(...)` · Server: `.OnServerEvent:Connect(function(player, ...))`'],
          ['RemoteEvent', 'Server → client(s)', 'Server: `:FireClient(player, ...)` / `:FireAllClients(...)` · Client: `.OnClientEvent`'],
          ['RemoteFunction', 'Client asks, server answers', 'Client: `:InvokeServer(...)` · Server: `.OnServerInvoke = function(player, ...)`'],
        ] },
        { type: 'p', text: 'Example: a “Claim free coins” button that works once every 60 seconds. Create a RemoteEvent named **ClaimFreeCoins** in `ReplicatedStorage/Remotes`.' },
        { type: 'code', title: 'ServerScriptService/FreeCoins (Script)', code: `local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local remote = ReplicatedStorage.Remotes.ClaimFreeCoins
local COOLDOWN = 60
local REWARD = 25
local lastClaim = {} -- [player] = os.time() of last claim

remote.OnServerEvent:Connect(function(player)
	-- The first argument is ALWAYS the player who fired it.
	-- Roblox fills it in, so it cannot be faked.
	local now = os.time()
	if lastClaim[player] and now - lastClaim[player] < COOLDOWN then
		return -- too soon: ignore silently
	end
	lastClaim[player] = now

	local coins = player.leaderstats.Coins
	coins.Value += REWARD
end)

Players.PlayerRemoving:Connect(function(player)
	lastClaim[player] = nil -- avoid a memory leak
end)` },
        { type: 'code', title: 'StarterGui/FreeCoinsGui/ClaimButton/Click (LocalScript)', code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remote = ReplicatedStorage:WaitForChild("Remotes"):WaitForChild("ClaimFreeCoins")
local button = script.Parent

button.Activated:Connect(function()
	remote:FireServer() -- just a request; the server decides
end)` },
        { type: 'callout', tone: 'info', text: 'This uses a `leaderstats` folder you will create in the next lesson. Do that first, or the server line `player.leaderstats.Coins` will error.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'never-trust',
      title: 'Never trust the client',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'Exploiters can run their own code on their device. They can fire any RemoteEvent with any arguments, as many times as they want. If your server believes the client, your economy is ruined in a day.' },
        { type: 'table', head: ['Bad (trusts the client)', 'Good (server decides)'], rows: [
          ['`AddCoins:FireServer(500)`', '`CollectCoin:FireServer(coin)`, server checks the coin exists and the player is close to it'],
          ['`BuyItem:FireServer("Sword", 0)` with a price', '`BuyItem:FireServer("Sword")`, server looks up the price itself'],
          ['Client says “I finished stage 10”', 'Server checks the player touched stage 9 first'],
          ['Remote with no limit', 'Remote with a cooldown per player'],
        ] },
        { type: 'h', text: 'Checklist for every RemoteEvent' },
        { type: 'checklist', id: 'remote-safety', items: [
          'The client sends **requests**, never results (no amounts, prices or rewards)',
          'Check the type of every argument: `typeof(arg) == "string"` and so on',
          'Check the request makes sense (distance, ownership, enough coins, right stage)',
          'Rate-limit it with a cooldown per player',
          'Clean up per-player tables in PlayerRemoving',
        ] },
        { type: 'prompt', text: 'Audit every RemoteEvent and RemoteFunction in my place. For each one, show me the server handler and list ways an exploiter could abuse it (wrong types, huge numbers, spamming, fake targets). Suggest fixes but do not apply them until I approve.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'players-characters',
      title: 'Players, characters and leaderstats',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'A **Player** object is the person (account, name, UserId). Their **Character** is the Model in Workspace that walks around. It is destroyed and rebuilt every time they respawn. Inside the character is a **Humanoid** (health, walk speed, jump) and a **HumanoidRootPart** (its position).' },
        { type: 'p', text: 'A Folder named exactly `leaderstats` inside a Player shows its values on the in-game leaderboard. This is the easiest way to display coins or stages.' },
        { type: 'code', title: 'ServerScriptService/Leaderstats (Script)', code: `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"   -- must be exactly this name

	local coins = Instance.new("IntValue")
	coins.Name = "Coins"
	coins.Value = 0
	coins.Parent = leaderstats

	leaderstats.Parent = player        -- parent last: faster and safer

	player.CharacterAdded:Connect(function(character)
		local humanoid = character:WaitForChild("Humanoid")
		humanoid.WalkSpeed = 20        -- default is 16
	end)
end)` },
        { type: 'h', text: 'Getting the player from a touch' },
        { type: 'code', code: `local Players = game:GetService("Players")

local function getPlayerFromHit(hit: BasePart): Player?
	local character = hit:FindFirstAncestorOfClass("Model")
	return character and Players:GetPlayerFromCharacter(character)
end` },
        { type: 'notes' },
      ],
    },
    {
      id: 'touch-debounce',
      title: 'Touch events and debounce',
      minutes: 12,
      blocks: [
        { type: 'p', text: '`Touched` fires many times per second while a player stands on something, once for each body part. Without a **debounce** (a short lock), one step on a coin could give 20 coins.' },
        { type: 'code', title: 'A pad that gives 10 coins, once per 3 seconds per player', code: `local Players = game:GetService("Players")

local pad = script.Parent
local cooldowns = {} -- [player] = true while locked

pad.Touched:Connect(function(hit)
	local character = hit:FindFirstAncestorOfClass("Model")
	local player = character and Players:GetPlayerFromCharacter(character)
	if not player or cooldowns[player] then return end

	cooldowns[player] = true
	player.leaderstats.Coins.Value += 10

	task.delay(3, function()
		cooldowns[player] = nil
	end)
end)` },
        { type: 'callout', tone: 'tip', text: 'For a one-time pickup like a coin, the simplest debounce is to destroy the coin right away, or set an attribute such as `coin:SetAttribute("Taken", true)` and check it first.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'useful-services',
      title: 'Services you will use often',
      minutes: 15,
      blocks: [
        { type: 'h', text: 'CollectionService: one script for many parts' },
        { type: 'p', text: 'Tag 50 lava parts with `Lava`, then write one script that handles all of them, including ones added later.' },
        { type: 'code', code: `local CollectionService = game:GetService("CollectionService")

local function setupLava(part)
	part.Touched:Connect(function(hit)
		local humanoid = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
		if humanoid then humanoid.Health = 0 end
	end)
end

for _, part in CollectionService:GetTagged("Lava") do
	setupLava(part)
end
CollectionService:GetInstanceAddedSignal("Lava"):Connect(setupLava)` },
        { type: 'h', text: 'TweenService: smooth movement' },
        { type: 'code', code: `local TweenService = game:GetService("TweenService")

local door = workspace.Door
local info = TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
local openGoal = { CFrame = door.CFrame * CFrame.new(0, 8, 0) }

TweenService:Create(door, info, openGoal):Play()` },
        { type: 'h', text: 'RunService: every frame' },
        { type: 'code', code: `local RunService = game:GetService("RunService")
local spinner = workspace.Spinner

RunService.Heartbeat:Connect(function(dt)
	spinner.CFrame *= CFrame.Angles(0, math.rad(90) * dt, 0) -- 90 degrees per second
end)` },
        { type: 'h', text: 'Attributes: your own properties' },
        { type: 'code', code: `local coin = workspace.Coin
coin:SetAttribute("Value", 5)
print(coin:GetAttribute("Value")) --> 5

coin:GetAttributeChangedSignal("Value"):Connect(function()
	print("New value:", coin:GetAttribute("Value"))
end)` },
        { type: 'quiz', id: 'quiz-engine', questions: [
          { q: 'Why does a kill brick need a debounce less than a coin pad does?', options: ['Kill bricks do not fire Touched', 'Setting Health to 0 twice has the same result; giving coins twice does not', 'Debounce only works on coins', 'It does not; both need the same'], answer: 1, why: 'Killing is idempotent: doing it again changes nothing. Rewards stack, so they need a lock.' },
          { q: 'Which service lets one script handle every part with a label?', options: ['TweenService', 'CollectionService', 'RunService', 'Lighting'], answer: 1 },
          { q: 'What is the first argument of `OnServerEvent` handlers?', options: ['The first value the client sent', 'The player who fired it', 'The remote itself', 'The time'], answer: 1, why: 'Roblox inserts the firing player automatically. Clients cannot fake it.' },
        ] },
        { type: 'notes' },
      ],
    },
  ],
}
