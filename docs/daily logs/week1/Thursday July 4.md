# Thursday July 4

Fixed the HTML UI layout
- Took roughly over 1.5 hours
- The page was going off screen, this was caused by code I copied from examples
- Re wrote the layout myself to use bootstrap's rows and columns, now it works as expected and I understood it

Added interactive scrolling text system
- Took roughly 2 hours
- Text can now be clicked on since they are all button elements
- Working out how to do timeouts and promises so that buttons are only added to the document when the previous button had finished being "typed out" was difficult

Added displaying probabilities upon text being clicked
- Took roughly 1.5 hours
- Clicking on output text causes all alternative tokens and their probabilities to appear 

Started working on retaining tokens and prompts and slicing them to feed them back into the LLM
- Took roughly 30 mins