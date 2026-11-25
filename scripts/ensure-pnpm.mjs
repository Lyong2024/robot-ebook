const agent = process.env.npm_config_user_agent ?? ''

if (!agent.startsWith('pnpm/')) {
  console.error('This repository uses pnpm. Install dependencies with: pnpm install')
  process.exit(1)
}
