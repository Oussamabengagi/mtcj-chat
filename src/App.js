import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';



import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDcw-IsaKvn5GffoOqiOfQdaJyYyHp5Psw",
  authDomain: "chat-mtcj.firebaseapp.com",
  projectId: "chat-mtcj",
  storageBucket: "chat-mtcj.appspot.com",
  messagingSenderId: "6458113346",
  appId: "1:6458113346:web:10c7b692632cd3b5461cdb",
  measurementId: "G-SS79G3JH71"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header>
      <img src="https://i.ibb.co/QrXJD8j/loader.gif" alt="img" />
      <h1>MTCJ TEAM !</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>
      <h2> Oussama Bengagi</h2>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (

    <button className="button-33" role="button" onClick={signInWithGoogle}>Sign in with Google</button>
  )

}
function SignOut(){
  return auth.currentUser && (

    <button className="button-33" role="button"  onClick={() => auth.signOut()}>Sign Out</button>
    
  )
}

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }



  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="what is on your mind !" />

      <button type="submit" disabled={!formValue}>>></button>

    </form>
  </>)
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
