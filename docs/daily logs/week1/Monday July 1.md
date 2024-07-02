# Monday July 1

Morning meeting 
- Took roughly 40 mins
- Discussed tasks to do for Monday and Tuesday, agreed to regular meetings on Monday, Wednesday and Friday

Get llama.cpp running stably and connected to MikuPad
- Took roughly 30 mins
- Had problems related to using llama with Safari, switched to Chrome to test it and figure out how it works
- Mini Llama produced low quality outputs, whereas Phi-3-mini-4k run well and produced much better outputs

Investigate and reverse engineer Mikupad
- Took roughly 2 hours
- Took a while to figure out where exactly the probabilities and tokens where stored and how they were used due to the general lack of comments and that it was all in one file
- Turns out the functionality was much simpler than anticipated, wrote up an explanation. See [Reverse Engineering MikuPad](docs/research/Reverse%20Engineering%20MikuPad.md)

Create repository
- Took roughly 20 mins
- Only took so long due to setting up a new GitHub account for professional work
- Also due to MacOS being weird about removing extensions from files
- Selected Apache 2.0 license since it seemed to be the most suitable for the project

Create wireframe in Keynote
- Took roughy 1.5 hours
- Considering whether to display the tree horizontally or vertically, current design is vertical but will be heavily subject to change
- All settings and parameters should be in the side window besides perhaps the prepend and postpend of the prompt 