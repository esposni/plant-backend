import React from 'react';
import axios from 'axios';


import './App.css';

class App extends React.Component {

  state = {
    posts:{}
  };

  componentDidMount = () => {
    this.getBlogPost();
  };


  getBlogPost = () => {
    axios.get('/api')
      .then((response) => {
        const data = response.data;
        console.log(data);
        this.setState({ posts: data });
        console.log('Data has been received!!');
      })
      .catch(() => {
        alert('Error retrieving data!!!');
      });
  }

  
  displayBlogPost = (posts) => {

    if (!posts.length) return null;
   

    return posts.map((post, index) => (
      <div key={index} className="blog-post__display">
        <h3>Values saved</h3>
        <p>humidity: {post.humidity}</p>
        <p>luminosity: {post.luminosity}</p>
        <p>temperature: {post.temperature}</p>
    <p>time: {new Date(parseInt(post.date)).getHours()}:{new Date(parseInt(post.date)).getMinutes()}</p>
      </div>
    ));
  };

  render() {

    // console.log('State: ', this.state);

    //JSX
    return(
      <div className="app">
        <h2>Welcome to the values monitor of the PlantIOT</h2>

        <div className="blog-">
          {this.displayBlogPost(this.state.posts)}
        </div>
      </div>
    );
  }
}


export default App;