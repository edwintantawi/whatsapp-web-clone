import React from 'react';

import phone from 'assets/images/phone.png';
import './index.scss';

function Lobby() {
  return (
    <div className='lobby'>
      <div className='wraper'>
        <img src={phone} alt={phone} />
        <h1>Keep Connected to other</h1>
        <p>
          This is only Whatsapp clone, all your data is save, select chat in
          left sidebar for start a chat
        </p>
      </div>
    </div>
  );
}

export default Lobby;
