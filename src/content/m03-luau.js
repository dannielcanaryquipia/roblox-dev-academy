export default {
  id: 'luau',
  title: 'Luau, the language',
  color: 'green',
  summary: 'Everything you need to read and write Roblox scripts: values, logic, loops, functions, tables, modules, events and errors.',
  lessons: [
    {
      id: 'from-godot',
      title: 'Coming from GDScript',
      minutes: 8,
      blocks: [
        { type: 'p', text: 'Luau is Roblox’s version of Lua, with types and a few extras. If you know GDScript or JavaScript, you will read it within a day. This table maps what you already know.' },
        { type: 'table', head: ['Godot / GDScript', 'Roblox / Luau'], rows: [
          ['`var x = 1`', '`local x = 1`'],
          ['`func f(a):`', '`local function f(a) ... end`'],
          ['`null`', '`nil`'],
          ['`!=`', '`~=`'],
          ['`&&  ||  !`', '`and  or  not`'],
          ['Arrays start at **0**', 'Tables start at **1**'],
          ['`"a" + "b"`', '`"a" .. "b"`'],
          ['`_ready()`', 'The script body runs top to bottom when the script loads'],
          ['`_process(delta)`', '`RunService.Heartbeat:Connect(function(dt) ... end)`'],
          ['Signals + `connect`', 'Events + `:Connect(function ... end)`'],
          ['`get_node("A/B")`', '`script.Parent.A.B` or `:WaitForChild("B")`'],
          ['Autoload singleton', 'ModuleScript + `require()`'],
          ['Groups', 'CollectionService tags'],
          ['`@export var`', 'Attributes'],
          ['`@rpc` functions', 'RemoteEvents / RemoteFunctions'],
          ['Saving to `user://`', 'DataStoreService (cloud)'],
          ['Tween', 'TweenService'],
        ] },
        { type: 'callout', tone: 'warn', text: 'The 1-based tables will bite you. `myArray[1]` is the first item, and `#myArray` is the length.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'values',
      title: 'Variables, types and strings',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Always use `local`. A variable without `local` becomes a global, which is slower and causes hard-to-find bugs.' },
        { type: 'code', code: `-- Comments start with two dashes
local playerName = "Danny"        -- string
local coins = 100                 -- number (no separate int/float)
local isVip = false               -- boolean
local pet = nil                   -- nil means "nothing"

-- Optional type annotations help catch mistakes
local speed: number = 16
local title: string? = nil        -- ? means "string or nil"

-- Joining strings
print("Hello, " .. playerName .. "!")

-- String interpolation uses backticks
print(\`{playerName} has {coins} coins\`)

-- Math and compound assignment
coins += 50
coins *= 2
print(math.floor(7.8), math.random(1, 6), math.clamp(150, 0, 100))

-- Useful string functions
print(string.upper(playerName), #playerName, string.format("%.1f", 3.14159))` },
        { type: 'h', text: 'Truthiness' },
        { type: 'p', text: 'Only `false` and `nil` are falsy. **`0` and `""` are true** in Luau, unlike JavaScript or Python.' },
        { type: 'code', code: `if 0 then print("0 is true in Luau!") end
local nickname = nil
local shown = nickname or "Guest"   -- "or" gives a fallback value
print(shown) --> Guest` },
        { type: 'prompt', text: 'Give me 5 small Luau exercises about variables, strings and math (beginner level). Do not show the answers until I paste my attempts.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'logic-loops',
      title: 'If statements and loops',
      minutes: 15,
      blocks: [
        { type: 'code', code: `local health = 35

if health <= 0 then
	print("Dead")
elseif health < 50 then
	print("Hurt")
else
	print("Fine")
end

-- if as an expression (like a ternary)
local label = if health < 50 then "Low" else "OK"

-- Numeric for loop: start, stop, step (stop is included)
for i = 1, 5 do
	print("Countdown", 6 - i)
end
for i = 10, 0, -2 do print(i) end

-- While and repeat
local n = 0
while n < 3 do
	n += 1
end
repeat
	n -= 1
until n == 0

-- Looping over a table (Luau generalized iteration)
local inventory = { "Sword", "Shield", "Potion" }
for index, item in inventory do
	if item == "Shield" then continue end  -- skip this one
	print(index, item)
end` },
        { type: 'callout', tone: 'info', text: 'You will also see `for i, v in ipairs(t)` and `for k, v in pairs(t)` in older code. They still work. `for k, v in t do` is the modern Luau way.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'functions-tables',
      title: 'Functions and tables',
      minutes: 20,
      blocks: [
        { type: 'h', text: 'Functions' },
        { type: 'code', code: `local function add(a: number, b: number): number
	return a + b
end

-- Functions can return several values
local function minMax(list)
	local lo, hi = math.huge, -math.huge
	for _, v in list do
		lo = math.min(lo, v)
		hi = math.max(hi, v)
	end
	return lo, hi
end

local smallest, biggest = minMax({ 4, 9, 1 })

-- Functions are values: pass them around
local function doTwice(fn)
	fn()
	fn()
end
doTwice(function() print("hi") end)` },
        { type: 'h', text: 'Tables: the only data structure' },
        { type: 'p', text: 'A table can be a list (array), a dictionary, or an object. You will use them everywhere.' },
        { type: 'code', code: `-- As a list
local fruits = { "apple", "mango", "banana" }
table.insert(fruits, "calamansi")     -- add to end
table.remove(fruits, 1)               -- remove first item
print(#fruits, fruits[1])             --> 3   mango

-- As a dictionary
local prices = {
	Sword = 100,
	Shield = 75,
}
prices.Bow = 120
prices["Magic Wand"] = 500           -- keys with spaces need brackets
prices.Shield = nil                   -- remove a key

-- Nested: a player's save data
local data = {
	Coins = 0,
	Upgrades = { Speed = 1, Magnet = 0 },
	Pets = { "Cat" },
}
data.Upgrades.Speed += 1
print(data.Upgrades.Speed) --> 2` },
        { type: 'callout', tone: 'warn', text: '`#` only counts list-style items. It returns 0 for a dictionary. Count dictionary keys with a loop.' },
        { type: 'prompt', text: 'Write a Luau function that takes a table of player names to scores and returns the top 3 as a sorted list. Use table.sort with a custom comparator. Explain each line.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'modules',
      title: 'ModuleScripts: sharing code',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'A **ModuleScript** does not run by itself. It returns a table, and other scripts `require` it. Use modules for settings, shared helpers and systems like player data.' },
        { type: 'code', title: 'ReplicatedStorage/Shared/GameConfig (ModuleScript)', code: `local GameConfig = {}

GameConfig.StartingCoins = 0
GameConfig.CoinValue = 1
GameConfig.UpgradePrices = { 25, 60, 150, 400, 1000 }

function GameConfig.getUpgradePrice(level: number): number?
	return GameConfig.UpgradePrices[level + 1]
end

return GameConfig` },
        { type: 'code', title: 'Any Script or LocalScript', code: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local GameConfig = require(ReplicatedStorage.Shared.GameConfig)

print(GameConfig.getUpgradePrice(0)) --> 25` },
        { type: 'callout', tone: 'tip', text: 'A module runs once per side. Every script that requires it on the server gets the **same** table, so modules work like singletons.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'events-task',
      title: 'Events and the task library',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Roblox is event-driven. Instead of checking every frame “did a player join?”, you **connect** a function that runs when it happens.' },
        { type: 'code', code: `local Players = game:GetService("Players")

local function onPlayerAdded(player: Player)
	print(player.Name .. " joined")

	player.CharacterAdded:Connect(function(character)
		print(player.Name .. " spawned")
	end)
end

Players.PlayerAdded:Connect(onPlayerAdded)

-- Save the connection if you need to stop listening later
local part = workspace:WaitForChild("Button")
local connection
connection = part.Touched:Connect(function(hit)
	print("Touched by", hit.Name)
	connection:Disconnect()           -- only react once
end)` },
        { type: 'h', text: 'Waiting and running things in parallel' },
        { type: 'table', head: ['Use this', 'Instead of', 'What it does'], rows: [
          ['`task.wait(2)`', '`wait(2)`', 'Pause this thread for 2 seconds'],
          ['`task.spawn(fn)`', '`spawn(fn)`', 'Run a function right away in a new thread'],
          ['`task.delay(5, fn)`', '`delay(5, fn)`', 'Run a function after 5 seconds'],
          ['`task.defer(fn)`', '-', 'Run a function a moment later, after the current work'],
        ] },
        { type: 'code', code: `-- A game loop that does not block the rest of the script
task.spawn(function()
	while true do
		print("Round starting")
		task.wait(60)
	end
end)

print("This runs immediately, the loop above runs in parallel")` },
        { type: 'callout', tone: 'warn', text: 'Old tutorials use `wait()`, `spawn()` and `delay()`. They are deprecated. If Claude ever writes them, ask it to switch to the `task` versions.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'errors-oop',
      title: 'Errors, pcall and simple classes',
      minutes: 15,
      blocks: [
        { type: 'h', text: 'pcall: calls that can fail' },
        { type: 'p', text: 'Anything that talks to Roblox’s servers can fail: saving data, checking purchases, loading assets. Wrap those calls in `pcall` so one failure does not crash your script.' },
        { type: 'code', code: `local ok, result = pcall(function()
	return someRiskyCall()
end)

if ok then
	print("Worked:", result)
else
	warn("Failed:", result)   -- result is the error message
end` },
        { type: 'h', text: 'Reading errors in Output' },
        { type: 'p', text: 'Red text in Output shows the **script path and line number**. Click it to jump there. The most common one, `attempt to index nil with ...`, means you used something that does not exist yet. Usually the fix is `:WaitForChild()` or a nil check.' },
        { type: 'h', text: 'A simple class (metatables)' },
        { type: 'p', text: 'You will see this pattern in bigger codebases. You do not need it for your first games, but you should recognize it.' },
        { type: 'code', code: `local Pet = {}
Pet.__index = Pet

function Pet.new(name: string, power: number)
	local self = setmetatable({}, Pet)
	self.Name = name
	self.Power = power
	return self
end

function Pet:Describe()   -- colon adds a hidden "self" parameter
	return self.Name .. " (power " .. self.Power .. ")"
end

local cat = Pet.new("Mingming", 5)
print(cat:Describe())` },
        { type: 'quiz', id: 'quiz-luau', questions: [
          { q: 'What does `#{ "a", "b", "c" }` return?', options: ['2', '3', '0', 'An error'], answer: 1, why: 'The length operator counts list items: 3.' },
          { q: 'Which value is **falsy** in Luau?', options: ['0', '""', 'nil', '"false"'], answer: 2, why: 'Only nil and false are falsy. 0 and empty strings are truthy.' },
          { q: 'How do you write “not equal” in Luau?', options: ['!=', '<>', '~=', '=/='], answer: 2 },
          { q: 'Which is the modern way to pause a script for 1 second?', options: ['wait(1)', 'task.wait(1)', 'sleep(1)', 'delay(1)'], answer: 1, why: 'Use the task library. wait() is deprecated.' },
          { q: 'Why wrap a DataStore call in pcall?', options: ['It makes it faster', 'It can fail and would otherwise stop your script', 'It is required by Luau syntax', 'It encrypts the data'], answer: 1 },
        ] },
        { type: 'notes' },
      ],
    },
  ],
}
