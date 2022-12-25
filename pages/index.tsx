import { NextPage } from 'next'
import Head from 'next/head'

const IndexPage: NextPage = () => {
  const turn = (value: boolean) => {
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
    <>
      <Head>
        <title>サンプル実装</title>
      </Head>
      <main>
        <div>
          <button onClick={turnOn}>ON</button>
          <button onClick={turnOff}>OFF</button>
        </div>
      </main>
    </>
  )
}

export default IndexPage
