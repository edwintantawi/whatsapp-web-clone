import { Button } from '@material-ui/core';
import { useStateValue } from 'context/stateProvider';
import React, { useRef, useState } from 'react';
import firebase, { db } from 'services/firebase';
import './index.scss';

const Modal = ({ id, title, text, type }) => {
  const [{ profile }] = useStateValue();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const modal = useRef(null);

  const handleCloseModal = () => {
    const modalLayer = document.querySelector(`#modal-layer`);
    modal.current.classList.toggle('modal--active');
    modalLayer.classList.toggle('modal__layer--active');
    setInput('');
    setError('');
    setSuccess('');
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (input !== '') {
      const newFriend = db.collection('users').where('username', '==', input);
      newFriend
        .get()
        .then((data) => {
          if (data.empty) {
            setError(`User Not Found with username "${input}"`);
          } else {
            const friendData = data.docs[0].data();
            let alreadyFriend = false;
            profile.friends.forEach((friend) => {
              if (friend === friendData.uid) {
                setError(`username "${input}" already become your friend`);
                setSuccess('');
                alreadyFriend = true;
              }
            });
            if (profile.uid === friendData.uid) {
              setError(`can't add myself as a friend`);
              setSuccess('');
              alreadyFriend = true;
            }
            if (!alreadyFriend) {
              db.collection('users')
                .doc(profile.uid)
                .update({
                  friends: firebase.firestore.FieldValue.arrayUnion(
                    friendData.uid
                  ),
                })
                .then((e) => {
                  setError('');
                  setSuccess(
                    `you have successfully added @${input} as a friend`
                  );
                });
            }
          }
        })
        .catch((error) => {
          console.error('error : ', error);
        });
    }
  };

  const handleChangeUsername = (e) => {
    e.preventDefault();
    if (input !== '') {
      if (input.length < 10 || input.length > 16) {
        setError(
          'You need a minimum of 10, and a maximum of 16 characters for the username'
        );
        setSuccess('');
      } else {
        let isAlready = false;
        db.collection('users')
          .where('username', '==', input)
          .get()
          .then((data) => {
            console.info('is empty : ', data.empty);
            if (!data.empty) {
              isAlready = true;
            }
            console.info('is ready : ', isAlready);
            if (!isAlready) {
              db.collection('users')
                .doc(profile.uid)
                .update({
                  username: input,
                })
                .then(() => {
                  setSuccess(
                    'yey.., you have successfully changed your username'
                  );
                  setError('');
                  setInput('');
                });
            } else {
              setError(
                'This username is already in use, try using something else'
              );
              setSuccess('');
            }
          });
      }
    }
  };

  return (
    <div className="modal" id={id} ref={modal}>
      <div className="modal__head">
        <h2>{title}</h2>
      </div>
      <form
        className="modal__body"
        onSubmit={(e) => {
          switch (type) {
            case 'addFriend':
              handleAddFriend(e);
              break;
            case 'changeUsername':
              handleChangeUsername(e);
              break;
            default:
              console.info('invalid action');
              break;
          }
        }}
      >
        <p className="modal__text">{text}</p>
        <div className="modal__input">
          <span className="modal__placeholder">@</span>
          <input
            type="text"
            className="modal__textbox"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {error && <div className="modal__error">{error}</div>}
        {success && <div className="modal__success">{success}</div>}
        <div className="modal__action">
          <Button className="modal_button modal__button--submit" type="submit">
            Add
          </Button>
          <Button className="modal_button" onClick={handleCloseModal}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
