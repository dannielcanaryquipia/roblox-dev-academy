export default {
  id: 'setup',
  title: 'Setup your workshop',
  color: 'red',
  summary: 'Install Roblox Studio and Claude Code, connect them through Studio’s built-in MCP server, and set up a project folder.',
  lessons: [
    {
      id: 'install-studio',
      title: 'Install Roblox Studio',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Roblox Studio is the free editor where every Roblox game is built. You already have a Roblox account, so this takes a few minutes.' },
        { type: 'steps', items: [
          { title: 'Go to [create.roblox.com](https://create.roblox.com) and sign in.', text: 'This is the Creator Hub. You will use it later for publishing, monetization and DevEx.' },
          { title: 'Download and install Studio.', text: 'Use the Start Creating / download button. Studio updates itself automatically.' },
          { title: 'Open Studio and create a new **Baseplate**.', text: 'Baseplate is an empty world with a floor and a spawn point. It is the best template for learning.' },
          { title: 'Press **Play** (F5).', text: 'Your avatar spawns. Walk around with WASD, then press **Stop**. You just ran a Roblox game.' },
          { title: 'Save it: File → Save to Roblox.', text: 'Saving to Roblox gives you version history in the cloud. Name it something like “Learning Sandbox”.' },
        ] },
        { type: 'callout', tone: 'tip', text: 'Turn on two-step verification on your Roblox account now. This account will hold your games and your money.' },
        { type: 'checklist', id: 'setup-studio', items: [
          'Studio installed and I can sign in',
          'Created a Baseplate and pressed Play',
          'Saved it to Roblox as “Learning Sandbox”',
          'Two-step verification is on',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'install-claude-code',
      title: 'Install Claude Code',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'Claude Code is an AI coding agent that runs in your terminal (or in the Claude desktop app). It can read and edit files, run commands, and, with Studio’s MCP server, work directly inside your open Roblox place.' },
        { type: 'callout', tone: 'money', title: 'Plan required', text: 'Claude Code needs a Pro, Max, Team, Enterprise or Console account. The free claude.ai plan does not include it.' },
        { type: 'h', text: 'Windows (PowerShell)' },
        { type: 'p', text: 'Open PowerShell (your prompt starts with `PS C:\\`) and run:' },
        { type: 'code', lang: 'powershell', code: 'irm https://claude.ai/install.ps1 | iex' },
        { type: 'p', text: 'Installing [Git for Windows](https://git-scm.com/downloads/win) is recommended too: Claude Code uses Git Bash for shell commands when it is present, and you will want Git for saving versions of your code anyway.' },
        { type: 'h', text: 'macOS / Linux' },
        { type: 'code', lang: 'bash', code: 'curl -fsSL https://claude.ai/install.sh | bash' },
        { type: 'h', text: 'Check it worked' },
        { type: 'p', text: 'Close the terminal, open a new one, then:' },
        { type: 'code', lang: 'bash', code: 'claude --version\nclaude' },
        { type: 'p', text: 'The second command starts a session. The first time, it opens your browser to log in. If `claude` is “not recognized”, the install folder is not on your PATH yet; the [Claude Code setup docs](https://code.claude.com/docs/en/setup) explain the fix.' },
        { type: 'h', text: 'Commands you will use every day' },
        { type: 'table', head: ['Command', 'What it does'], rows: [
          ['`claude`', 'Start a session in the current folder.'],
          ['`/mcp`', 'Inside a session: see connected MCP servers (Roblox Studio should be listed).'],
          ['`/clear`', 'Start a fresh conversation. Do this between unrelated tasks.'],
          ['`/init`', 'Ask Claude to create a `CLAUDE.md` describing your project.'],
          ['`Esc`', 'Stop Claude mid-task when it heads the wrong way.'],
          ['`claude doctor`', 'Check your installation if something seems broken.'],
        ] },
        { type: 'checklist', id: 'setup-cc', items: [
          'Claude Code installed and `claude --version` prints a version',
          'Logged in successfully',
          'Git for Windows installed (recommended)',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'connect-mcp',
      title: 'Connect Claude Code to Studio',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'MCP (Model Context Protocol) is a standard way for AI tools to talk to other apps. Roblox Studio has an **MCP server built in**. Once connected, Claude Code can explore your game tree, read and edit scripts, run Luau, start a playtest, read the Output log and even take screenshots.' },
        { type: 'h', text: 'Turn on the server in Studio' },
        { type: 'steps', items: [
          { title: 'Update Studio to the latest version.' },
          { title: 'Open the **Assistant** panel.' },
          { title: 'Click **…** → **Manage MCP Servers**.' },
          { title: 'Turn on **Enable Studio as MCP server**.' },
        ] },
        { type: 'h', text: 'Connect Claude Code (easy way)' },
        { type: 'p', text: 'In **Assistant Settings → MCP Servers**, open **Quick connect** and turn on **Claude Code**. If it does not appear in the list, install Claude Code first and restart Studio.' },
        { type: 'h', text: 'Connect Claude Code (manual way)' },
        { type: 'p', text: 'If Quick connect does not work, add the server from a terminal. On Windows:' },
        { type: 'code', lang: 'powershell', code: 'claude mcp add --transport stdio Roblox_Studio -- cmd.exe /c %LOCALAPPDATA%\\Roblox\\mcp.bat' },
        { type: 'p', text: 'On macOS:' },
        { type: 'code', lang: 'bash', code: 'claude mcp add --transport stdio Roblox_Studio -- /Applications/RobloxStudio.app/Contents/MacOS/StudioMCP' },
        { type: 'h', text: 'Verify' },
        { type: 'list', items: [
          'In Studio’s **Manage MCP Servers**, a **green indicator** shows the number of connected clients.',
          'In Claude Code, type `/mcp`. You should see `Roblox_Studio` connected.',
          'If not: restart both Studio and Claude Code, and check the command path exists.',
        ] },
        { type: 'h', text: 'What Claude can do in Studio' },
        { type: 'table', head: ['Tool group', 'Examples'], rows: [
          ['Scripts', '`script_read`, `script_search`, `script_grep`, `multi_edit` (create/edit scripts)'],
          ['Explore the game', '`search_game_tree`, `inspect_instance`'],
          ['Run code', '`execute_luau` in Edit, Server or Client'],
          ['Playtest', '`start_stop_play`, `get_console_output`, `screen_capture`'],
          ['Simulate a player', '`character_navigation`, `user_keyboard_input`, `user_mouse_input`'],
          ['Assets', '`search_asset`, `insert_asset`, `generate_mesh`, `generate_material`, `generate_procedural_model`'],
          ['Docs', '`http_get` on Roblox docs, `skill` for best practices'],
        ] },
        { type: 'callout', tone: 'warn', text: 'A connected client can **change your open place**. Save to Roblox before big tasks so you can roll back from version history, and only connect clients you trust.' },
        { type: 'h', text: 'Your first test' },
        { type: 'prompt', text: 'Using the Roblox Studio MCP tools, list the services in my open place and tell me what is inside Workspace. Do not change anything yet.' },
        { type: 'prompt', text: 'Create a bright red anchored Part named "HelloPart" at position (0, 5, 0) in Workspace. Then explain the Luau you ran, line by line, like I am new to Luau.' },
        { type: 'checklist', id: 'setup-mcp', items: [
          'Enabled Studio as MCP server',
          'Green indicator shows Claude Code connected',
          '`/mcp` lists Roblox_Studio',
          'Claude created HelloPart and explained the code',
        ] },
        { type: 'notes' },
      ],
    },
    {
      id: 'project-folder',
      title: 'Project folder and CLAUDE.md',
      minutes: 10,
      blocks: [
        { type: 'p', text: 'Claude Code always starts in a folder. Give every game its own folder, even when the scripts live inside Studio. The folder holds your design notes, your to-do list and a `CLAUDE.md` file that Claude reads at the start of every session.' },
        { type: 'code', lang: 'text', title: 'Suggested layout', code: 'my-roblox-game/\n  CLAUDE.md        <- rules Claude follows in this project\n  DESIGN.md        <- your game idea, core loop, monetization plan\n  TODO.md          <- next small tasks\n  devlog.md        <- what you did each session (great for TikTok content later)' },
        { type: 'h', text: 'A CLAUDE.md for Roblox projects' },
        { type: 'p', text: 'Copy this into `CLAUDE.md` and edit the first lines for your game. It keeps Claude’s code consistent and safe.' },
        { type: 'code', lang: 'text', title: 'CLAUDE.md', code: `# Project: <game name>
I am learning Roblox development. Explain new concepts briefly when you use them.

## How we work
- Use the Roblox Studio MCP tools to read and edit the open place.
- Make one small change at a time, then playtest with start_stop_play and read get_console_output.
- Before editing, tell me which scripts you will touch and why.
- Never delete scripts or instances without asking me first.

## Code rules (Luau)
- Use \`local\` for everything. Use task.wait / task.spawn / task.delay, never wait() / spawn() / delay().
- Server owns all important data (currency, stats, purchases). The client only sends requests.
- Validate every RemoteEvent argument on the server. Add rate limits to remotes.
- Wrap DataStore and MarketplaceService calls in pcall.
- Use game:GetService("...") at the top of every script.
- Shared code goes in ModuleScripts in ReplicatedStorage (shared) or ServerScriptService (server only).
- Add short comments explaining *why*, not *what*.

## Structure
- ServerScriptService: server Scripts + server ModuleScripts
- ReplicatedStorage/Remotes: RemoteEvents and RemoteFunctions
- ReplicatedStorage/Shared: shared ModuleScripts (config, constants)
- StarterPlayer/StarterPlayerScripts: client LocalScripts
- StarterGui: ScreenGuis` },
        { type: 'notes' },
      ],
    },
    {
      id: 'rojo-git',
      title: 'Optional later: Rojo + Git',
      minutes: 15,
      blocks: [
        { type: 'p', text: 'By default your scripts live inside the Studio place. That is fine for learning. When your game grows, many developers switch to **Rojo**: scripts live as normal `.luau` files on disk, Git tracks every change, and Rojo syncs the files into Studio live.' },
        { type: 'callout', tone: 'info', title: 'When to switch', text: 'Stay with Studio + MCP for Modules 2–9. Consider Rojo when you start your second real game, or when you want Git history and the ability to undo any change Claude made.' },
        { type: 'h', text: 'Install Rokit (tool manager) on Windows' },
        { type: 'code', lang: 'powershell', code: 'Invoke-RestMethod https://raw.githubusercontent.com/rojo-rbx/rokit/main/scripts/install.ps1 | Invoke-Expression' },
        { type: 'h', text: 'Add Rojo to a new project' },
        { type: 'code', lang: 'bash', code: 'mkdir my-roblox-game\ncd my-roblox-game\nrokit init\nrokit add rojo-rbx/rojo\nrojo init\nrojo plugin install\ngit init' },
        { type: 'h', text: 'Daily use' },
        { type: 'code', lang: 'bash', code: 'rojo serve' },
        { type: 'p', text: 'Then click **Connect** in the Rojo plugin inside Studio. Edits in `src/` appear in Studio immediately. Claude Code edits the files; you commit with Git when something works.' },
        { type: 'callout', tone: 'warn', text: 'Pick one source of truth. With Rojo, edit scripts as files, not inside Studio, or Rojo will overwrite your Studio edits. Tell Claude this in `CLAUDE.md`.' },
        { type: 'notes' },
      ],
    },
  ],
}
