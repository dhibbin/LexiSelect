# Tuesday July 30

Tasks completed
- Sidebar correctly uses randomly generated speed
	- -1 gets a random seed from the server and continues to use it on later generations
	- -2 uses a random seed every time 
- Documented LLMService and separated LLMSettings from it for better organisation
- Tried to write up a more efficient text area input handler function for textbar
	- Took up vast majority of the day
	- The new function works better than the original in some scenarios and is far worse in others
	- Will need to revisit this later to figure out a new approach to editing the tokens in the textbar