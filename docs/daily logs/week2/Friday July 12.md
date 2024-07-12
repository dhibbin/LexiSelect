# Friday July 12

Tinkering ESlint and adding more menu options
- Took roughly 1 hour
- I wanted to setup typescript-eslint to not require explicit types when the type could be inferred from an initial value, but to require explicit types when the variable was initialised with no value
- It turns out that the two rules that are used for these purposes conflict with each other and enabling both of them causes an endless loop of ESlint errors within your files
- So I settled on disabling requiring explicit types for variable declaration, since for some initial values these types would needlessly complicate the code 
- I added more options to the side menu and will work on creating an object to interface with the LLM server next