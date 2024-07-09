# Investigating UI Component Libraries

Originally I was considering using Bootstrap or Vuetify, since I used bootstrap for the prototype and had read yesterday that Vuetify was the most used UI component library for VueJS. However, after looking into how to use Bootstrap with VueJS, it would require some extra steps since Bootstrap isn't designed to work with any particular framework, so setting up bootstrap components to work with Vue's systems would be a little bit annoying.

So I looked into other VueJS UI component libraries besides Vuetify and found Quasar. Their documentation was generally highly rated online. Looking through the project, I thought it would be a good fit if I wanted to package this up as an electron app at some point. Additionally, looking through reddit threads on recommended UI libraries for VueJS, people generally seemed to prefer Quasar over Vuetify. 

My primary concern was picking a UI library with a good layout engine, however it seems that both Vuetify and Quasar use a layout system very similar to Bootstrap's so this isn't a major concern. 

For these reasons I am going to go with Quasar for my UI component library. If there are immediate problems I can always switch to another near the beginning of developement.