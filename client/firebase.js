$('video').trigger('pause');
$('video').trigger('play');

$('.btn-play').click();
$("#messages").animate({ scrollTop: $("#messages")[0].scrollHeight }, 1000);


// userName first.

var userName = "admin";
var src = "images/node-white.png"
Swal.fire({
   title: 'Nhập tên đăng nhập',
   text: 'Tên đăng nhập sẽ hiển thị khi chat',

   html: `<img src="images/node-white.png" width="180px">`,
   // text: "Tên đăng nhậ",
   input: 'text',
   inputAttributes: {
      autocapitalize: 'off'
   },
   confirmButtonText: 'Vào',
   showLoaderOnConfirm: true,
   preConfirm: (login) => {
      if (login == "") {
         Swal.showValidationMessage(
            `Vui lòng không để trống tên!`
         )
      }
      else {
         userName = login;
         $("video").prop('muted', false);
         $("video").hide();
      }

   },
   allowOutsideClick: () => !Swal.isLoading()
});

// chat render. 

// Render Stickers // 

var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();
// Create a child reference
var imagesRef = storageRef.child('gifs');

// Find all the prefixes and items.
imagesRef.listAll()
   .then((res) => {

      res.items.forEach((itemRef) => {

         itemRef.getDownloadURL().then(function (url) {
            
            let html = ""
            html += `<span class="intercom-emoji-picker-emoji" title="thumbs_up">
                        <img src="${url}" width="50px" alt="">
                        </span>`
            document.getElementById('stickers').innerHTML += html

         }).catch(function (error) {
            // Handle any errors
         });
      });
      res.prefixes.forEach((folderRef) => {
         console.log("folder", folderRef._delegate._location.path_.split('/')[1])// In my case:)

      });
   }).catch((error) => {
      // Uh-oh, an error occurred!
   });


firebase.database().ref("messages").on("child_added", function (snapshot) {
   var html = "";
   let message = snapshot.val().message;
   let htmlSender = ""
   let sender = snapshot.val().sender;
   if (sender == "Dũng Admin" || sender == "Huỳnh Lucky"){
      htmlSender = `<li><span style="color: red">`
   }
   else {
      htmlSender = `<li><span>`
   }
   if (message.includes("alt=media") == true) {
      html += `${htmlSender}${snapshot.val().sender}: </span><span><img src='${snapshot.val().message}' width="50px"></span></li>`;
      document.getElementById("messages").innerHTML += html;
   }
   else {
      html += `${htmlSender}${snapshot.val().sender}: </span><span>${snapshot.val().message}</span></li>`;
      document.getElementById("messages").innerHTML += html;

   }

   // if (snapshot.val().sender == "Huỳnh Lucky" || snapshot.val().sender == "Dũng Admin"){
   //    html += `<li><span style="color: red">${snapshot.val().sender}: </span><span>${snapshot.val().message}</span></li>`;
   //    document.getElementById("messages").innerHTML += html;

   // }
   // else {
   // html += `<li><span>${snapshot.val().sender}: </span><span>${snapshot.val().message}</span></li>`;
   // document.getElementById("messages").innerHTML += html;

   // }
});
firebase.database().ref("messages").endAt().limitToLast(1).on('child_added', function(snapshot) {

   // all records after the last continue to invoke this function
   $("#messages").animate({ scrollTop: $("#messages")[0].scrollHeight }, 1000);

});



$('#message').on('keypress', function (e) {
   if (e.which === 13) {
      // console.log(userName);
      // console.log($('#message').val());
      firebase.database().ref("messages").push().set({
         "sender": userName,
         "message": $('#message').val()
      });
      $("#messages").animate({ scrollTop: $("#messages")[0].scrollHeight }, 1000);
      $('#message').val('');

   }
});

$(document).on("click", ".intercom-emoji-picker-emoji", function (e) {
   // input.val(input.val() + $(this) + " ");
   let span = $(this)[0]
   let img = span.children[0]
   firebase.database().ref("messages").push().set({
      "sender": userName,
      "message": img.src
   });
   $("#messages").animate({ scrollTop: $("#messages")[0].scrollHeight }, 1000);
   $(".intercom-composer-emoji-popover").removeClass("active");
});
// Add song. 

