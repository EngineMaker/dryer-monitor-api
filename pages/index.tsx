import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  const turn = (value) => {
    fetch('/.netlify/functions/dryer-switch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ switch: value }),
    })
  }

  const turnOn = () => {
    turn(true)
  }
  const turnOff = () => {
    turn(false)
  }

  return (
    <div>
      <button onClick={turnOn}>ON</button>
      <button onClick={turnOff}>OFF</button>
    </div>
  )
}

export default IndexPage
