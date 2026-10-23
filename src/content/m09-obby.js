export default {
  id: 'obby',
  title: 'Project 1: Themed obby',
  color: 'red',
  summary: 'Your first published game: stages, lava, saved checkpoints, a stage counter and a Skip Stage product.',
  lessons: [
    {
      id: 'obby-plan',
      title: 'Plan and build the course',
      minutes: 30,
      blocks: [
        { type: 'p', text: 'An obby is the perfect first game: simple code, every Roblox concept appears once, and players already know how to play it. Give it a **theme** so it stands out, for example “Escape the Typhoon”, “Jeepney Rooftops”, or “Halo-Halo Factory”.' },
        { type: 'h', text: 'Version 1 scope' },
        { type: 'checklist', id: 'obby-scope', items: [
          '20–30 stages, each a little harder than the last',
          'Lava parts that kill (tag: `Lava`)',
          'Checkpoint pads named `1`, `2`, `3`… in a Folder `Workspace/Checkpoints`',
          'Stage number saves between sessions',
          'Stage counter on the leaderboard',
          'A finish area with a celebration',
          'One developer product: Skip Stage',
        ] },
        { type: 'h', text: 'Build the world' },
        { type: 'steps', items: [
          { title: 'Make a Folder named `Checkpoints` in Workspace.', text: 'Put a flat, colored, anchored part named `1` at the spawn. This is stage 1.' },
          { title: 'Build stage 1 → 2 and place pad `2` at the end.', text: 'Repeat. Keep the pads in order: the number is the stage.' },
          { title: 'Tag every deadly part with `Lava`.', text: 'Use the Tags section in Properties, or ask Claude to tag every part named "Lava".' },
          { title: 'Anchor everything.', text: 'Ask Claude to check and report unanchored parts.' },
        ] },
        { type: 'prompt', text: 'Using the Studio MCP tools, generate 5 obby stages after the existing checkpoint "1" in Workspace/Checkpoints, themed as <your theme>. Each stage: 4–8 anchored jump platforms with gaps a default character can clear, at least one part named "Lava" (red, Neon, tagged Lava), and a checkpoint pad named with the next number at the end. Keep difficulty rising slowly. Take a screen_capture when done.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'obby-scripts',
      title: 'Scripts: data, lava, checkpoints',
      minutes: 30,
      blocks: [
        { type: 'p', text: 'You need three server scripts. The first is the **PlayerData** script from the Saving module, unchanged: it already saves `Coins` and `Stage`. Add these two:' },
        { type: 'code', title: 'ServerScriptService/Lava (Script)', code: `local CollectionService = game:GetService("CollectionService")

local function killOnTouch(part: BasePart)
	part.Touched:Connect(function(hit)
		local character = hit:FindFirstAncestorOfClass("Model")
		local humanoid = character and character:FindFirstChildOfClass("Humanoid")
		if humanoid and humanoid.Health > 0 then
			humanoid.Health = 0
		end
	end)
end

for _, part in CollectionService:GetTagged("Lava") do
	if part:IsA("BasePart") then killOnTouch(part) end
end
CollectionService:GetInstanceAddedSignal("Lava"):Connect(function(part)
	if part:IsA("BasePart") then killOnTouch(part) end
end)` },
        { type: 'code', title: 'ServerScriptService/Checkpoints (Script)', code: `local Players = game:GetService("Players")

local checkpoints = workspace:WaitForChild("Checkpoints")

-- Touch pad N+1 to reach stage N+1. You cannot skip ahead by touching pad 10.
for _, pad in checkpoints:GetChildren() do
	local number = tonumber(pad.Name)
	if pad:IsA("BasePart") and number then
		pad.Touched:Connect(function(hit)
			local character = hit:FindFirstAncestorOfClass("Model")
			local player = character and Players:GetPlayerFromCharacter(character)
			local leaderstats = player and player:FindFirstChild("leaderstats")
			if not leaderstats then return end

			local stage = leaderstats.Stage
			if number == stage.Value + 1 then
				stage.Value = number
			end
		end)
	end
end

-- Respawn players at their saved stage
local function onCharacterAdded(player: Player, character: Model)
	local leaderstats = player:WaitForChild("leaderstats")
	local pad = checkpoints:FindFirstChild(tostring(leaderstats.Stage.Value))
	if not pad then return end

	character:WaitForChild("HumanoidRootPart")
	task.wait() -- let Roblox finish placing the character first
	character:PivotTo(pad.CFrame + Vector3.new(0, 4, 0))
end

local function onPlayerAdded(player: Player)
	player.CharacterAdded:Connect(function(character)
		onCharacterAdded(player, character)
	end)
	if player.Character then
		task.spawn(onCharacterAdded, player, player.Character)
	end
end

Players.PlayerAdded:Connect(onPlayerAdded)
for _, player in Players:GetPlayers() do
	task.spawn(onPlayerAdded, player)
end` },
        { type: 'callout', tone: 'info', text: 'Why `Stage.Value + 1` only? Without it, a player could fall onto a later pad by accident, or an exploiter could teleport to the last pad. Requiring the next pad keeps progress honest.' },
        { type: 'h', text: 'Test checklist' },
        { type: 'checklist', id: 'obby-test', items: [
          'Touching lava kills me',
          'Touching the next pad increases Stage on the leaderboard',
          'Touching a pad far ahead does nothing',
          'After dying I respawn on my latest pad',
          'After Stop + Play, I start at my saved stage',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'obby-skip',
      title: 'Skip Stage product and finish',
      minutes: 25,
      blocks: [
        { type: 'p', text: 'A Skip Stage developer product is the classic fair obby purchase: stuck players pay a few Robux to move on. You need to publish the game first to create products.' },
        { type: 'steps', items: [
          { title: 'Publish the place.', text: 'File → Publish to Roblox. Keep it private for now.' },
          { title: 'Create the product.', text: 'Creator Hub → Creations → your game → Monetization → Developer Products → Create. Name “Skip Stage”, price around 15–25 Robux, add an icon.' },
          { title: 'Copy its ID.', text: 'Hover the product → ⋯ → Copy Asset ID.' },
        ] },
        { type: 'code', title: 'ServerScriptService/Purchases (Script)', code: `local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local SKIP_STAGE_ID = 0 -- paste your developer product ID here

local checkpoints = workspace:WaitForChild("Checkpoints")
local handlers = {}

handlers[SKIP_STAGE_ID] = function(_receipt, player: Player)
	local stage = player.leaderstats.Stage
	local nextPad = checkpoints:FindFirstChild(tostring(stage.Value + 1))
	if not nextPad then
		return false -- already at the end; the client hides the button there
	end
	stage.Value += 1
	player:LoadCharacter() -- respawn at the new stage
	return true
end

-- Only ONE script in the whole game may set ProcessReceipt.
-- Put every product handler in this table.
MarketplaceService.ProcessReceipt = function(receiptInfo)
	local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
	if player then
		local handler = handlers[receiptInfo.ProductId]
		local ok, granted = pcall(handler, receiptInfo, player)
		if ok and granted then
			return Enum.ProductPurchaseDecision.PurchaseGranted
		end
		warn("Purchase not granted:", receiptInfo.ProductId, granted)
	end
	-- Roblox will try again next time the player joins
	return Enum.ProductPurchaseDecision.NotProcessedYet
end` },
        { type: 'code', title: 'StarterGui/HUD/SkipButton/Prompt (LocalScript)', code: `local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local SKIP_STAGE_ID = 0 -- same ID as the server script
local player = Players.LocalPlayer
local button = script.Parent
local checkpoints = workspace:WaitForChild("Checkpoints")
local stage = player:WaitForChild("leaderstats"):WaitForChild("Stage")

local function refresh()
	-- Hide the button on the last stage so nobody pays for nothing
	button.Visible = checkpoints:FindFirstChild(tostring(stage.Value + 1)) ~= nil
end
stage.Changed:Connect(refresh)
refresh()

button.Activated:Connect(function()
	MarketplaceService:PromptProductPurchase(player, SKIP_STAGE_ID)
end)` },
        { type: 'callout', tone: 'warn', text: 'Never grant products in `PromptProductPurchaseFinished`. That event firing does not prove the player paid. Only `ProcessReceipt` is reliable.' },
        { type: 'h', text: 'The finish' },
        { type: 'prompt', text: 'Add a finish area after the last checkpoint. When a player reaches the final pad for the first time, play a confetti particle effect and a sound on their client, show a "You beat the obby!" message for 4 seconds, and give them 100 Coins on the server. Use a RemoteEvent for the client effects. Make sure the 100 coins can only be given once per player (save a "Finished" flag in PlayerData).' },
        { type: 'h', text: 'Publish checklist' },
        { type: 'checklist', id: 'obby-ship', items: [
          'Skip Stage tested with a real purchase from a friend or a test in Studio',
          'Name, description, icon and 3 thumbnails ready (see Publishing module)',
          'Maturity questionnaire completed',
          '3 friends played it on their phones',
          'Set to Public',
        ] },
        { type: 'notes' },
      ],
    },
  ],
}
