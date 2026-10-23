export default {
  id: 'ui',
  title: 'Making UI',
  color: 'yellow',
  summary: 'ScreenGuis that work on phones, a live coin counter, and a shop panel that slides in.',
  lessons: [
    {
      id: 'ui-basics',
      title: 'ScreenGui building blocks',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Most Roblox players are on **phones**. Design UI for a small touch screen first, then check it on PC. In Studio, use the **Device emulator** (Test tab) to preview phone sizes.' },
        { type: 'table', head: ['Object', 'Purpose'], rows: [
          ['ScreenGui', 'Container for 2D UI. Put it in StarterGui; each player gets a copy.'],
          ['Frame', 'A box. Panels, backgrounds, groups.'],
          ['TextLabel / TextButton', 'Text, and text you can tap.'],
          ['ImageLabel / ImageButton', 'Icons and pictures.'],
          ['UIListLayout / UIGridLayout', 'Arrange children automatically in a list or grid.'],
          ['UIPadding, UICorner, UIStroke', 'Spacing, rounded corners, outlines.'],
          ['UIAspectRatioConstraint', 'Keeps a shape (like a square button) the same on every screen.'],
        ] },
        { type: 'h', text: 'Scale vs Offset' },
        { type: 'p', text: 'Size and Position use **UDim2**: `{scaleX, offsetX}, {scaleY, offsetY}`. **Scale** is a fraction of the screen (0.5 = half). **Offset** is pixels. Use **Scale** for size and position so the UI fits every device; use small offsets only for padding.' },
        { type: 'code', code: `frame.AnchorPoint = Vector2.new(0.5, 0.5)       -- position from its center
frame.Position = UDim2.fromScale(0.5, 0.5)        -- center of the screen
frame.Size = UDim2.fromScale(0.4, 0.5)            -- 40% wide, 50% tall` },
        { type: 'callout', tone: 'tip', text: 'Keep buttons at least about 44 pixels tall on phones and away from the bottom-left (movement stick) and bottom-right (jump button).' },
        { type: 'notes' },
      ],
    },
    {
      id: 'coin-counter',
      title: 'A live coin counter',
      minutes: 12,
      blocks: [
        { type: 'p', text: 'Build in Explorer: StarterGui → ScreenGui named **HUD** → TextLabel named **CoinLabel** (top-center, Scale size around 0.25 × 0.07). Then add a LocalScript inside HUD:' },
        { type: 'code', title: 'StarterGui/HUD/CoinDisplay (LocalScript)', code: `local Players = game:GetService("Players")

local player = Players.LocalPlayer
local label = script.Parent:WaitForChild("CoinLabel")

local leaderstats = player:WaitForChild("leaderstats")
local coins = leaderstats:WaitForChild("Coins")

local function refresh()
	label.Text = "Coins: " .. coins.Value
end

coins.Changed:Connect(refresh)
refresh()` },
        { type: 'callout', tone: 'info', text: 'The client only **reads** the value here. The server still owns it. Reading is always safe.' },
        { type: 'notes' },
      ],
    },
    {
      id: 'shop-panel',
      title: 'A shop panel that slides in',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Add to HUD: a TextButton **OpenShop**, and a Frame **ShopFrame** with AnchorPoint (0.5, 0.5), Position scale (0.5, 1.5), so it starts below the screen.' },
        { type: 'code', title: 'StarterGui/HUD/ShopToggle (LocalScript)', code: `local TweenService = game:GetService("TweenService")

local hud = script.Parent
local button = hud:WaitForChild("OpenShop")
local shop = hud:WaitForChild("ShopFrame")

local OPEN = UDim2.fromScale(0.5, 0.5)
local CLOSED = UDim2.fromScale(0.5, 1.5)
local info = TweenInfo.new(0.35, Enum.EasingStyle.Back, Enum.EasingDirection.Out)

local isOpen = false

button.Activated:Connect(function()
	isOpen = not isOpen
	local goal = { Position = if isOpen then OPEN else CLOSED }
	TweenService:Create(shop, info, goal):Play()
	button.Text = if isOpen then "Close" else "Shop"
end)` },
        { type: 'callout', tone: 'tip', text: 'Use `Activated` instead of `MouseButton1Click`. It works for mouse, touch and gamepad.' },
        { type: 'prompt', text: 'In StarterGui/HUD/ShopFrame, build a clean shop layout with a title, a UIGridLayout of 3 item cards (icon placeholder, name, price, Buy button), UICorner and UIPadding. Use Scale sizing so it fits phones. Do not wire up purchases yet. Then playtest with a phone emulator and take a screen_capture so I can see it.' },
        { type: 'notes' },
      ],
    },
  ],
}
