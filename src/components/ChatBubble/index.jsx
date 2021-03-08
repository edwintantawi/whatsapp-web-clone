import React from 'react';
import './index.scss';

function ChatBubble({ myMessage, username, message }) {
  return (
    <div className={`chatbubble ${myMessage ? 'me' : ''}`}>
      <div className='chatbubble__bubble'>
        <div className='chatbubble__bubble__tail'>
          <svg
            width='7'
            height='13'
            viewBox='0 0 7 13'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              opacity='0.13'
              d='M0.532642 3.568L6.99964 12.193V1H1.81164C0.0416422 1 -0.526358 2.156 0.532642 3.568Z'
              fill='black'
            />
            <path
              id='tail-fill'
              d='M0.532642 2.568L6.99964 11.193V0H1.81164C0.0416422 0 -0.526358 1.156 0.532642 2.568Z'
              fill='white'
            />
          </svg>
        </div>
        <div className='chatbubble__bubble__name'>
          {myMessage ? '' : username}
        </div>
        <div className='chatbubble__bubble__text'>{message}</div>
        <div className='chatbubble__bubble__status'>
          <span className='time'>21:22</span>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
