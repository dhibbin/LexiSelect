# Friday July 5

Morning meeting
- Took roughly 1 hour
- Discussed future for the project after prototype completion
- Developing a robust and useful featureset for creative writers and selecting a front end suited to the task were both the highest priority for work next week. 

Getting the AI to smoothly continue generation from previous generation and adding a system for outputs to appear of newlines when a new prompt is given or token selected
- Took roughly over 1 hour
- Determining how to use the template to get the AI to smoothly continue generation was a little confusing
- Followed what Mikupad did, by adding the end of user prompt token to the end of the original prompt and not the previous generation, you can coax the AI into continuing generation on a different completion request

Fighting JS array copying
- Took roughly 3.5 hours
- The website was correctly changing the tokens and displaying the new text generation using the selected token. However, it was changing arrays that it shouldn't have been on the back end.
- Diagnosing this and fixing this took a long time. I will definitely be using typescript for the real project. 
