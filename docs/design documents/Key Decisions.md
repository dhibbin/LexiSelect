# Key Decisions

## Week 1

Which AI front end should be used?
- See [Investigating AI Frontends](https://github.com/dhibbin/LexiSelect/blob/main/docs/research/Investigating%20AI%20Frontends.md)
- Conclusion: Text-Generation-WebUI is likely the best front end if I am going to use someone else's AI front end. 

Do I use a pre-made front end or develop one myself
- Originally this project was expected to require adding additionally functionality to llama's API to allow for saving the state of the LLM and forcing it to select certain tokens
- The simplicity of MikuPad's implementation showed us that this was unnecessary
- Therefore, I should focus on developing a front end specifically for this project, since most of the features will come from being able to visually interact with token probabilities and seeing potential paths for text generation

Should this be developed as a browser extension?
## Week 2

Which JS framework to use?
- See [Investigating JS Frameworks]
- Conclusion: VueJS is probably the best option for this project