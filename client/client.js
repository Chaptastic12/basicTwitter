const form = document.querySelector('form');
const loading = document.querySelector('.loading');
const tweetArea = document.querySelector('.tweetArea');

const API_URL = 'http://localhost:5000/tweets';

loading.style.display = '';

listAllTweets();

form.addEventListener('submit',  (event) => {
     event.preventDefault();
     const formData = new FormData(form);
     const name = formData.get('name');
     const comment = formData.get('comment');

     const tweet = {
          name,
          comment
     };
     form.style.display='none';
     loading.style.display='';

     fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify(tweet),
          headers: {
               'content-type' : 'application/json'
          }
     }).then(response => response.json()).then(createdTweet => {
          form.reset();
          loading.style.display='none';
          form.style.display='';
          listAllTweets();
     });
});

function listAllTweets() {
     //Clear everything
     tweetArea.innerHTML = "";

     //reach out to our server with a GET request
     fetch(API_URL)
          .then(response => response.json()) //get our response json
               .then(tweets => { 
                    tweets.reverse();
                    tweets.forEach(tweet =>{
                         const div = document.createElement('div');

                         const header = document.createElement('h3');
                         header.textContent = tweet.name;

                         //be careful, as comments got changed to 'tweet' on the server end...be careful of this in the future
                         const contents = document.createElement('p');
                         contents.textContent = tweet.tweet;

                         const date = document.createElement('small');
                         date.textContent = new Date(tweet.created);

                         div.appendChild(header);
                         div.appendChild(contents);
                         div.appendChild(date);

                         tweetArea.appendChild(div);
                    });
                    loading.style.display='none';
               })
}