
# Music Realtime Player 


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

This is a web application which built for realtime-streaming audio song.
Stacks have been used:

- VueJS
- NodeJS: Used Puppeter for crawling data from ZingMP3 API.
- ✨ Firebase: Used for realtime. ✨


## Features

- Listen audio completely - 100% realtime. 
- Scrape data from [ZingMP3 API](https://github.com/kobato-chan1912/ZingMP3-API) (with NodeJS and Puppeter) 
- Auto show lyrics if available.
- Chatbox feature. 
- Nice theme with transparent blured box style.
- Request song throught ID Song of Zing MP3. The song will be added to Queue as FIFO method.

<p align="center">
<img align="center" width="350" alt="Screen Shot 2021-08-30 at 11 57 09" src="https://user-images.githubusercontent.com/62328211/131287302-0439bfdf-b4ea-45b7-b7c9-97f8bd9db481.png"></p>

## Update 28 August

- Quobee stickers included in chatbox. 
<p align="center">
<img width="300" alt="Screen Shot 2021-08-30 at 11 57 28" src="https://user-images.githubusercontent.com/62328211/131287320-ff6ce174-7bd9-4969-b3fa-879a9749e9e2.png"></p>

- Realtime notification when user logins. 

<p align="center"><img width="317" alt="Screen Shot 2021-08-30 at 12 00 36" src="https://user-images.githubusercontent.com/62328211/131287612-810cf476-207d-4b06-84f9-8d860521f60d.png"></p>


## Update 30 August

- Add song throught command in chatbox. 
```sh
/addsong {id}
```
<p align="center"><img width="423" alt="Screen Shot 2021-08-30 at 12 01 16" src="https://user-images.githubusercontent.com/62328211/131287665-af63cda7-4c07-43a1-82d0-bcd38ea4cbc4.png"></p>

## Deployment

This web app has been deployed as well as hosted by Microsoft Azure (for Backend) and Firebase Hosting (for Client):

- [Player Here](https://players-f1cdf.web.app/client) - Click the link here. 

or 

```sh
https://players-f1cdf.web.app/client
```

## Build 

- In <client> and <dist> folder, change firebase config (in index.htnl each folder) as your setting. 
```
  var firebaseConfig = {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        };
```
- Run in Live Server. 
  
## Contribution. 

- Contribution is always opened. We're very welcome for everyone to contribute this respository. You can send Pull Request anytime, anywhere, as well as create issues. 
- This software is completely open-source for everyone to use, or re-use, or do anything you want. 
  