$("#add_title").click(function () {
   Swal.fire({
      title: 'Nhập ID từ ZING MP3',
      input: 'text',
      inputAttributes: {
         autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Look up',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
         return fetch(`http://192.3.60.13:3000/api/getSong/${login}`)
            .then(response => {
               if (!response.ok) {
                  throw new Error(response.statusText)
               }
               return response.json()
            })
            .catch(error => {
               Swal.showValidationMessage(
                  `Thất bại: ${error}`
               )
            })
      },
      allowOutsideClick: () => !Swal.isLoading()
   }).then((result) => {
      if (result.isConfirmed) {
         if (result.value.status == 404) {

            Swal.fire({
               title: 'Không tồn tại ID.'
            })
         }
         else {


            Swal.fire({
               title: `${result.value.title} - ${result.value.artist}`


            })

            // check if video is ended.
            // 

            $("video").each(function () {

               if (this.currentTime == this.duration) { // if end player. 
                  // update the playing ref table
                  firebase.database().ref("playing").update({
                     "artist": result.value.artist,
                     "coverArt": result.value.cover,
                     "lyrics": result.value.lyrics,
                     "streamingURL": result.value.streaming,
                     "title": result.value.title,
                     "playing_seconds": 0
                  });
               }
               else {
                  // playing
                  firebase.database().ref("playlist").push().set({
                     "artist": result.value.artist,
                     "coverArt": result.value.cover,
                     "lyrics": result.value.lyrics,
                     "streamingURL": result.value.streaming,
                     "title": result.value.title
                  });
               }
            });







         }

         // Swal.fire({
         //    title: `${result.value.login}'s avatar`,
         //    imageUrl: result.value.avatar_url
         // })
      }
   })

});



