import React, { Component } from 'react';  
import Navigation from "./Components/Navigation/Navigation";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import Rank from './Components/Rank/Rank';
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FaceDetection from './Components/FaceDetection/FaceDetection';
import Logo from './Components/Logo/Logo';
import ParticlesBg from 'particles-bg';
import './App.css';

const Particles = () => {
  return (
    <>
        <div>...</div>
        <ParticlesBg
          type="cobweb" 
          bg={true} 
          num={30}
          speed={0.1}
        />
      </>
  )
};

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  userIsSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: new Date()
  }
}

class App extends Component {
constructor() {
  super();
  this.state = initialState;
}; 

loadUser = (data) => {
  this.setState ({user: {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  }})
  }  

locateFacePosition = (data) => {
  const facePosition = data.outputs[0].data.regions[0].region_info.bounding_box;
  const Image = document.getElementById('image');
  const width = Number(Image.width);
  const height = Number(Image.height);
  return {
    leftCol: facePosition.left_col * width,
    topRow:  facePosition.top_row * height,
    rightCol:  width - (facePosition.right_col * width),
    bottomRow:  height - (facePosition.bottom_row * height)
  }
};

faceDetector = (box) => {
  this.setState({box: box})
};

onInputChange = (event) => {
  this.setState({input: event.target.value})
};

onPictureSubmit = () => {
this.setState({imageUrl: this.state.input})
fetch('http://localhost:3000/imageurl', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        input: this.state.input 
    })
  })
.then(res => res.json())
.then(res => {
  if (res) {
    fetch('http://localhost:3000/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          id: this.state.user.id 
      })
    })
    .then(res => res.json())
    .then(count => {
      this.setState( Object.assign(this.state.user, {entries: count}))
    })
    .catch(console.log)
  }
  this.faceDetector(this.locateFacePosition(res))
})
    .catch(err => console.log(err))
};

onRouteChange = (route) => {
  if (route === 'home') {
      this.setState({userIsSignedIn: true})
    }
     else if (route === 'signin') {
      this.setState (initialState)
  }
  this.setState({ route: route })
};

  render() {
    const {box, imageUrl, userIsSignedIn, route} = this.state
    return (
      <div className="App">
        <Particles />
        <Navigation userIsSignedIn={userIsSignedIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home' 
        ? <div> 
            <Logo />
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} 
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onPictureSubmit={this.onPictureSubmit} 
            />
            <FaceDetection 
              box={box} 
              imageUrl={imageUrl} 
             />
          </div> 
        : (
          this.state.route === 'signin' ?
          <SignIn 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange} 
            />
          : 
          <Register 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange} 
            />
        )
        
        
        };
      </div>
    );
  };
};

export default App;
