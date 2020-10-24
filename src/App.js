import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import db from './firebase';
import Posts from './Posts';
import {auth,storage} from './firebase'
import { SignalCellularNullSharp } from '@material-ui/icons';
import ImageUpload from './ImageUpload';

// modal styles
function getModalStyle() {
  const top = 50 ;
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  // states
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open,setOpen] = useState(false)
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [openSignin,setOpenSignIn] = useState(false)
  const [user,setUser] = useState(null)
// listening for auth user
useEffect(()=>{
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      console.log(authUser)
      setUser(authUser)

   
    }
    else{
      setUser(null)
    }
  })
  return ()=>{
    unsubscribe()
  }
},[user,username])

  // fetching data from the dtatabase
  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

// signup function
const signUp=(e)=>{
  e.preventDefault()
  auth.createUserWithEmailAndPassword(email,password)
  .then((authUser)=>{
    authUser.user.updateProfile({
      displayName:username,
    })
  })
  .catch(error=>alert(error.message))
  
  setOpen(false)
  setEmail("")
  setPassword("")
  setUsername("")
}

// sign in function
const signIn=(e)=>{
  e.preventDefault()
  auth.signInWithEmailAndPassword(email,password)
  .catch(error=>alert(error.message))
  setOpenSignIn(false)
  setEmail("")
  setPassword("")
  
}
  
  return (
    
    <div className="app">
  

      {/* Sign Up Modal  */}
          <Modal
          open={open}
          onClose={()=>setOpen(false)}
          >
<div style={modalStyle} className={classes.paper}>
  <form className="app__signup">
<center>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/294px-Instagram_logo.svg.png" alt="" className="app__headerImage" />
  </center> 
  <Input type="text" value={username} placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
  <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
  <Input placeholder="Passoword" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
  <Button type="submit" onClick={signUp}>Sign Up</Button>
  
  </form>
</div>
      </Modal>

      {/* for sign in */}
      <Modal
          open={openSignin}
          onClose={()=>setOpenSignIn(false)}
          >
<div style={modalStyle} className={classes.paper}>
  <form className="app__signup">
<center>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/294px-Instagram_logo.svg.png" alt="" className="app__headerImage" />
  </center> 
  {/* <Input type="text" value={username} placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/> */}
  <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
  <Input placeholder="Passoword" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
  <Button type="submit" onClick={signIn}>Sign in</Button>
  
  </form>
</div>
      </Modal>
      <div className="app__header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/294px-Instagram_logo.svg.png" alt="" className="app__headerImage" />
        {
        user?(
          <Button onClick={()=>auth.signOut()} >Logout</Button>
          
        ):(
          <div className="app__loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign IN</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )
      }
      </div>
     <div className="app__post">
     {
        posts.map(({ id, post }) => (
          <Posts user={user} postId={id} key={id} imageUrl={post.imageUrl} caption={post.caption} username={post.username} />
        ))
      }
          {user?.displayName?(
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry you need to login to upload</h3>
      )}

     </div>
    

    </div>
  );
}

export default App;
