# improvisr
###### COMS4170

```
             _____
             | |   \
             | |    \
             | |     \___
             | |         \
             | |          \
       0    _|_|___________|
      /\/  /____|____________)
   . /  \_|__________________|
   |/__    | )(            )(
   | |\\  :| )(            )(

```
You already know what time it is.

Nothing but **Node.js**, blood, sweat, tears, & coffee.

This was meant to be an application that detects
microphone input and helps you write sheet music in order to better learn how to
improvise.

I have since realized that the **HTML5** web audio API is difficult, and rendering svg versions
of sheet music is even more so. So, unfortunately, I've only delivered on around half of my original user goals.

However, not all is lost!

Users can still enjoy their favorite videos within a beautiful interface and simultaneously
sing, hum, and/or whistle over them with assisted pitch detection. Hopefully making them
at least more comfortable with understandings of key, pitch class and ear training.

I also tried to get this to work without a server but ran into a lot of security issues within Chrome when attempting to serve the local database and the audio api -- so my apologies in that regard.

Without further ado, let's jump in. ***HEADPHONES recommended!***

&nbsp;

##### DIRECTORY STRUCTURE

* _app/_ - `meat & potatoes`
  * _controllers/_ - `one lousy api endpoint and one lousy view`
  * _models/_ - `video data modeling`
  * _public/_ - `the backbone of this project filled with static goodies`
    * _images/_ - `thumbnails of videos and icons`
    * _scripts/_ - `sheesh - peek in here if you dare`
    * _styles/_ - `compiled css`
    * _videos/_ - `my precioussssss....`
  * _sass/_ - `pre-compiled styling`
  * _utils/_ - `youtube video downloading script`
  * _views/_ - `'view' might have been more appropriate`
    * _layouts/_ - `lego base`
    * _partials/_ - `lego blocks`
    * _index.hbs_ - `handle it`
  * _db.json_ - `dripping in finesse`
* _resources/_ - `all write-ups and project milestone info are here`
* _app.js_ - `entrypoint`
* _config.js_ - `app config variables`
* _package.json_ - `just node tings`

&nbsp;

### "I don't trust this cat. Let's see if this really works..."
_Feel free to run it yourself. But make sure you have **Node.js** installed!_

1. You must clone the repo. Unless you've already done so, of course.

    `git clone`

2. You must nurture the repo.

    `npm install`

3. You must love the repo.

    `npm start`

4. You should be good to go! If you might want to download your own videos,
wipe the current ones and get some new ones with the following commands!

    `npm run clean` &&
    `npm run dl [link1 link2 ...]`

&nbsp;

Here are a few that could be great to start with if you don't like mine!

- https://www.youtube.com/watch?v=e3vL8guiFFM

- https://www.youtube.com/watch?v=6TvD3snfSig

- https://www.youtube.com/watch?v=eO_IEv7SzVM
