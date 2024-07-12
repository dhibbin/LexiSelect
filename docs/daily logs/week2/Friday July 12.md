# Friday July 12

Tinkering ESlint and adding more menu options
- Took roughly 1 hour
- I wanted to setup typescript-eslint to not require explicit types when the type could be inferred from an initial value, but to require explicit types when the variable was initialised with no value
- It turns out that the two rules that are used for these purposes conflict with each other and enabling both of them causes an endless loop of ESlint errors within your files
- So I settled on disabling requiring explicit types for variable declaration, since for some initial values these types would needlessly complicate the code 
- I added more options to the side menu and will work on creating an object to interface with the LLM server next

Only accepting valid settings and passing to LLMService
- Took roughly 4.5 hours
- The sidebar component creates an interface using the values within the settings menu
- This interface is passed to LLMService which validates these settings to ensure they will work before updating the settings of the singleton
- This took suprisingly long since I was conflicted on whether or not to use interfaces or classes for the settings objects 
- Additionally I was facing unexpected errors being raised from the SettingsRules interface
- Will need to fix the ESLint installation