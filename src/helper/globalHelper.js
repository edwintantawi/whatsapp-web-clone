// handle timestamp
export const handleTimeStamp = (timestamp, isSending = false) => {
  let formatedTimestamp = '';
  const time = new Date(timestamp?.seconds * 1000);
  formatedTimestamp = `${formatTime(time.getHours())}:${formatTime(
    time.getMinutes()
  )}`;

  if (formatedTimestamp === 'NaN:NaN') {
    if (isSending) {
      const nowDate = new Date();
      return `${formatTime(nowDate.getHours())}:${formatTime(
        nowDate.getMinutes()
      )} sending...`;
    }

    return 'Sending Message ...';
  }

  if (!isSending) return `last seen at ${formatedTimestamp}`;

  return formatedTimestamp;
};

const formatTime = (time) => {
  return time < 10 ? `0${time}` : time;
};
