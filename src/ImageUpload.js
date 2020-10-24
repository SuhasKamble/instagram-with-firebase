import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import './ImageUpload.css'
import db, {storage} from './firebase'
import firebase from 'firebase'
function ImageUpload({username}) {
    const [caption,setCaption] = useState('')
    const [image,setImage] = useState(null)
    const [progress,setProgress] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };
    
      const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // progress function
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            // Error Function
            console.log(error);
            alert(error.message);
          },
          () => {
            // complete  function
            storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                db.collection("posts").add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  caption: caption,
                  imageUrl: url,
                  username: username,
                });
                setProgress(0);
                setCaption("");
                setImage(null); 
              });
          }
        );
      };
    return (
        <div className="imageUpload">
            <progress value={progress} max="100"></progress>
           <Input placeholder="Enter a caption..."
           value={caption} onChange={(e)=>setCaption(e.target.value)} type="text" />
           <input type="file" onChange={handleChange}/>
           <Button onClick={handleUpload}>
               Upload
           </Button>
        </div>
    )
}

export default ImageUpload
