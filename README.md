<h1>Project</h1>
Build a Twitter clone for the final Javascript assignment on The Odin Project: https://www.theodinproject.com/lessons/node-path-javascript-javascript-final-project

Twitter clone built from scratch with React and Firebase (no follow along tutorials etc, just good old fashioned reading dev docs).

Check it out here 👉 https://twitter-clone-v1-three.vercel.app/auth

<h2>Features</h2>

Signup/Login with auth error messages
Tweet with text, image, and emojis
Delete tweets
Threads and tweet replys
Follow/unfollow other users
Edit profile page (avatar, banner, name, etc)
View profile
Add bookmarks

<h2>Learnings</h2>

<h4>Scope first</h4>
Twitter is an amazing application with a lot of complex features. I thought I could build most of the functionality (lol), but quickly realised I'd need to focus on the main functionality and skip other stuff if I wanted to build this in a reasonable time.

For example, adding in an emoji selector to the tweet box took far longer then expected. I thought the browser would have an API. Non. Took me a few hours to get a package working, split the string, find the caret, etc. Great example of scope being way larger then first anticipated.

I spent time scoping out the front end architecture such as components and state, along with backend structure for storing data for tweets, threads, users. I probably could have spent 2-3x more upfront figuring this all out before building though. It would have saved time in the long run.

<h4>Prop Drilling is hard with complexity</h4>
Prop drilling (i.e passing props 3x+ layers deep) was a poor design decision. I decided to use prop drilling over useContext based on React docs:
https://beta.reactjs.org/learn/passing-data-deeply-with-context#before-you-use-context
"Start by passing props. If your components are not trivial, it’s not unusual to pass a dozen props down through a dozen components. It may feel like a slog, but it makes it very clear which components use which data! The person maintaining your code will be glad you’ve made the data flow explicit with props."

Twitter is quite complex - props need to be passed throughout the app regularly. For example, a users data is stored in state at the top level (app.js) and then passed down to smaller components further down the tree (e.g a small avatar image). Passing props down becomes error prone at scale.

Wasted a lot of time getting props drilled down and debugging. So easy to make an error when drilling down a few layers.
Following the above documentation makes sense for smaller apps. But in future, if I am confident an app is going to be complex, it's better to start with Context API or a tool like Redux so I don't need to refactor all the prop drilled code.

<h4>Single Source of Truth for State</h4>
I found myself having multiple 'sources of truth' for a piece of state. Take 'signed in' for example. I could check if a user was signed in base on Firebase Auth, or I could check if the local storage existed (LS was used for page refreshes so the app didn't need to request FB every time), or I could check the 'UserData' state. That's three ways to tell if a user is signed in, and I found myself using different ways for different components.

In future, I'll plan a design at the start and aim to use a single source of truth for state.

<h4>Build Components Fully, Once</h4>
I should create a component once, and then reuse it. For example, I created buttons about 5 times and Avatars 2-3 times.
Could have created once and added properties for styling and passed in props as needed.

An example where I did this well was the Tweet component or the ChangeImgButton. In future, it's better to do the work upfront by designing the entire app and then building components upfront to save time in the long run.

I should build the component fully, before moving on as well. I made the mistake of half building a component. For example, not making it fully responsive. It's then time consuming to come back and look at older code.

<h4>File Structure</h4>
It would have been worthwhile reading this first: https://reactjs.org/docs/faq-structure.html
I didn't start off structuring my files all that well, and it took me more time to restructure them later
I like the model of Grouping by features or routes rather then by file type.

I also learnt NextJs during this project, and realised using Next would make building this more structured.

<h4>Data Modeling</h4>
Created a seperate root level collection for tweets with the userID
Inspired by: https://www.youtube.com/watch?v=jm66TSlVtcc&t=314

<h4>Storing and updating Data</h4>
Ran into an issue with the avatar from the tweet breaking after a user updated their avatar
Summary and solve docuented here: https://monosnap.com/file/dGp653bbnaMSm4Nhu9SHod1Ht7uGzc

<h2>Roadmap and Bugs</h2>
See the project kanban for bugs to be fixed and features being considered in future.

If you notice any bugs please create an issue to let me know 🙏
