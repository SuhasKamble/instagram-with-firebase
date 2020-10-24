import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import db from './firebase'
import firebase from 'firebase'
import './Posts.css'
function Posts({imageUrl,username,caption,postId,user}) {
    const [comments,setComments] = useState([])
    const [input,setInput] = useState("")

    useEffect(()=>{
        let unsubscribe;
        if(postId){
             unsubscribe = db.collection("posts").doc(postId).collection('comments').orderBy("timestamp",'desc').onSnapshot(snapshot=>{
                setComments(snapshot.docs.map(doc=>doc.data()))
            })
        }
        return ()=>{
            unsubscribe()
        }
    },[postId])
const postComment=(e)=>{
    e.preventDefault()
    db.collection('posts').doc(postId).collection('comments').add({
        text:input,
        username:user.displayName,
        timestamp:firebase.firestore.FieldValue .serverTimestamp()
    })
    setInput("")
}
    return (
        <div className="posts">
            <div className="posts__header">

        <Avatar
        className="posts__avatar"
        alt={username}
      />
        <h3>{username}</h3>
            </div>
            
            <img className="posts__image" src={imageUrl} alt=""/>
    <h4 className="posts__text"><strong>{username}</strong>: {caption}</h4>
    <div className="post__comments">
    {
    comments.map(comment=>(
        <p>
            <strong>{comment.username}</strong> {comment.text}
        </p>
    ))
}
    </div>
    {user &&(
   <form className="post__commentBox">
   <input type="text" placeholder="Enter a comment..." className="post__input" value={input} onChange={e=>setInput(e.target.value)}/>
   <button type="submit" onClick={postComment}className="post__button">Post</button>
</form>
    )}

 
        </div>
    )
}

export default Posts
