# Thursday July 11

Forcing strict typing in typescript part 1
- Took 1.5 hours
- Tried changing tsconfig.json and other tsconfig VueJS files to force strict and explicit typing in all code files
- Tried installing ESLint with a typescript plugin to require types
- None of these works and I can declare new variables without typing their type
- This shouldn't have taken this long and will return to developing the page 

Forcing strict typing part 2
- Took 4 hours
- Thought that there is no way that requiring explicit typing is this difficult and decided to give it a second shot after lunch
- Installed VSCode to replace VSCodium and uninstalled ESLint and reinstalled it by installing the Vue plugin for ESLint first
- Spent the next few hours messing with the configuration files for typescript compiling and ESLint trying to get explicit typing to throw an IDE error
- Configuring ESLint felt non-deterministic, the same lines of code would cause errors at one point and at other points work entirely
- After losing my mind I decided to do a final check to see if typescript-eslint has rules that you can toggle for typing. Manually adding these to override the exported ESLint configuration in `eslint.config.js` it finally worked
- Unfortunate waste of a day, look forward to actually accomplishing something tomorrow