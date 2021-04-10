import React from 'react';

import phone from 'assets/images/phone.png';
import './index.scss';
// import { storage } from 'services/firebase';

const Lobby = () => {
  // const [image, setImage] = useState({});

  // useEffect(() => {
  //   const ref = storage.ref();
  //   const task = ref.child('inigambar').put(image, '');
  //   task.then(() => {
  //     storage
  //       .ref('inigambar')
  //       .getDownloadURL()
  //       .then(function (url) {
  //         console.log(url);
  //       });
  //   });
  // }, [image]);

  return (
    <div className="lobby">
      <div className="wraper">
        <img src={phone} alt={phone} />
        <h1>Keep Connected to other</h1>
        <p>
          This is only Whatsapp clone, all your data is save, select chat in
          left sidebar for start a chat
        </p>
        {/* <input
          type='file'
          name='image'
          id='image'
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        /> */}
      </div>
    </div>
  );
};

export default Lobby;
