# Monday July 29

Tasks completed today
- Changed alternative token list
	- Always display original tokens
	- Switched token chance to percentage chance
	- Changed how the list is displayed to have chance in a blue rounded box
- Textarea fix
	- Changing contents of textarea would change the contents of other branches, fixed this issue
	- Textareas are also quite slow due to the handling function, Ill need to update it to use the selection start/end to speed up the function
- Added removing branches
	- A delete button is next to the textareas for the user to delete a branch from the page
- Added prompt template support
	- A settings panel has been added to provide strings for the following
		- System prompt prepend/postpend
		- User prompt prepend/postpend
		- Response template tokens to remove from output
- Added documentation to LLMService.ts