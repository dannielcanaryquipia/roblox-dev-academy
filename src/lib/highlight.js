// Small, dependency-free syntax highlighter for the languages used in the lessons.
// Returns an array of { t: tokenType, v: text } that <CodeBlock> renders as spans.

const LUAU_KEYWORDS = new Set([
  'and', 'break', 'continue', 'do', 'else', 'elseif', 'end', 'false', 'for', 'function', 'if', 'in',
  'local', 'nil', 'not', 'or', 'repeat', 'return', 'then', 'true', 'until', 'while', 'type', 'export',
])
const LUAU_GLOBALS = new Set([
  'game', 'workspace', 'script', 'task', 'math', 'string', 'table', 'print', 'warn', 'error', 'pcall',
  'xpcall', 'require', 'typeof', 'tostring', 'tonumber', 'ipairs', 'pairs', 'os', 'Instance', 'Vector3',
  'CFrame', 'Color3', 'UDim2', 'TweenInfo', 'Enum', 'BrickColor', 'setmetatable', 'getmetatable', 'self',
  'select', 'assert', 'next', 'buffer', 'utf8', 'Random', 'DateTime', 'NumberRange', 'UDim',
])

const RULES = {
  luau: [
    ['comment', /--\[\[[\s\S]*?\]\]|--[^\n]*/y],
    ['string', /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`|\[\[[\s\S]*?\]\]/y],
    ['number', /\b(?:0x[0-9a-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?)\b/y],
    ['word', /[A-Za-z_][A-Za-z0-9_]*/y],
    ['op', /\.\.\.|\.\.|==|~=|<=|>=|\+=|-=|\*=|\/=|::|->|[+\-*/%^#=<>(){}[\];:,.]/y],
    ['space', /\s+/y],
  ],
  shell: [
    ['comment', /#[^\n]*/y],
    ['string', /"(?:\\.|[^"\\])*"|'[^']*'/y],
    ['flag', /(?<=\s)--?[A-Za-z][\w-]*/y],
    ['var', /\$env:[A-Za-z_]+|\$[A-Za-z_]+|%[A-Za-z_]+%/y],
    ['word', /[^\s"'#]+/y],
    ['space', /\s+/y],
  ],
  json: [
    ['string', /"(?:\\.|[^"\\])*"(?=\s*:)/y],
    ['value', /"(?:\\.|[^"\\])*"/y],
    ['number', /-?\d+(?:\.\d+)?/y],
    ['keyword', /\b(?:true|false|null)\b/y],
    ['op', /[{}[\],:]/y],
    ['space', /\s+/y],
  ],
}

export function highlight(code, lang = 'luau') {
  const rules = RULES[lang === 'bash' || lang === 'powershell' || lang === 'cmd' ? 'shell' : lang]
  if (!rules) return [{ t: 'plain', v: code }]
  const out = []
  let i = 0
  let firstWordOnLine = true
  while (i < code.length) {
    let matched = false
    for (const [type, re] of rules) {
      re.lastIndex = i
      const m = re.exec(code)
      if (m && m[0].length) {
        let t = type
        const v = m[0]
        if (lang === 'luau' && type === 'word') {
          if (LUAU_KEYWORDS.has(v)) t = 'keyword'
          else if (LUAU_GLOBALS.has(v)) t = 'global'
          else if (/^[A-Z]/.test(v)) t = 'type'
          else if (code[i + v.length] === '(' || code[i + v.length] === ':') t = 'fn'
          else t = 'plain'
        }
        if (t === 'word') t = firstWordOnLine ? 'cmd' : 'plain'
        if (type === 'space') {
          if (v.includes('\n')) firstWordOnLine = true
        } else if (type !== 'comment') {
          firstWordOnLine = false
        }
        out.push({ t, v })
        i += v.length
        matched = true
        break
      }
    }
    if (!matched) {
      out.push({ t: 'plain', v: code[i] })
      i += 1
    }
  }
  return out
}
