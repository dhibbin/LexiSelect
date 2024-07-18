# Thursday July 18

Continuing to make interactable text
- Took roughly 1.3 hours
- Since the text tree uses a monospace font, the span tags can be offset using the number of characters that appear before them in the input box
- Searched through the Vuetify docs to find the appropriate choice for displaying the alternative tokens. Settled on the expansion panel and tried to get it instantiated for each span tag correctly 
- Will need to set up objects to hold all of the data together instead of using separate arrays 

Tracking changes to the text
- Took roughly 4 hours 
- Setup a test button that automatically loads an example response that I have saved from Llama.cpp so I dont have to continuously generate new respsonses
- Reorganised the text tree SFC to use a list of TreeTokens, the main content of which is pulled directly from the response
- Tried to setup a system that automatically readjusts the span tags so that the offsets will track with changes. However, I cannot find a way to locate the position of the cursor in the input box in VueJS, since I don't seem to have direct access to the DOM