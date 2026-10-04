## Purpose
Personal wealth tracking application to register bank accounts and investments, track transactions, and obtain daily snapshots of total net worth.

## Rules
- No Tailwind or other CSS frameworks.
- Do not add inline styles.
- Use the Grid.svelte component whenever possible to structure layout.
- Use WebAwesome for elements whenever possible.
- Do not write CSS or add unnecessary classes. I will write whatever CSS is needed.
- The Header and Footer are separate components.
- Do not use redundant attributes. Example: `<Grid gap="m" />`
- Code comments must be in English.
- README.md and AGENTS.md must be in English.
- Do not commit any changes.

## Notes
- This project is hosted on Coolify.
- Web runs on port 3000, PocketBase runs on port 8090.
- Authentication: Login page configured with PocketBase auth. No registration page (single user).