// append data. 
function appendData() {
   firebase.database().ref('playing').once('value').then(function (snapshot) {
      var tmp = null;
      var input = null;
      function ReadInput(file) {
         var rawFile = new XMLHttpRequest(); // XMLHttpRequest (often abbreviated as XHR) is a browser object accessible in JavaScript that provides data in XML, JSON, but also HTML format, or even a simple text using HTTP requests.
         rawFile.open("GET", file, false); // open with method GET the file with the link file ,  false (synchronous)
         rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) // readyState = 4: request finished and response is ready
            {
               if (rawFile.status === 200) // status 200: "OK"
               {
                  var allText = rawFile.responseText; //  Returns the response data as a string
                  input = allText;
               }
            }
         }
         rawFile.send(null); //Sends the request to the server Used for GET requests with param null
      }

      // Read RLC File. 

      ReadInput(snapshot.val().lyrics);
      // console.log(input);


      var lyricsJSON;
      var lrc = new Lyric({
         onSetLyric: function (lines) {
            var obj = { lyrics: lines };
            lyricsJSON = JSON.stringify(obj);
         }
      })
      lrc.setLyric(input);

      var _data = JSON.parse(`${lyricsJSON}`);
      console.log(_data);

      var currenttext = "";

      function align() {
         var a = $(".highlighted").height();
         var c = $(".content").height();
         var d = $(".highlighted").offset().top - $(".highlighted").parent().offset().top;
         var e = d + (a / 2) - (c / 2);
         $(".content").animate(
            { scrollTop: e + "px" }, { easing: "swing", duration: 250 }
         );
      }

      var lyricHeight = $(".lyrics").height();
      $(window).on("resize", function () {
         if ($(".lyrics").height() != lyricHeight) { //Either width changes so that a text may take up or use less vertical space or the window height changes, 2 in 1
            lyricHeight = $(".lyrics").height(); // change lyrics height. 
            align(); // align
         }
      });


      // src for audio. 
      firebase.database().ref('currentTime').once('value').then(function (second) {
         let url = snapshot.val().streamingURL + "#t=" + second.val().seconds;
         console.log(url);
         $("#music").attr('src', url).unbind("timeupdate").on("timeupdate", function () {
            var time = this.currentTime * 1000;
            var past = _data["lyrics"].filter(function (item) {
               return item.time < time;
            });
            if (_data["lyrics"][past.length] != currenttext) {
               currenttext = _data["lyrics"][past.length];
               $(".lyrics div").removeClass("highlighted");
               $(`.lyrics div:nth-child(${past.length})`).addClass("highlighted"); //Text might take up more texts, do before realigning
               align();
            }

         });
      });



      $(".playerTitle").html(snapshot.val().title);
      $(".playerArtist").html(snapshot.val().artist);
      $('.playerCover').css("background-image", `url(${snapshot.val().coverArt})`);
      $('#bgm').css("background-image", `url(${snapshot.val().coverArt})`);


      $("video").on('timeupdate', function (e) {
         var time = this.currentTime * 1000;
         var past = _data["lyrics"].filter(function (item) {
            return item.time < time;
         });
         if (_data["lyrics"][past.length] != currenttext) {
            currenttext = _data["lyrics"][past.length];
            $(".lyrics div").removeClass("highlighted");
            $(`.lyrics div:nth-child(${past.length})`).addClass("highlighted"); //Text might take up more texts, do before realigning
            align();
         }
      });


      var updateCurrent = setInterval(function () {
         $("video").each(function () {
            var previousTime = 0;
            // var currentTime = 0;
            var seekStart = null;
            var player = $(this);
            // console.log(this.currentTime);
            // firebase.database().ref("currentTime").update({ seconds: this.currentTime });

            if (this.currentTime == this.duration) { // if end player. 

               clearInterval(updateCurrent);
               // var firstID = $("#track-list").children()[0].id;  // id in HTML Page.
               // var stringID = firstID.replace("track", ""); // id in Database. 
               // console.log(stringID)
               // firebase.database().ref("playlist").child(stringID).remove();
               // $('#' + firstID).remove();

               // var listLength = $('#track-list li').length;
               // console.log(listLength);
               // firebase.database().ref("currentTime").update({ seconds: 0 });

               firebase.database().ref('playlist').once('value', function (snapshot) {
                  var nextArtist, nextTitle, nextCoverArt, nextStreaming, nextLyrics;
                  snapshot.forEach(function (childSnapshot) {
                     if (!nextArtist) {

                        nextArtist = childSnapshot.val().artist;
                        nextTitle = childSnapshot.val().title;
                        nextCoverArt = childSnapshot.val().coverArt;
                        nextStreaming = childSnapshot.val().streamingURL;
                        nextLyrics = childSnapshot.val().lyrics;

                        // delete the first element // 

                        // settimeout. 
                        function updateSong() {
                           firebase.database().ref("playing").update({
                              "artist": nextArtist,
                              "coverArt": nextCoverArt,
                              "lyrics": nextLyrics,
                              "streamingURL": nextStreaming,
                              "title": nextTitle,
                              "playing_seconds": 0
                           })

                        }

                        setTimeout(updateSong, 2500)

                     }
                  });
                  // update new playing.

               });
               // Delete the first element in playlist // 






            }


         });
      }, 1000);

      generate();

      function generate() {
         var html = "";
         for (var i = 0; i < _data["lyrics"].length; i++) {
            html += "<div";
            if (i == 0) {
               html += ` class="highlighted"`;
               currenttext = 0;
            }
            if (_data["lyrics"][i]["note"]) {
               html += ` note="${_data["lyrics"][i]["note"]}"`;
            }
            html += ">";
            html += _data["lyrics"][i]["text"] == "" ? "•" : _data["lyrics"][i]["text"];
            html += "</div>"
         }
         $(".lyrics").html(html);
         align();
      }

   });
}
appendData();



// append for current event. 

// Catching in child_changed playing. 
firebase.database().ref("playing").on("child_changed", function (snapshot) {
   if (snapshot.key == "title") {
      console.log("has changed");
      try {
         var firstID = $("#track-list").children()[0].id;  // id in HTML Page.
         var stringID = firstID.replace("track", ""); // id in Database. 
         // console.log(stringID)
         firebase.database().ref("playlist").child(stringID).remove();
         $('#' + firstID).remove();
      } catch (error) {

      }
      firebase.database().ref("currentTime").update({ seconds: 0 });
      appendData();
   }
});

firebase.database().ref("playlist").on("child_added", function (snapshot) {

   var html = "";
   html += `<li class="list_item" id="track${snapshot.key}">`;
   html += `<div class="thumb" style="background-image: url(${snapshot.val().coverArt})"> </div><div class="info">`;
   html += `<div class="title">${snapshot.val().title}</div>`
   html += `<div class="artist">${snapshot.val().artist}</div>`
   html += '</div></li>'


   // console.log(html);

   // if(snapshot.val().sender == myName){
   //     html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
   //     html += "Delete";
   //     html += "</button>";
   // }
   // html+= snapshot.val().sender + ": " + snapshot.val().message;
   // html+= "</li>";
   document.getElementById("track-list").innerHTML += html;

});